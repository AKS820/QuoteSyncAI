const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/summary', async (req, res) => {
  try {
    const [
      totalUsers,
      allPageViews,
      videoPlays,
      videoCompletes,
      demoStarts,
      demoCompletes,
      roiCalcs,
      purchaseIntentEvents,
      agentQuestionCount,
      recentQuestions
    ] = await Promise.all([
      prisma.user.count(),

      prisma.event.findMany({
        where: { event_type: 'page_view' },
        select: { user_id: true, metadata: true }
      }),

      prisma.event.groupBy({
        by: ['metadata'],
        where: { event_type: 'video_play' },
        _count: true
      }),

      prisma.event.groupBy({
        by: ['metadata'],
        where: { event_type: 'video_complete' },
        _count: true
      }),

      prisma.event.count({ where: { event_type: 'demo_start' } }),
      prisma.event.count({ where: { event_type: 'demo_complete' } }),

      prisma.roiCalculation.findMany({
        select: { result: true, created_at: true },
        orderBy: { created_at: 'desc' },
        take: 100
      }),

      prisma.event.findMany({
        where: { event_type: 'purchase_intent' },
        select: { metadata: true }
      }),

      prisma.event.count({ where: { event_type: 'agent_question' } }),

      prisma.event.findMany({
        where: { event_type: 'agent_question' },
        select: { metadata: true, timestamp: true },
        orderBy: { timestamp: 'desc' },
        take: 10
      })
    ]);

    const stageCounts = {};
    for (let i = 0; i <= 6; i++) stageCounts[i] = new Set();
    allPageViews.forEach(e => {
      const stage = e.metadata?.stage;
      if (stage !== undefined && stageCounts[parseInt(stage)]) {
        if (e.user_id) stageCounts[parseInt(stage)].add(e.user_id);
      }
    });
    const stageFunnel = Object.entries(stageCounts).map(([stage, userSet]) => ({
      stage: parseInt(stage),
      users: userSet.size,
      pct: totalUsers > 0 ? Math.round((userSet.size / totalUsers) * 100) : 0
    }));

    const videoStats = {};
    videoPlays.forEach(g => {
      const vid = g.metadata?.video_id || 'unknown';
      if (!videoStats[vid]) videoStats[vid] = { plays: 0, completes: 0 };
      videoStats[vid].plays += g._count;
    });
    videoCompletes.forEach(g => {
      const vid = g.metadata?.video_id || 'unknown';
      if (!videoStats[vid]) videoStats[vid] = { plays: 0, completes: 0 };
      videoStats[vid].completes += g._count;
    });

    const tierCounts = {};
    purchaseIntentEvents.forEach(e => {
      const tier = e.metadata?.tier || 'Unknown';
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });

    const roiValues = roiCalcs
      .map(c => c.result?.roi)
      .filter(v => typeof v === 'number');
    const avgRoi = roiValues.length
      ? Math.round(roiValues.reduce((a, b) => a + b, 0) / roiValues.length)
      : 0;

    res.json({
      totalUsers,
      stageFunnel,
      videoStats,
      demo: { starts: demoStarts, completes: demoCompletes, completionRate: demoStarts > 0 ? Math.round((demoCompletes / demoStarts) * 100) : 0 },
      roi: { totalCalculations: roiCalcs.length, avgRoiPct: avgRoi },
      purchaseIntents: { total: purchaseIntentEvents.length, byTier: tierCounts },
      agentQuestions: { total: agentQuestionCount, recent: recentQuestions.map(e => ({ question: e.metadata?.question, timestamp: e.timestamp })) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

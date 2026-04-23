const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/summary', async (req, res) => {
  try {
    const [
      totalUsers,
      allPageViews,
      demoStarts,
      demoCompletes,
      purchaseIntentEvents,
      meetingRequests,
      ctaClickEvents,
      agentQuestionCount,
      recentQuestions
    ] = await Promise.all([
      prisma.user.count(),

      prisma.event.findMany({
        where: { event_type: 'page_view' },
        select: { user_id: true, metadata: true }
      }),

      prisma.event.count({ where: { event_type: 'demo_start' } }),
      prisma.event.count({ where: { event_type: 'demo_complete' } }),

      prisma.event.findMany({
        where: { event_type: 'purchase_intent' },
        select: { metadata: true }
      }),

      // Users who submitted the meeting request form
      prisma.user.count({ where: { role: 'meeting_request' } }),

      // All CTA clicks with labels
      prisma.event.findMany({
        where: { event_type: 'cta_click' },
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

    // Stage funnel — 4 stages (0–3)
    const stageCounts = {};
    for (let i = 0; i <= 3; i++) stageCounts[i] = new Set();
    allPageViews.forEach(e => {
      const stage = parseInt(e.metadata?.stage);
      if (!isNaN(stage) && stageCounts[stage]) {
        if (e.user_id) stageCounts[stage].add(e.user_id);
      }
    });
    const stageFunnel = Object.entries(stageCounts).map(([stage, userSet]) => ({
      stage: parseInt(stage),
      users: userSet.size,
      pct: totalUsers > 0 ? Math.round((userSet.size / totalUsers) * 100) : 0
    }));

    // Purchase intent by tier
    const tierCounts = {};
    purchaseIntentEvents.forEach(e => {
      const tier = e.metadata?.tier || 'Unknown';
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });

    // CTA click breakdown
    const ctaCounts = {};
    ctaClickEvents.forEach(e => {
      const cta = e.metadata?.cta || 'unknown';
      ctaCounts[cta] = (ctaCounts[cta] || 0) + 1;
    });

    res.json({
      totalUsers,
      stageFunnel,
      demo: { starts: demoStarts, completionRate: demoStarts > 0 ? Math.round((demoCompletes / demoStarts) * 100) : 0 },
      meetingRequests: meetingRequests,
      purchaseIntents: { total: purchaseIntentEvents.length, byTier: tierCounts },
      ctaClicks: { total: ctaClickEvents.length, byCta: ctaCounts },
      agentQuestions: { total: agentQuestionCount, recent: recentQuestions.map(e => ({ question: e.metadata?.question, timestamp: e.timestamp })) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset', async (req, res) => {
  if (req.body?.password !== 'quoteguard-admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({});
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

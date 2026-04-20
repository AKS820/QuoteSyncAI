const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { user_id, email, inputs, result } = req.body;
    if (!inputs || !result) return res.status(400).json({ error: 'inputs and result required' });

    let resolvedUserId = user_id;
    if (!resolvedUserId && email) {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email }
      });
      resolvedUserId = user.id;
    }

    const calc = await prisma.roiCalculation.create({
      data: { user_id: resolvedUserId || null, inputs, result }
    });

    console.log(`ROI report requested for ${email || 'anonymous'} — Total Value: $${result.totalValue?.toLocaleString()}`);
    res.status(201).json({ id: calc.id, message: 'ROI report saved. Check your inbox shortly.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const calcs = await prisma.roiCalculation.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
      include: { user: { select: { email: true, company: true } } }
    });
    res.json(calcs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

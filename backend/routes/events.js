const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { user_id, event_type, metadata } = req.body;
    if (!event_type) return res.status(400).json({ error: 'event_type required' });

    const event = await prisma.event.create({
      data: { user_id: user_id || null, event_type, metadata: metadata || {} }
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { event_type, limit = 100 } = req.query;
    const events = await prisma.event.findMany({
      where: event_type ? { event_type } : undefined,
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit)
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

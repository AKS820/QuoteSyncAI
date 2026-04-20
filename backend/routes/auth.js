const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email }
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await prisma.magicLink.create({
      data: { user_id: user.id, token, expires_at }
    });

    const link = `${process.env.APP_URL || 'http://localhost:5173'}/auth/verify?token=${token}`;
    console.log(`\n[MAGIC LINK] ${email}\n${link}\n`);

    res.json({ message: 'Magic link sent (check server console in dev mode)', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const link = await prisma.magicLink.findUnique({
      where: { token: req.params.token },
      include: { user: true }
    });

    if (!link) return res.status(400).json({ error: 'Invalid token' });
    if (link.used) return res.status(400).json({ error: 'Token already used' });
    if (link.expires_at < new Date()) return res.status(400).json({ error: 'Token expired' });

    await prisma.magicLink.update({ where: { id: link.id }, data: { used: true } });

    res.json({ userId: link.user_id, email: link.user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

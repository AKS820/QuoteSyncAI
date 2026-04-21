require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(helmet());
app.use(cors({
  origin: isProd ? process.env.FRONTEND_URL : '*',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Tight limit on the AI chat endpoint — Claude calls cost money
app.use('/api/chat', rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false }));
// General API limit
app.use('/api', rateLimit({ windowMs: 60_000, max: 300, standardHeaders: true, legacyHeaders: false }));

app.use('/api/events',    require('./routes/events'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/roi',       require('./routes/roi'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/chat',      require('./routes/chat'));
app.use('/api/demo',      require('./routes/demo'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  if (!isProd) console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`QuoteSync API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

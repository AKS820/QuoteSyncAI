require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/events',    require('./routes/events'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/roi',       require('./routes/roi'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/chat',      require('./routes/chat'));
app.use('/api/demo',      require('./routes/demo'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`QuoteSync API running on port ${PORT}`);
});

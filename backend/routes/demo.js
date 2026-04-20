const express = require('express');
const router = express.Router();

const SAP_URL = process.env.MOCK_SAP_URL || 'http://localhost:3001';
const CPQ_URL = process.env.MOCK_CPQ_URL || 'http://localhost:3002';

async function proxy(url, options = {}) {
  const res = await fetch(url, options);
  return res.json();
}

router.get('/sap/products', async (_req, res) => {
  try {
    const data = await proxy(`${SAP_URL}/api/sap/products`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'SAP service unavailable', detail: err.message });
  }
});

router.get('/sap/price-list', async (_req, res) => {
  try {
    const data = await proxy(`${SAP_URL}/api/sap/price-list`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'SAP service unavailable', detail: err.message });
  }
});

router.post('/sap/update-price', async (req, res) => {
  try {
    const data = await proxy(`${SAP_URL}/api/sap/update-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'SAP service unavailable', detail: err.message });
  }
});

router.get('/cpq/quotes', async (_req, res) => {
  try {
    const data = await proxy(`${CPQ_URL}/api/cpq/quotes`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'CPQ service unavailable', detail: err.message });
  }
});

router.post('/cpq/sync', async (req, res) => {
  try {
    const data = await proxy(`${CPQ_URL}/api/cpq/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'CPQ service unavailable', detail: err.message });
  }
});

router.get('/cpq/sync/:job_id', async (req, res) => {
  try {
    const data = await proxy(`${CPQ_URL}/api/cpq/sync/${req.params.job_id}`);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'CPQ service unavailable', detail: err.message });
  }
});

module.exports = router;

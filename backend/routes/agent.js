const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');

// Files stay in memory — never written to disk
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Orchestrate API helper ───────────────────────────────────────────────────
// Set these in your backend .env:
//   WXO_URL        — e.g. https://us-south.ml.cloud.ibm.com
//   WXO_API_KEY    — your IBM Cloud API key
//   WXO_AGENT_ID   — e.g. evco_quote_processing_manager
//   WXO_SPACE_ID   — your Orchestrate deployment space ID

async function getIAMToken() {
  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${process.env.WXO_API_KEY}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Failed to get IAM token');
  return data.access_token;
}

async function callOrchestrate(prompt) {
  const token = await getIAMToken();
  const url = `${process.env.WXO_URL}/v1/agent_deployments/${process.env.WXO_AGENT_ID}/run`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { text: prompt },
      space_id: process.env.WXO_SPACE_ID,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Orchestrate API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  // Response shape varies — extract the agent's reply text
  return (
    data?.output?.text ||
    data?.results?.[0]?.generated_text ||
    data?.message ||
    JSON.stringify(data)
  );
}

// ─── Route: GET /api/agent/wxo-token ─────────────────────────────────────────
// Returns a short-lived IBM IAM token so the frontend can satisfy the
// authTokenNeeded event fired by the Orchestrate embed widget.
router.get('/wxo-token', async (_req, res) => {
  try {
    const token = await getIAMToken();
    res.json({ token });
  } catch (err) {
    console.error('IAM token error:', err.message);
    res.status(500).json({ error: 'Could not obtain auth token' });
  }
});

// ─── Route: POST /api/agent/process ──────────────────────────────────────────
router.post('/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Extract text from PDF; fall back to raw buffer string for non-PDFs
    let quoteText;
    if (req.file.mimetype === 'application/pdf') {
      const parsed = await pdf(req.file.buffer);
      quoteText = parsed.text;
    } else {
      quoteText = req.file.buffer.toString('utf-8');
    }

    if (!quoteText?.trim()) {
      return res.status(422).json({ error: 'Could not extract text from the uploaded file' });
    }

    const prompt = `Process the following quote extracted from an uploaded document.

${quoteText}

Run the full quote processing workflow: verify the customer, validate all part numbers, check pricing and MOQ compliance for each line, then approve or escalate accordingly. Provide a clear summary of the outcome for every line item.`;

    const reply = await callOrchestrate(prompt);
    res.json({ reply });
  } catch (err) {
    console.error('Agent route error:', err.message);
    res.status(500).json({ error: err.message || 'Agent processing failed' });
  }
});

// ─── Route: GET /api/agent/sample ────────────────────────────────────────────
// Returns the sample quote HTML so the frontend can offer a download
const path = require('path');
const fs = require('fs');

router.get('/sample', (_req, res) => {
  const samplePath = path.resolve(
    __dirname,
    '../../evco-quote-agent-package/tests/sample_quote.html'
  );
  if (!fs.existsSync(samplePath)) {
    return res.status(404).json({ error: 'Sample file not found' });
  }
  res.setHeader('Content-Disposition', 'attachment; filename="sample_quote.html"');
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(samplePath);
});

module.exports = router;

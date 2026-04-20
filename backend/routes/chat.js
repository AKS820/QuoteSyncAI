const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const QUINN_SYSTEM = `You are Quinn, a knowledgeable product specialist for QuoteSync AI. Be concise, helpful, and direct. Keep responses under 150 words.

PRODUCT OVERVIEW:
QuoteSync AI uses autonomous AI agents to keep quoting systems and ERPs perfectly aligned. Three agents work together: Quote Watcher (scans CPQ for new/updated quotes), ERP Validator (cross-references against ERP master data), and Auto-Updater (corrects mismatches automatically with configurable approval workflows).

TARGET CUSTOMER: Mid-market manufacturing companies ($50M-$1B revenue) with 100-5,000 active quotes/month.

PRICING:
- Starter: $1,500/month — 1 ERP + 1 CPQ integration, up to 500 quotes/month, email support
- Growth: $2,200/month — 2 integrations each, up to 2,000 quotes/month, Slack support, ROI dashboard
- Enterprise: Custom — unlimited integrations, dedicated agent config, SLA, custom training

INTEGRATIONS: SAP, Salesforce CPQ, Oracle ERP, HubSpot, Microsoft Dynamics, custom REST APIs.

TYPICAL ROI:
- Eliminates 4-10 hours/week of manual sync per ops staff member
- Reduces pricing errors 85%+
- Average annual savings: $45K-$120K
- Payback period: 2-4 months

SETUP: 3 weeks average. Week 1: API connections. Week 2: agent config + rules. Week 3: testing, pilot, training.

SECURITY: All pricing data encrypted in transit and at rest. SOC 2 Type II compliant. No on-premise installation required.

CONTRACT: Month-to-month available. Annual contract saves 15%. 14-day free trial on Starter and Growth.

If asked about pricing, say it's covered in the pricing section further down the page.
If asked about integrations or setup, mention the Implementation Guide section on the page.
Never ask for personal information.`;

router.post('/', async (req, res) => {
  try {
    const { messages, user_id } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
    if (lastUserMessage?.content) {
      const sanitized = lastUserMessage.content.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]');
      await prisma.event.create({
        data: {
          user_id: user_id || null,
          event_type: 'agent_question',
          metadata: { question: sanitized.slice(0, 200) }
        }
      }).catch(() => {});
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: QUINN_SYSTEM,
      messages: messages.slice(-10)
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Quinn is temporarily unavailable. Please try again.' });
  }
});

module.exports = router;

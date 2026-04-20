const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ROLES = ['VP of Sales', 'Director of Sales Ops', 'RevOps Manager', 'Pricing Manager', 'CRO'];
const COMPANIES = [
  'Midwest Precision Machining', 'Lake Shore Industries', 'Atlas Fabrication Group',
  'Pinnacle Plastics Inc.', 'Redstone Components LLC', 'Apex Metal Works',
  'Central Valley Manufacturing', 'Summit Industrial Supply'
];
const EVENT_TYPES = [
  'page_view', 'video_play', 'video_complete', 'demo_start', 'demo_action',
  'agent_question', 'roi_calculated', 'cta_click', 'purchase_intent', 'demo_complete'
];

async function main() {
  const existing = await prisma.user.count();
  if (existing > 0) {
    console.log('Database already seeded — skipping.');
    return;
  }

  const users = [];
  for (let i = 0; i < 8; i++) {
    const user = await prisma.user.create({
      data: {
        email: `demo${i + 1}@${COMPANIES[i].toLowerCase().replace(/\s+/g, '')}.com`,
        company: COMPANIES[i],
        role: ROLES[i % ROLES.length],
      }
    });
    users.push(user);
  }

  for (const user of users) {
    await prisma.session.create({
      data: {
        user_id: user.id,
        utm_source: ['google', 'linkedin', 'direct', 'email'][Math.floor(Math.random() * 4)]
      }
    });

    const maxStage = Math.floor(Math.random() * 7);
    for (let stage = 0; stage <= maxStage; stage++) {
      await prisma.event.create({
        data: {
          user_id: user.id,
          event_type: 'page_view',
          metadata: { stage: String(stage) }
        }
      });
    }

    if (maxStage >= 1) {
      for (const videoId of ['problem', 'solution']) {
        await prisma.event.create({
          data: { user_id: user.id, event_type: 'video_play', metadata: { video_id: videoId, percent_watched: 0 } }
        });
        if (Math.random() > 0.4) {
          await prisma.event.create({
            data: { user_id: user.id, event_type: 'video_complete', metadata: { video_id: videoId, percent_watched: 100 } }
          });
        }
      }
    }

    if (maxStage >= 3) {
      await prisma.event.create({
        data: { user_id: user.id, event_type: 'demo_start', metadata: { scenario: 'sap_cpq_sync' } }
      });
      if (Math.random() > 0.3) {
        await prisma.event.create({
          data: { user_id: user.id, event_type: 'demo_complete', metadata: { quotes_fixed: 3 } }
        });
      }
    }

    if (maxStage >= 5) {
      const inputs = {
        quotesPerMonth: 150 + Math.floor(Math.random() * 200),
        hoursPerWeek: 4 + Math.floor(Math.random() * 8),
        hourlyRate: 55 + Math.floor(Math.random() * 30),
        errorRate: 8 + Math.floor(Math.random() * 10),
        avgDealSize: 12000 + Math.floor(Math.random() * 15000),
        staffCount: 2 + Math.floor(Math.random() * 4)
      };
      const annualHoursSaved = inputs.hoursPerWeek * 52;
      const laborSaved = annualHoursSaved * inputs.hourlyRate * inputs.staffCount;
      const revenueRecovered = inputs.quotesPerMonth * inputs.avgDealSize * (inputs.errorRate / 100) * 0.4 * 12;
      const totalValue = laborSaved + revenueRecovered;
      const roi = ((totalValue - 26000) / 26000) * 100;

      await prisma.roiCalculation.create({
        data: {
          user_id: user.id,
          inputs,
          result: { annualHoursSaved, laborSaved, revenueRecovered, totalValue, roi: Math.round(roi) }
        }
      });
      await prisma.event.create({
        data: { user_id: user.id, event_type: 'roi_calculated', metadata: { roi: Math.round(roi), totalValue } }
      });
    }

    if (maxStage >= 6 && Math.random() > 0.5) {
      const tier = ['Starter', 'Growth', 'Enterprise'][Math.floor(Math.random() * 3)];
      await prisma.event.create({
        data: { user_id: user.id, event_type: 'purchase_intent', metadata: { tier } }
      });
    }

    if (Math.random() > 0.4) {
      const questions = [
        'How long does setup take?',
        'Does this work with our SAP version?',
        'Can we customize the approval workflow?',
        'What happens if the sync fails?',
        'Is there a free trial?',
        'How does pricing work for 5,000+ quotes?'
      ];
      await prisma.event.create({
        data: {
          user_id: user.id,
          event_type: 'agent_question',
          metadata: { question: questions[Math.floor(Math.random() * questions.length)] }
        }
      });
    }
  }

  console.log(`Seeded ${users.length} users with analytics events.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

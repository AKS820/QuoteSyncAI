import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useScrollStage } from '../hooks/useScrollStage.js';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import StickyCTA from '../components/StickyCTA.jsx';
import Hero from '../components/Hero.jsx';
import DemoEnvironment from '../components/DemoEnvironment.jsx';
import ImplementationGuide from '../components/ImplementationGuide.jsx';
import ROICalculator from '../components/ROICalculator.jsx';
import PricingSection from '../components/PricingSection.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

const STAGE_LABELS = [
  'Overview',
  'Demo',
  'Setup',
  'ROI',
  'Pricing',
];

function PainNarrative() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    { label: 'ERP updates a part price', detail: 'SAP pushes a $140 increase to widget MFG-7832' },
    { label: 'CPQ isn\'t notified', detail: 'Your quote tool still shows the old number' },
    { label: 'Rep sends the quote', detail: 'Looks correct. Nothing flags it.' },
    { label: 'Customer accepts', detail: 'At $1,240 — $140 below your actual cost' },
    { label: 'Finance reconciles', detail: 'You find out 30 days later. Deal is closed.' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-14 px-6 max-w-4xl mx-auto"
    >
      <p className="text-[10px] tracking-label text-danger font-semibold uppercase mb-6">This is happening right now</p>
      <div className="border border-border">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-border last:border-b-0">
            <div className={`w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono font-semibold ${i === 4 ? 'bg-danger/20 border border-danger/40 text-danger' : 'bg-surface border border-border text-muted'}`}>
              {i + 1}
            </div>
            <div>
              <span className={`text-sm font-medium ${i === 4 ? 'text-danger' : 'text-white/80'}`}>{step.label}</span>
              <span className="text-xs text-muted font-light ml-2">{step.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted font-light mt-4">
        Most teams find out about pricing errors <span className="text-white/70 font-medium">after the customer does.</span> QuoteGuard catches them before the quote leaves your system.
      </p>
    </motion.div>
  );
}

function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-12 px-6 max-w-4xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-6">How It Works</div>
      <div className="grid sm:grid-cols-3 border border-border">
        {[
          { n: 1, title: 'Catches mismatches instantly', body: 'Agent monitors every quote change against your ERP master pricing in real time.' },
          { n: 2, title: 'Checks against ERP pricing', body: 'Cross-references CPQ line items against SAP, Oracle, or Dynamics via API — no manual lookup.' },
          { n: 3, title: 'Fixes or flags before send', body: 'Auto-corrects within your threshold. Routes outliers to an approval workflow. Nothing ships wrong.' },
        ].map((item, i) => (
          <div key={item.n} className={`px-5 py-6 ${i < 2 ? 'border-b sm:border-b-0 sm:border-r border-border' : ''}`}>
            <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center text-white text-xs font-semibold font-mono mb-4">
              {item.n}
            </div>
            <div className="text-sm font-semibold mb-1">{item.title}</div>
            <div className="text-xs text-muted font-light leading-relaxed">{item.body}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const { currentStage, visitedStages } = useScrollStage(5);

  return (
    <div className="min-h-screen bg-surface-2">
      <ProgressIndicator
        currentStage={currentStage}
        visitedStages={visitedStages}
        labels={STAGE_LABELS}
      />

      <StickyCTA currentStage={currentStage} />

      <section id="hero" data-stage="0">
        <Hero />
      </section>

      <section id="demo" data-stage="1" className="border-t border-border">
        <DemoEnvironment />
      </section>

      <div className="border-t border-border bg-surface">
        <PainNarrative />
      </div>

      <div className="border-t border-border">
        <HowItWorks />
      </div>

      {/* Post-proof CTA */}
      <div className="border-t border-border bg-surface px-6 py-8 text-center">
        <p className="text-sm text-muted font-light mb-4">Seen enough? Start with a read-only scan — nothing changes in your systems.</p>
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm"
        >
          See pricing and get started
        </a>
      </div>

      <section id="setup" data-stage="2" className="border-t border-border bg-surface">
        <ImplementationGuide />
      </section>

      <section id="roi" data-stage="3" className="border-t border-border">
        <ROICalculator />
      </section>

      <section id="pricing" data-stage="4" className="border-t border-border bg-surface">
        <PricingSection />
      </section>

      <ChatWidget />
    </div>
  );
}

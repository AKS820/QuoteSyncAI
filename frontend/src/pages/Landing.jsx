import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useScrollStage } from '../hooks/useScrollStage.js';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import Hero from '../components/Hero.jsx';
import ROICalculator from '../components/ROICalculator.jsx';
import PricingSection from '../components/PricingSection.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

const STAGE_LABELS = ['Overview', 'Why', 'What', 'How', 'Pricing'];

// ─── Why ─────────────────────────────────────────────────────────────────────

function WhySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-16 px-6 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">
        The ERP is not the source of truth.
        <br /><span className="font-light text-white/60">The quote is.</span>
      </h2>
      <p className="text-sm text-muted font-light mb-12 max-w-lg">
        Every negotiated deal, expired contract, and changed pricing rule that doesn't make it back into the ERP is a future error waiting to happen.
      </p>

      <div className="border border-border">
        <div className="grid sm:grid-cols-3 divide-x divide-border">
          {[
            { n: '3–8%', label: 'of quotes have pricing errors', sub: 'against your own ERP rules' },
            { n: '30 days', label: 'avg time to discover a mismatch', sub: 'after the deal has already closed' },
            { n: '$50K+', label: 'annual ops labor', sub: 'manually patching the gap' },
          ].map((s, i) => (
            <div key={i} className="px-6 py-6">
              <div className="font-mono font-bold text-2xl text-ibm-blue-light mb-1">{s.n}</div>
              <div className="text-xs font-medium text-white/80">{s.label}</div>
              <div className="text-[10px] text-dim font-light mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── What ─────────────────────────────────────────────────────────────────────

function WhatSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-16 px-6 max-w-4xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">How it works</div>
      <h2 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">
        Every quote is a validation event.
      </h2>
      <p className="text-sm text-muted font-light mb-12 max-w-lg">
        Four agents run overnight. They compare what the quote says to what your ERP enforces — then fix it.
      </p>

      <div className="border border-border mb-8">
        {[
          { n: 1, name: 'Customer Agent', desc: 'Identifies the customer, matches against ERP master (98%+ accuracy).' },
          { n: 2, name: 'Pricing Agent', desc: 'Compares quoted prices to tiered rules in the ERP. Surfaces every discrepancy.' },
          { n: 3, name: 'Inventory Agent', desc: 'Validates quantities against minimum order quantity (MOQ) constraints.' },
          { n: 4, name: 'Sales Order Agent', desc: 'Auto-corrects tiered pricing. Holds MOQ violations and routes for approval.' },
        ].map((a, i) => (
          <div key={a.n} className="flex items-start gap-4 px-5 py-4 border-b border-border last:border-b-0">
            <div className="w-5 h-5 bg-ibm-blue flex items-center justify-center text-white text-[10px] font-semibold font-mono shrink-0 mt-0.5">{a.n}</div>
            <div>
              <span className="text-sm font-medium text-white">{a.name}</span>
              <span className="text-xs text-muted font-light ml-2">{a.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border">
        <div className="grid sm:grid-cols-2 divide-x divide-border">
          <div className="px-5 py-5">
            <div className="text-[10px] text-success font-semibold uppercase tracking-wide mb-2">Automated</div>
            <div className="text-sm font-medium mb-1">Overnight — no intervention needed</div>
            <div className="text-xs text-muted font-light">Corrections applied automatically. Audit trail emailed to execs.</div>
          </div>
          <div className="px-5 py-5">
            <div className="text-[10px] text-ibm-blue-light font-semibold uppercase tracking-wide mb-2">Interactive</div>
            <div className="text-sm font-medium mb-1">Step-by-step with approval gates</div>
            <div className="text-xs text-muted font-light">Director walks through findings. Approve or override at each step.</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Win Story ────────────────────────────────────────────────────────────────

function WinStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-16 px-6 max-w-4xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Win Story — EVCO Plastics</div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-10 leading-tight">
        Wisconsin manufacturer. 8 quote formats.<br />
        <span className="font-light text-white/60">All reconciled overnight.</span>
      </h2>

      {/* Diagram placeholder */}
      <div className="h-[260px] border border-dashed border-border/60 bg-surface flex items-center justify-center mb-10">
        <div className="text-center opacity-40">
          <div className="w-10 h-0.5 bg-border mx-auto mb-3" />
          <div className="text-[11px] tracking-label font-medium text-muted uppercase">Architecture Diagram</div>
          <div className="text-[10px] text-dim font-light mt-1">Coming soon</div>
          <div className="w-10 h-0.5 bg-border mx-auto mt-3" />
        </div>
      </div>

      {/* Pull quote */}
      <blockquote className="border-l-2 border-ibm-blue pl-6 mb-10">
        <p className="text-xl sm:text-2xl font-light text-white/80 leading-relaxed mb-3">
          "The ERP wasn't the source of truth. The quote was."
        </p>
        <cite className="text-xs text-muted font-light not-italic">VP of IT & Asia, EVCO Plastics</cite>
      </blockquote>

      {/* Before / After */}
      <div className="border border-border">
        <div className="grid sm:grid-cols-2 divide-x divide-border">
          <div className="px-5 py-5">
            <div className="text-[10px] text-danger font-semibold uppercase tracking-wide mb-3">Before</div>
            <ul className="space-y-2">
              {['Manual PDF extraction (8 formats)', 'ERP cross-reference by hand', 'Tiered pricing updated manually', 'MOQ violations caught via email'].map((t, i) => (
                <li key={i} className="text-xs text-muted font-light flex items-center gap-2">
                  <span className="text-danger shrink-0">×</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-5 py-5">
            <div className="text-[10px] text-success font-semibold uppercase tracking-wide mb-3">After</div>
            <ul className="space-y-2">
              {['Any PDF format handled automatically', 'Customer matched in seconds', 'ERP corrected overnight', 'MOQ violations routed automatically'].map((t, i) => (
                <li key={i} className="text-xs text-muted font-light flex items-center gap-2">
                  <span className="text-success shrink-0">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── How ──────────────────────────────────────────────────────────────────────

function HowSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-16 px-6 max-w-4xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Setup</div>
      <h2 className="text-3xl sm:text-4xl font-semibold mb-12 leading-tight">
        Any ERP. Any quote format.<br />
        <span className="font-light text-white/60">Live in under an hour.</span>
      </h2>

      <div className="border border-border mb-8">
        {[
          { time: '~30 min', title: 'Connect your ERP', desc: 'API credentials only. No on-premise install, no database access.' },
          { time: '~20 min', title: 'Define your business rules', desc: 'Tiered thresholds, MOQ routing, approval hierarchy.' },
          { time: 'Overnight', title: 'Go live', desc: 'Runs after hours. Audit trail emailed to executives.' },
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-5 px-5 py-5 border-b border-border last:border-b-0">
            <div className="font-mono text-xs text-ibm-blue-light font-semibold w-16 shrink-0 pt-0.5">{s.time}</div>
            <div>
              <div className="text-sm font-medium mb-0.5">{s.title}</div>
              <div className="text-xs text-muted font-light">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-dim font-light">Supported:</span>
        {['SAP', 'Oracle ERP', 'MS Dynamics', 'NetSuite', 'Del Mia Works', 'Salesforce CPQ', 'Any REST/SOAP API'].map(s => (
          <span key={s} className="text-[10px] border border-border px-2 py-1 text-muted font-light">{s}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const { currentStage, visitedStages } = useScrollStage(5);

  return (
    <div className="min-h-screen bg-surface-2">
      <ProgressIndicator
        currentStage={currentStage}
        visitedStages={visitedStages}
        labels={STAGE_LABELS}
      />

      <section id="hero" data-stage="0">
        <Hero />
      </section>

      <section id="why" data-stage="1" className="border-t border-border bg-surface">
        <WhySection />
      </section>

      <section id="what" data-stage="2" className="border-t border-border">
        <WhatSection />
      </section>

      <div className="border-t border-border bg-surface">
        <WinStory />
      </div>

      <section id="how" data-stage="3" className="border-t border-border">
        <HowSection />
      </section>

      <div id="roi" className="border-t border-border bg-surface">
        <ROICalculator />
      </div>

      <section id="pricing" data-stage="4" className="border-t border-border">
        <PricingSection />
      </section>

      <ChatWidget />
    </div>
  );
}

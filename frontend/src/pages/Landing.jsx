import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { useScrollStage } from '../hooks/useScrollStage.js';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import Hero from '../components/Hero.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

const STAGE_LABELS = ['Overview', 'Why', 'What', 'Win Story'];

// ─── Demo Modal ───────────────────────────────────────────────────────────────

function DemoModal({ onClose }) {
  const embedUrl = import.meta.env.VITE_ORCHESTRATE_AGENT_URL;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="bg-surface border border-border w-full max-w-3xl flex flex-col"
        style={{ height: '620px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div>
            <span className="text-sm font-semibold">QuoteGuard — Live Agent</span>
            <span className="text-xs text-muted font-light ml-3">IBM watsonx Orchestrate</span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1">
            <X size={16} />
          </button>
        </div>
        {embedUrl ? (
          <iframe src={embedUrl} className="flex-1 w-full border-0" title="QuoteGuard Live Demo" />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-8 h-8 border border-border flex items-center justify-center mb-4">
              <span className="text-ibm-blue font-bold text-xs">Q</span>
            </div>
            <p className="text-sm font-medium mb-1">Demo agent not yet configured</p>
            <p className="text-xs text-muted font-light max-w-xs">Set <code className="text-ibm-blue-light">VITE_ORCHESTRATE_AGENT_URL</code> in your environment to embed the live Orchestrate agent here.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

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
        Every expired contract and pricing rule that doesn't make it back into the ERP is a future billing error.
      </p>

      <div className="border border-border">
        <div className="grid sm:grid-cols-3 divide-x divide-border">
          {[
            { n: '3–8%', label: 'of customer POs have pricing rule violations', sub: 'Observed across initial manufacturing deployments' },
            { n: '30 days', label: 'avg time to discover an ERP/quote mismatch', sub: 'Typical billing cycle before errors surface in reconciliation' },
            { n: '$50K+', label: 'annual ops labor cost', sub: '3 staff × 5 hrs/wk × $65/hr, cross-referencing manually' },
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
  const [showDemo, setShowDemo] = useState(false);
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
      <p className="text-sm text-muted font-light mb-3 max-w-lg">
        watsonx.AI extracts structured pricing data from any customer PO — no templates, no mapping. Four agents run overnight, comparing each document against your ERP and correcting the gap.
      </p>
      <p className="text-xs text-dim font-light mb-12 max-w-lg">Two sources of truth that drift apart. Agents that sync them.</p>

      <div className="border border-border mb-8">
        {[
          { n: 1, name: 'Customer Agent', desc: 'Identifies the customer, matches against ERP master (98%+ accuracy).' },
          { n: 2, name: 'Pricing Agent', desc: 'Compares quoted prices to tiered rules in the ERP. Surfaces every discrepancy.' },
          { n: 3, name: 'Inventory Agent', desc: 'Validates quantities against minimum order quantity (MOQ) constraints.' },
          { n: 4, name: 'Sales Order Agent', desc: 'Auto-corrects tiered pricing. Holds MOQ violations and routes for approval.' },
        ].map((a) => (
          <div key={a.n} className="flex items-start gap-4 px-5 py-4 border-b border-border last:border-b-0">
            <div className="w-5 h-5 bg-ibm-blue flex items-center justify-center text-white text-[10px] font-semibold font-mono shrink-0 mt-0.5">{a.n}</div>
            <div>
              <span className="text-sm font-medium text-white">{a.name}</span>
              <span className="text-xs text-muted font-light ml-2">{a.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border mb-8">
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

      <div className="border border-ibm-blue/40 bg-ibm-blue/5 px-6 py-8 text-center">
        <p className="text-xs text-muted font-light mb-5">Watch the agents handle a real customer PO end-to-end.</p>
        <button
          onClick={() => setShowDemo(true)}
          className="inline-flex items-center gap-3 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-10 py-4 transition-colors text-base"
        >
          <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse shrink-0" />
          Try the live demo
        </button>
      </div>

      <AnimatePresence>
        {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      </AnimatePresence>
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
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Win Story — Midwest Plastics Manufacturer</div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-10 leading-tight">
        Wisconsin manufacturer. 8 quote formats.<br />
        <span className="font-light text-white/60">All reconciled overnight.</span>
      </h2>

      <div className="border border-border mb-10 overflow-hidden">
        <iframe
          src="/arch-animation.html"
          className="w-full block border-0"
          style={{ height: '520px' }}
          title="Agent Architecture Diagram"
        />
      </div>

      <blockquote className="border-l-2 border-ibm-blue pl-6 mb-10">
        <p className="text-xl sm:text-2xl font-light text-white/80 leading-relaxed mb-3">
          "The ERP wasn't the source of truth. The quote was."
        </p>
        <cite className="text-xs text-muted font-light not-italic">VP of IT, Manufacturing Client</cite>
      </blockquote>

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const { currentStage, visitedStages } = useScrollStage(4);

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

      <section id="win-story" data-stage="3" className="border-t border-border bg-surface">
        <WinStory />
      </section>

      <div className="border-t border-border py-16 px-6 text-center">
        <p className="text-sm text-muted font-light mb-5">See plans, setup steps, and what it costs.</p>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-7 py-3.5 transition-colors text-sm"
        >
          View pricing
          <ChevronRight size={14} />
        </Link>
      </div>

      <ChatWidget />
    </div>
  );
}

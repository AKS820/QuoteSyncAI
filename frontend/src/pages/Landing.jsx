import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { useScrollStage } from '../hooks/useScrollStage.js';
import { useEventTracking } from '../hooks/useEventTracking.js';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import Hero from '../components/Hero.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

const STAGE_LABELS = ['Overview', 'The Problem', 'Win Story', 'Business Value'];

const IMPL_SUBJECT = 'Implementation help — Price List & Order Entry Agent';
const IMPL_BODY = `Hi Abhi,

I came across the QuoteGuard demo and I'm interested in learning more about implementing the Price List & Order Entry Agent for my team.

Our situation:
- ERP system: [SAP / Oracle / Dynamics 365 / Del Mia Works / Other]
- Monthly quote volume: [approximate number]
- Main challenge: [pricing validation / quote-to-ERP sync / part cross-referencing / other]

[Add any additional context here]

---
[Your name]
[Company]
[Phone]`;

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
          <iframe src="/arch-animation.html" className="flex-1 w-full border-0" title="Agent Architecture Demo" />
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
      className="py-16 px-8 max-w-6xl mx-auto"
    >
      <div className="grid lg:grid-cols-[2fr_3fr] gap-16 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight">
            Quotes are structured.
            <br /><span className="font-light text-white/60">The pricing rules behind them aren't.</span>
          </h2>
          <p className="text-sm text-muted font-light">
            Most manufacturers have strong ERP systems — but customer-specific quote pricing and ERP price lists drift apart constantly. Keeping them in sync manually is where time gets lost and pricing errors are born.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-0 border border-border">
          {[
            { n: '1–5%', label: 'EBITDA lost annually', sub: 'To quote-ERP pricing mismatches', src: 'EY / MGI Research' },
            { n: '82%', label: 'of teams spend 1 day/week', sub: 'Fixing ERP data issues manually', src: 'McKinsey via Ultra Consultants' },
            { n: '~60%', label: 'first-time quote accuracy', sub: 'In disconnected systems', src: 'Mobileforce / Cincom' },
          ].map((s, i) => (
            <div key={i} className="px-6 py-6 border-r border-border last:border-r-0">
              <div className="font-mono font-bold text-2xl text-ibm-blue-light mb-1">{s.n}</div>
              <div className="text-xs font-medium text-white/80">{s.label}</div>
              <div className="text-[10px] text-dim font-light mt-0.5">{s.sub}</div>
              <div className="text-[9px] text-dim font-light mt-1.5 opacity-60 italic">{s.src}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── What Happens Today ───────────────────────────────────────────────────────

function WhatHappensToday() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-8 px-8 max-w-6xl mx-auto"
    >
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="lg:pt-1">
          <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">What Happens Today</div>
          <h3 className="text-2xl font-semibold leading-tight">Five manual steps.<br />Every quote.</h3>
        </div>
        <div className="border border-border">
        {[
          { n: 1, name: 'Quote received', desc: 'Sales rep receives customer quote by email, PDF, or spreadsheet — in any format.' },
          { n: 2, name: 'Manual data extraction', desc: 'Rep keys line items, part numbers, and quantities into ERP by hand.' },
          { n: 3, name: 'Manual validation', desc: 'Price check, part lookup, MOQ check, and ERP mismatch catch — all done manually.' },
          { n: 4, name: 'Manual correction', desc: 'Rep corrects errors, re-keys ERP updates, and emails the customer revised pricing.' },
          { n: 5, name: 'Sales order entered', desc: 'Order is finally entered — days or weeks after the quote was received.' },
        ].map((step) => (
          <div key={step.n} className="flex items-start gap-4 px-5 py-4 border-b border-border last:border-b-0">
            <div className="w-5 h-5 border border-border flex items-center justify-center text-dim text-[10px] font-mono shrink-0 mt-0.5">{step.n}</div>
            <div>
              <span className="text-sm font-medium text-white">{step.name}</span>
              <span className="text-xs text-muted font-light ml-2">{step.desc}</span>
            </div>
          </div>
        ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Outcomes ─────────────────────────────────────────────────────────────────

function Outcomes() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-8 px-8 max-w-6xl mx-auto pb-16"
    >
      <div className="text-[10px] tracking-label text-danger font-semibold uppercase mb-4">The Cost</div>
      <div className="grid sm:grid-cols-3 gap-0 border border-border">
        {[
          {
            label: 'Broken Customer Trust',
            quote: '"You\'re trying to overcharge me."',
            sub: 'Wrong pricing on confirmed quotes erodes the relationship before the order ships.',
          },
          {
            label: 'Longer Cycle Time',
            quote: '"We\'re still waiting on confirmation."',
            sub: 'Every manual step adds days. Competitors who move faster win the order.',
          },
          {
            label: 'Disgruntled Employees',
            quote: '"I have to fix this manually again."',
            sub: 'Reps spending a day a week on data entry instead of selling.',
          },
        ].map((o, i) => (
          <div key={i} className="px-5 py-6 border-r border-border last:border-r-0">
            <div className="text-[10px] text-danger font-semibold uppercase tracking-wide mb-3">{o.label}</div>
            <p className="text-sm font-medium text-white mb-2 leading-snug">{o.quote}</p>
            <p className="text-xs text-muted font-light">{o.sub}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Win Story ────────────────────────────────────────────────────────────────

function WinStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [showDemo, setShowDemo] = useState(false);
  const { trackEvent } = useEventTracking();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-16 px-8 max-w-6xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-6">Win Story — Midwest Plastics Manufacturer</div>

      <h2 className="text-3xl sm:text-4xl font-semibold mb-6 leading-tight">Wisconsin manufacturer.</h2>

      <div className="grid sm:grid-cols-4 gap-0 border border-border mb-8">
        {[
          { n: '3,000+', label: 'active quotes in flight', sub: 'Across all open customer agreements' },
          { n: '8', label: 'distinct quote formats', sub: 'Each requiring different extraction logic' },
          { n: '20/day', label: 'ERP pricing rule updates', sub: 'Each one a potential mismatch with open quotes' },
          { n: '10 staff', label: 'on manual validation daily', sub: 'Max 3 concurrent — a hard throughput ceiling' },
        ].map((s, i) => (
          <div key={i} className="px-5 py-5 border-r border-border last:border-r-0">
            <div className="font-mono font-bold text-xl text-ibm-blue-light mb-1">{s.n}</div>
            <div className="text-xs font-medium text-white/80">{s.label}</div>
            <div className="text-[10px] text-dim font-light mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <blockquote className="border-l-2 border-ibm-blue pl-6 mb-10">
        <p className="text-2xl sm:text-3xl font-semibold text-white leading-tight mb-3">
          "The ERP wasn't the source of truth. The quote was."
        </p>
        <cite className="text-xs text-muted font-light not-italic">— VP of IT, Manufacturing Client</cite>
      </blockquote>

      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-2">What they built with IBM watsonx Orchestrate</div>
      <p className="text-xs text-muted font-light mb-4 max-w-xl">A Manager Agent on watsonx Orchestrate coordinates four specialized sub-agents, running overnight against quote documents and ERP. Any quote format supported — no templates, no manual mapping.</p>
      <div className="border border-border mb-4">
        {[
          { n: 1, name: 'Customer Agent', desc: 'Cross-references customer name and address against ERP master data. Confirms match at 98%+ confidence.' },
          { n: 2, name: 'Quote Validation Agent', desc: 'Fetches item master and AKA part references from ERP. Confirms all line items are valid.' },
          { n: 3, name: 'Pricing Agent', desc: 'Compares quote pricing against ERP price tiers and MOQ rules. Surfaces every discrepancy.' },
          { n: 4, name: 'Sales Order Agent', desc: 'Auto-corrects tiered pricing in ERP. Holds MOQ violations and routes for human approval.' },
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

      <div className="grid sm:grid-cols-2 gap-0 border border-border mb-10">
        <div className="px-5 py-5 border-r border-border">
          <div className="text-[10px] text-success font-semibold uppercase tracking-wide mb-2">Autonomous</div>
          <div className="text-sm font-medium mb-1">Runs overnight — no supervision needed</div>
          <div className="text-xs text-muted font-light">Corrections applied automatically. Full audit trail emailed to leadership after each run.</div>
        </div>
        <div className="px-5 py-5">
          <div className="text-[10px] text-ibm-blue-light font-semibold uppercase tracking-wide mb-2">Human-in-the-loop</div>
          <div className="text-sm font-medium mb-1">Approval gates at every exception</div>
          <div className="text-xs text-muted font-light">MOQ violations and threshold breaches are held for human review. Approve or override at each step.</div>
        </div>
      </div>

      <div className="border border-border mb-8">
        <div className="grid sm:grid-cols-2 divide-x divide-border">
          <div className="px-5 py-5">
            <div className="text-[10px] text-danger font-semibold uppercase tracking-wide mb-3">Before</div>
            <ul className="space-y-2">
              {['Manual quote extraction (8 formats)', 'ERP cross-reference by hand', 'Tiered pricing updated manually', 'MOQ violations caught via email'].map((t, i) => (
                <li key={i} className="text-xs text-muted font-light flex items-center gap-2">
                  <span className="text-danger shrink-0">×</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-5 py-5">
            <div className="text-[10px] text-success font-semibold uppercase tracking-wide mb-3">After</div>
            <ul className="space-y-2">
              {['Any quote format handled automatically', 'Customer matched in seconds', 'ERP corrected overnight', 'MOQ violations routed automatically'].map((t, i) => (
                <li key={i} className="text-xs text-muted font-light flex items-center gap-2">
                  <span className="text-success shrink-0">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border border-ibm-blue/40 bg-ibm-blue/5 px-6 py-8 text-center">
        <p className="text-xs text-muted font-light mb-5">Watch the agents handle a real customer quote end-to-end.</p>
        <button
          onClick={() => { setShowDemo(true); trackEvent('demo_start'); }}
          className="inline-flex items-center gap-3 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-10 py-4 transition-colors text-base"
        >
          <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse shrink-0" />
          See their flow
        </button>
      </div>

      <AnimatePresence>
        {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Business Value ───────────────────────────────────────────────────────────

function BusinessValue() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-16 px-8 max-w-6xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Business Value</div>
      <h2 className="text-3xl sm:text-4xl font-semibold mb-8 leading-tight">
        What changes when pricing is automated.
      </h2>
      <div className="grid sm:grid-cols-4 gap-0 border border-border">
        {[
          { n: '1%→8%', label: 'price to profit', sub: 'Every corrected quote goes straight to margin', src: 'McKinsey / Bain' },
          { n: '-28%', label: 'sales cycle', sub: 'Faster quotes, faster orders', src: 'Aberdeen CPQ Benchmark' },
          { n: '+49%', label: 'rep productivity', sub: 'Time back from manual validation', src: 'Aberdeen CPQ Benchmark' },
          { n: '-30%', label: 'DSO reduction', sub: 'Fewer disputes, faster payment', src: 'Hackett / HighRadius' },
        ].map((s, i) => (
          <div key={i} className="px-5 py-5 border-r border-border last:border-r-0">
            <div className="font-mono font-bold text-xl text-ibm-blue-light mb-1">{s.n}</div>
            <div className="text-xs font-medium text-white/80">{s.label}</div>
            <div className="text-[10px] text-dim font-light mt-0.5">{s.sub}</div>
            <div className="text-[9px] text-dim font-light mt-1.5 opacity-60 italic">{s.src}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const { currentStage, visitedStages } = useScrollStage(4);
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'abhi.surampudi@ibm.com';
  const implHelpHref = `mailto:${contactEmail}?subject=${encodeURIComponent(IMPL_SUBJECT)}&body=${encodeURIComponent(IMPL_BODY)}`;

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

      <section id="problem" data-stage="1" className="border-t border-border bg-surface">
        <WhySection />
        <WhatHappensToday />
        <Outcomes />
      </section>

      <section id="win-story" data-stage="2" className="border-t border-border bg-surface">
        <WinStory />
      </section>

      <section id="value" data-stage="3" className="border-t border-border bg-surface">
        <BusinessValue />
      </section>

      <div className="border-t border-border py-16 px-6 text-center">
        <p className="text-sm text-muted font-light mb-2">Start on IBM, get help with setup.</p>
        <p className="text-xs text-dim font-light mb-7">Start a free trial directly on IBM's site. Implementation help is available if you need it.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={import.meta.env.VITE_IBM_TRIAL_URL || 'https://www.ibm.com/account/reg/us-en/signup?formid=urx-52753'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-7 py-3.5 transition-colors text-sm"
          >
            Start free trial
            <ChevronRight size={14} />
          </a>
          <a
            href={implHelpHref}
            className="text-sm text-muted hover:text-white font-light transition-colors px-4 py-3.5"
          >
            Work with our implementation partner →
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[10px] text-dim font-light leading-relaxed max-w-xl">
            This is a custom demo created by an IBM representative to illustrate a concept. It is not an official IBM website or product.
          </p>
          <p className="text-[10px] text-dim font-light shrink-0">
            Anonymous page views and clicks only. No personal data collected.
          </p>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}

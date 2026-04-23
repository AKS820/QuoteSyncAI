import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { useScrollStage } from '../hooks/useScrollStage.js';
import { useEventTracking } from '../hooks/useEventTracking.js';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import Hero from '../components/Hero.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

const STAGE_LABELS = ['Overview', 'Why', 'Win Story'];

const IMPL_SUBJECT = 'Implementation help — Price List & Order Entry Agent';
const IMPL_BODY = `Hi Abhi,

I came across the QuoteGuard demo and I'm interested in learning more about implementing the Price List & Order Entry Agent for my team.

Our situation:
- ERP system: [SAP / Oracle / Dynamics 365 / Del Mia Works / Other]
- Monthly PO volume: [approximate number]
- Main challenge: [pricing validation / order entry errors / part cross-referencing / other]

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
      className="py-16 px-6 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">
        The documents are unstructured.
        <br /><span className="font-light text-white/60">The ERP rules are not.</span>
      </h2>
      <p className="text-sm text-muted font-light max-w-lg">
        Most manufacturers have strong ERP systems — but customer POs arrive in any format, and validating them manually against ERP pricing rules is where time gets lost and billing errors are born.
      </p>
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
      className="py-16 px-6 max-w-4xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Win Story — Midwest Plastics Manufacturer</div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 leading-tight">
        Wisconsin manufacturer. 8 quote formats.<br />
        <span className="font-light text-white/60">All reconciled overnight.</span>
      </h2>

      <div className="grid sm:grid-cols-3 gap-0 border border-border mb-10">
        {[
          { n: '3,000+', label: 'active quotes in flight at any time', sub: 'Across all open customer POs' },
          { n: '20/day', label: 'pricing rule updates hitting the ERP', sub: 'Each one a potential mismatch with open quotes' },
          { n: '10 staff', label: 'touching manual validation daily', sub: 'Max 3 concurrent — a hard throughput ceiling' },
        ].map((s, i) => (
          <div key={i} className="px-5 py-5 border-r border-border last:border-r-0">
            <div className="font-mono font-bold text-xl text-ibm-blue-light mb-1">{s.n}</div>
            <div className="text-xs font-medium text-white/80">{s.label}</div>
            <div className="text-[10px] text-dim font-light mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-3">What they built with IBM watsonx Orchestrate</div>
      <div className="border border-border mb-10">
        {[
          { n: 1, name: 'Customer Agent', desc: 'Identifies the customer and matches against ERP master data.' },
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

      <blockquote className="border-l-2 border-ibm-blue pl-6 mb-10">
        <p className="text-xl sm:text-2xl font-light text-white/80 leading-relaxed mb-3">
          "The ERP wasn't the source of truth. The quote was."
        </p>
        <cite className="text-xs text-muted font-light not-italic">VP of IT, Manufacturing Client</cite>
      </blockquote>

      <div className="border border-border mb-8">
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

      <div className="border border-ibm-blue/40 bg-ibm-blue/5 px-6 py-8 text-center">
        <p className="text-xs text-muted font-light mb-5">Watch the agents handle a real customer PO end-to-end.</p>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const { currentStage, visitedStages } = useScrollStage(3);
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

      <section id="why" data-stage="1" className="border-t border-border bg-surface">
        <WhySection />
      </section>

      <section id="win-story" data-stage="2" className="border-t border-border bg-surface">
        <WinStory />
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
        <div className="max-w-4xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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

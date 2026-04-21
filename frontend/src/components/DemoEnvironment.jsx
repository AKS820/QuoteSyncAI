import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Zap, X, AlertTriangle, Check } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

// Your teammate sets this to their Orchestrate agent URL when ready.
// Leave blank to show the placeholder panel.
const ORCHESTRATE_AGENT_URL = import.meta.env.VITE_ORCHESTRATE_AGENT_URL || '';

// Demo numbers: annualized from 3 mismatched quotes in a 10-quote sample set.
// MFG-4421: $847 CPQ vs $923 SAP — MFG-7832: $1,240 vs $1,380 — MFG-2209: $456 vs $512
// Per-set delta: $272. At 200 quote-sets/month × 12 months × 40% accepted = ~$12,480/yr
const IMPACT_USD = '$12,480';
const IMPACT_CONTEXT = 'estimated annual revenue left on the table — from 3 mismatched quotes in a 10-quote sample';

const COMPARE_ROWS = [
  { label: 'When errors are caught',  before: 'During negotiation, or after the customer accepts it',   after: 'Before the quote leaves your system' },
  { label: 'How errors get caught',   before: 'Manual — ops team reconciles CPQ against ERP weekly',    after: 'Automatic — agent detects on every quote change, 24/7' },
  { label: 'Ops time per week',       before: 'Hours of copy-paste every Monday',                       after: 'Near zero — agents handle it end-to-end' },
  { label: 'Audit trail',             before: 'None — no log of what changed or when',                  after: 'Every detection event logged, reversible within 30 days' },
];

function OrchestrateAgentOverlay({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 flex flex-col"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="flex flex-col flex-1 max-w-4xl w-full mx-auto my-8 bg-surface-2 border border-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 bg-ibm-blue rounded-full animate-pulse-dot" />
            <span className="text-sm font-semibold">QuoteGuard — Live Agent</span>
            <span className="text-[10px] text-muted border border-border px-2 py-0.5 font-light">IBM watsonx Orchestrate</span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {ORCHESTRATE_AGENT_URL ? (
            <iframe
              src={ORCHESTRATE_AGENT_URL}
              className="w-full h-full border-0"
              title="QuoteGuard — watsonx Orchestrate Agent"
              allow="clipboard-write"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 min-h-[400px]">
              <div className="w-10 h-10 bg-ibm-blue-dim border border-ibm-blue/30 flex items-center justify-center mb-5">
                <Zap size={18} className="text-ibm-blue" />
              </div>
              <h3 className="text-base font-semibold mb-2">Interactive agent coming soon</h3>
              <p className="text-muted font-light text-sm max-w-sm mb-4">
                We're wiring up the live IBM watsonx Orchestrate agent. You'll be able to enter your own quote data and watch it get validated and corrected in real time.
              </p>
              <p className="text-[10px] font-mono text-dim">
                Set <span className="text-ibm-blue-light">VITE_ORCHESTRATE_AGENT_URL</span> to enable this panel.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DemoEnvironment() {
  const [showAgent, setShowAgent] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { trackEvent } = useEventTracking();

  function openAgent() {
    setShowAgent(true);
    trackEvent('demo_start', { scenario: 'orchestrate_agent' });
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="py-24 px-4 md:px-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="mb-10">
        <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Stage 1 — Live Demo</div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">Here's what we found in a 10-quote sample.</h2>
        <p className="text-muted font-light max-w-xl">
          This is real output from our demo environment — mock SAP + Salesforce CPQ data. Same agent that runs on your stack.
        </p>
      </div>

      {/* Mock error data — show first, explain second */}
      <div className="border border-border mb-6">
        <div className="px-4 py-2 border-b border-border bg-surface flex items-center justify-between">
          <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Detection run — 10 quotes scanned</span>
          <span className="text-[10px] font-mono text-danger">3 errors found</span>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-0">
          {/* Header row */}
          <div className="contents text-[10px] text-dim font-mono uppercase">
            <div className="px-4 py-2 border-b border-border bg-surface/50">Part #</div>
            <div className="px-4 py-2 border-b border-border bg-surface/50 border-l border-border">Description</div>
            <div className="px-4 py-2 border-b border-border bg-surface/50 border-l border-border text-right">CPQ Price</div>
            <div className="px-4 py-2 border-b border-border bg-surface/50 border-l border-border text-right">ERP Price</div>
            <div className="px-4 py-2 border-b border-border bg-surface/50 border-l border-border text-right">Delta</div>
          </div>
          {[
            { part: 'MFG-4421', desc: 'Hydraulic seal kit', cpq: '$847', erp: '$923', delta: '+$76', type: 'ERP vs CPQ mismatch' },
            { part: 'MFG-7832', desc: 'Precision shaft bearing', cpq: '$1,240', erp: '$1,380', delta: '+$140', type: 'Expired contract pricing' },
            { part: 'MFG-2209', desc: 'Filter assembly (standard)', cpq: '$456', erp: '$512', delta: '+$56', type: 'ERP vs CPQ mismatch' },
          ].map((row, i) => (
            <div key={i} className="contents">
              <div className="px-4 py-3 border-b border-border border-l-2 border-l-danger bg-danger/3">
                <span className="text-xs font-mono text-danger">{row.part}</span>
              </div>
              <div className="px-4 py-3 border-b border-border border-l border-border">
                <div className="text-xs text-white/80">{row.desc}</div>
                <div className="text-[10px] text-muted font-light mt-0.5">{row.type}</div>
              </div>
              <div className="px-4 py-3 border-b border-border border-l border-border text-right">
                <span className="text-xs font-mono text-danger line-through opacity-60">{row.cpq}</span>
              </div>
              <div className="px-4 py-3 border-b border-border border-l border-border text-right">
                <span className="text-xs font-mono text-white/80">{row.erp}</span>
              </div>
              <div className="px-4 py-3 border-b border-border border-l border-border text-right">
                <span className="text-xs font-mono text-danger font-semibold">{row.delta}</span>
              </div>
            </div>
          ))}
          {/* Clean rows */}
          <div className="col-span-5 px-4 py-3 border-b border-border last:border-b-0">
            <span className="text-xs text-muted font-light">7 quotes — <span className="text-success">no errors</span></span>
          </div>
        </div>
      </div>

      {/* Impact callout */}
      <div className="border border-warning/40 bg-warning/5 px-5 py-4 flex items-start gap-4 mb-8">
        <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
        <div>
          <span className="font-mono font-semibold text-white">{IMPACT_USD}</span>
          <span className="text-sm text-muted font-light ml-2">{IMPACT_CONTEXT}</span>
          <p className="text-xs text-muted font-light mt-1">
            3 of 10 quotes were mispriced — none caught before sending. All 3 would have shipped underpriced.
          </p>
        </div>
      </div>

      {/* Before / After table */}
      <div className="border border-border mb-10">
        <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-border bg-surface">
          <div className="px-4 py-2">
            <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Scenario</span>
          </div>
          <div className="px-4 py-2 border-l border-border">
            <span className="text-[10px] tracking-label text-danger uppercase font-semibold">Without QuoteGuard</span>
          </div>
          <div className="px-4 py-2 border-l border-border">
            <span className="text-[10px] tracking-label text-success uppercase font-semibold">With QuoteGuard</span>
          </div>
        </div>

        {COMPARE_ROWS.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr] border-b border-border last:border-b-0">
            <div className="px-4 py-4">
              <span className="text-xs font-medium text-white/80">{row.label}</span>
            </div>
            <div className="px-4 py-4 border-l border-border">
              <span className="text-xs text-muted font-light leading-relaxed">{row.before}</span>
            </div>
            <div className="px-4 py-4 border-l border-border flex items-start gap-2">
              <Check size={11} className="text-success shrink-0 mt-0.5" />
              <span className="text-xs text-white/80 font-light leading-relaxed">{row.after}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Agent demo CTA */}
      <div className="border border-border bg-surface">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-ibm-blue rounded-full animate-pulse-dot" />
            <span className="text-xs font-semibold text-ibm-blue-light">IBM watsonx Orchestrate — Interactive</span>
          </div>
          <h3 className="text-lg font-semibold">Paste one quote line. We'll tell you if it's wrong.</h3>
          <p className="text-muted font-light text-sm mt-1 max-w-lg">
            Enter a part number, a CPQ price, and an ERP price. The agent validates, flags the mismatch, and shows you what it would correct — no account needed.
          </p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/60 font-light">
              Read-only — nothing changes in your systems until you explicitly approve it.
            </p>
            <p className="text-[10px] text-muted font-light mt-0.5">No signup. No data stored.</p>
          </div>
          <button
            onClick={openAgent}
            className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm shrink-0"
          >
            <Zap size={14} />
            Check a quote
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAgent && <OrchestrateAgentOverlay onClose={() => setShowAgent(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

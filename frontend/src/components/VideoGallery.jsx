import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const PERSONAS = [
  {
    id: 'exec',
    label: 'Executive',
    role: 'VP of Sales / CRO',
    before: [
      { metric: '$138K/yr', desc: 'lost to pricing errors and deal disputes' },
      { metric: '6 hrs/wk', desc: 'ops team manual reconciliation overhead' },
      { metric: '4–7 days', desc: 'average time to resolve a quote dispute' },
    ],
    after: [
      { metric: '$0', desc: 'manual reconciliation cost after go-live' },
      { metric: '3 weeks', desc: 'average deployment — no SI engagement' },
      { metric: '< 10 sec', desc: 'automated sync cycle, 24/7' },
    ],
    quote: '"We were losing $40K a quarter to stale pricing in CPQ. QuoteSync automated the sync on Week 3 and we haven\'t had a pricing dispute since."',
    attribution: '— VP of Sales, Industrial Equipment Manufacturer',
  },
  {
    id: 'sales_ops',
    label: 'Sales Ops',
    role: 'Director of Sales Ops / RevOps',
    before: [
      { metric: '4+ hrs', desc: 'every Monday manually reconciling CPQ vs SAP' },
      { metric: '12%', desc: 'of quotes contain at least one ERP price mismatch' },
      { metric: 'Manual', desc: 'field-by-field copy between systems' },
    ],
    after: [
      { metric: '0 hrs', desc: 'manual sync time — agents handle it overnight' },
      { metric: '0%', desc: 'mismatch rate on quotes post-sync' },
      { metric: 'Automatic', desc: 'field mapping with configurable approval gates' },
    ],
    quote: '"I used to spend half my Mondays on this. Now I check the sync dashboard once a week and everything\'s already clean."',
    attribution: '— Director of Sales Operations, EVCO Plastics',
  },
  {
    id: 'it',
    label: 'IT / Systems',
    role: 'Director of IT / CIO',
    before: [
      { metric: 'On-prem', desc: 'custom scripts with no monitoring or alerting' },
      { metric: 'No audit', desc: 'trail for price changes pushed to CPQ' },
      { metric: 'High risk', desc: 'of silent failures causing stale data' },
    ],
    after: [
      { metric: 'REST API', desc: 'only — no on-prem install, no firewall exceptions' },
      { metric: 'Full log', desc: 'of every sync action, reversible within 30 days' },
      { metric: 'SOC 2', desc: 'Type II — TLS 1.3 + AES-256 encryption' },
    ],
    quote: '"The implementation team had us integrated with SAP in 4 days. No server access, no DB credentials. Just API keys."',
    attribution: '— Director of IT, Summit Metal Works',
  },
];

const AGENTS = [
  { name: 'Quote Watcher', desc: 'Continuously monitors CPQ for new and updated quotes. Triggers validation on every change.' },
  { name: 'ERP Validator', desc: 'Cross-references every quote line item against SAP master pricing data via OData API.' },
  { name: 'Auto-Updater', desc: 'Corrects mismatches in CPQ automatically. Configurable approval gates for variances above threshold.' },
];

export default function VideoGallery() {
  const [activeTab, setActiveTab] = useState('sales_ops');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const persona = PERSONAS.find(p => p.id === activeTab);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="py-24 px-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="mb-12">
        <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Stage 1 — Education</div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">
          This is a revenue protection problem, not a process problem
        </h2>
        <p className="text-muted font-light max-w-xl">
          Every quote that leaves your system with a stale price is money you've already given away. You find out when a customer accepts it, or when finance asks why margins are off.
        </p>
      </div>

      {/* Persona tab nav */}
      <div className="flex border-b border-border mb-8">
        {PERSONAS.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === p.id
                ? 'border-ibm-blue text-white'
                : 'border-transparent text-muted hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Role label */}
          <div className="text-xs text-muted font-mono mb-6">{persona.role}</div>

          {/* Before / After grid */}
          <div className="grid sm:grid-cols-2 gap-0 border border-border mb-8">
            {/* Before */}
            <div className="border-r border-border">
              <div className="px-4 py-2 border-b border-border bg-surface">
                <span className="text-[10px] tracking-label text-danger uppercase font-semibold">Before QuoteSync</span>
              </div>
              <div className="divide-y divide-border">
                {persona.before.map((item, i) => (
                  <div key={i} className="px-4 py-4 flex items-start gap-4">
                    <span className="font-mono font-semibold text-lg text-white/80 shrink-0 w-20 text-right">{item.metric}</span>
                    <span className="text-sm text-muted font-light leading-snug">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div>
              <div className="px-4 py-2 border-b border-border bg-surface">
                <span className="text-[10px] tracking-label text-success uppercase font-semibold">After QuoteSync</span>
              </div>
              <div className="divide-y divide-border">
                {persona.after.map((item, i) => (
                  <div key={i} className="px-4 py-4 flex items-start gap-4">
                    <span className="font-mono font-semibold text-lg text-ibm-blue-light shrink-0 w-20 text-right">{item.metric}</span>
                    <span className="text-sm text-muted font-light leading-snug">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="border-l-2 border-ibm-blue/40 pl-4 mb-10">
            <p className="text-sm text-muted font-light italic leading-relaxed">{persona.quote}</p>
            <footer className="text-xs text-white/50 font-mono mt-2">{persona.attribution}</footer>
          </blockquote>
        </motion.div>
      </AnimatePresence>

      {/* How the agents work */}
      <div className="border border-border">
        <div className="px-4 py-2 border-b border-border bg-surface">
          <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Three Agents — Zero Manual Sync</span>
        </div>
        <div className="divide-y divide-border">
          {AGENTS.map((agent, i) => (
            <div key={i} className="px-4 py-4 flex items-start gap-4">
              <div className="w-5 h-5 bg-ibm-blue-dim border border-ibm-blue/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-ibm-blue text-[10px] font-semibold font-mono">{i + 1}</span>
              </div>
              <div>
                <div className="text-sm font-semibold mb-0.5">{agent.name}</div>
                <div className="text-xs text-muted font-light leading-relaxed">{agent.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pain callout */}
      <div className="mt-8 flex items-center gap-2 text-sm text-muted font-light">
        <AlertTriangle size={13} className="text-warning shrink-0" />
        <span>The average mid-market manufacturer loses <strong className="text-white font-semibold">$138,000/year</strong> to quote-ERP misalignment.</span>
      </div>
    </motion.div>
  );
}

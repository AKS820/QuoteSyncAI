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

  const driftSteps = [
    { label: 'A customer negotiates special contract pricing', detail: 'Agreed and signed. But who updates the ERP?' },
    { label: 'Tiered pricing thresholds shift next quarter', detail: 'Someone updates the spreadsheet. ERP still has the old rules.' },
    { label: 'Contract terms expire mid-year', detail: 'ERP still applies the expired rate. No one is watching.' },
    { label: 'MOQ rules change for a product line', detail: 'ERP enforces the old minimum. Quotes go out wrong.' },
    { label: 'Next batch of orders closes on stale data', detail: 'Revenue impacted. Finance finds it 30 days later — or never.' },
  ];

  const stats = [
    { n: '3–8%', label: 'quotes with pricing violations', sub: 'against your own ERP rules, undetected' },
    { n: '30 days', label: 'average time to discover an ERP/quote mismatch', sub: 'after the deal has already closed' },
    { n: '$50K+', label: 'annual labor cost', sub: 'teams manually patching the gap between quote and ERP' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-14 px-6 max-w-4xl mx-auto"
    >
      <p className="text-[10px] tracking-label text-danger font-semibold uppercase mb-6">Why this keeps happening</p>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 leading-tight">The ERP is not the source of truth. The quote is.</h2>
      <p className="text-sm text-muted font-light mb-8 max-w-xl">
        Your ERP was built to execute transactions — not to stay in sync with every negotiated deal. The gap between what quotes say and what the ERP enforces is where revenue goes missing.
      </p>

      <div className="border border-border mb-10">
        {driftSteps.map((step, i) => (
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

      <p className="text-xs text-muted font-light mb-10">
        UIPath automates the steps that happen after the ERP is already wrong.{' '}
        <span className="text-white/70 font-medium">We catch when the ERP is wrong and fix it before it affects a single order.</span>
      </p>

      {/* Stats */}
      <div className="border border-border mb-10">
        <div className="grid sm:grid-cols-3 divide-x divide-border">
          {stats.map((s, i) => (
            <div key={i} className="px-5 py-5 text-center">
              <div className="font-mono font-bold text-2xl text-ibm-blue-light mb-1">{s.n}</div>
              <div className="text-xs font-medium text-white/80 mb-1">{s.label}</div>
              <div className="text-[10px] text-dim font-light">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted font-light mb-4">See what this gap is costing your team specifically.</p>
        <a href="#roi" className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm">
          Calculate my team's cost
        </a>
      </div>
    </motion.div>
  );
}

// ─── What ─────────────────────────────────────────────────────────────────────

function WhatSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const agents = [
    {
      n: 1,
      name: 'Customer Agent',
      desc: 'Identifies the customer from the quote document. Cross-references against ERP customer master with 98%+ match accuracy. Confirms whose contract terms apply.',
    },
    {
      n: 2,
      name: 'Pricing Agent',
      desc: 'Compares every quoted line item against tiered pricing rules in the ERP. Surfaces the exact discrepancy: what the quote says vs. what the ERP enforces.',
    },
    {
      n: 3,
      name: 'Inventory Agent',
      desc: 'Validates order quantities against minimum order quantity (MOQ) rules. Flags violations before the sales order is touched.',
    },
    {
      n: 4,
      name: 'Sales Order Agent',
      desc: 'Makes the decision: auto-corrects tiered pricing in the ERP, or holds the sales order and routes MOQ violations to the right person for approval.',
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-14 px-6 max-w-4xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-6">Stage 2 — The Solution</div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 leading-tight">Every quote becomes a validation event against your ERP.</h2>
      <p className="text-sm text-muted font-light mb-3 max-w-xl">
        We don't automate your workflow. We catch when your system is wrong — and fix it automatically.
      </p>
      <p className="text-xs text-muted font-light mb-10 max-w-xl">
        watsonx.AI extracts from any PDF format. IBM watsonx Orchestrate runs four agents to compare quote reality against ERP state, then takes action.
      </p>

      {/* Agent grid */}
      <div className="border border-border mb-10">
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {agents.map((a, i) => (
            <div key={a.n} className={`px-5 py-6 ${i >= 2 ? 'border-t border-border' : ''}`}>
              <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center text-white text-xs font-semibold font-mono mb-3">
                {a.n}
              </div>
              <div className="text-sm font-semibold mb-1">{a.name}</div>
              <div className="text-xs text-muted font-light leading-relaxed">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two modes */}
      <div className="border border-border">
        <div className="px-5 py-3 border-b border-border bg-surface">
          <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Two Operating Modes</span>
        </div>
        <div className="grid sm:grid-cols-2 divide-x divide-border">
          <div className="px-5 py-5">
            <div className="text-[10px] font-semibold tracking-wide text-success uppercase mb-2">Automated</div>
            <div className="text-sm font-medium mb-2">Overnight batch — zero intervention</div>
            <div className="text-xs text-muted font-light leading-relaxed">
              Agents run after hours. Tiered corrections applied to ERP automatically. Full audit trail emailed to executives. Exceptions routed to the right person.
            </div>
          </div>
          <div className="px-5 py-5">
            <div className="text-[10px] font-semibold tracking-wide text-ibm-blue-light uppercase mb-2">Interactive</div>
            <div className="text-sm font-medium mb-2">Step-by-step with approval gates</div>
            <div className="text-xs text-muted font-light leading-relaxed">
              Director walks through each agent's findings. Approve, override, or escalate at each step. Ideal for high-value quotes or onboarding your team to the logic.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Architecture / Win Story ─────────────────────────────────────────────────

function ArchSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const nodes = [
    { label: 'Customer Quote', sub: 'PDF · any format', tag: 'INPUT', tagColor: 'text-muted' },
    { label: 'watsonx.AI', sub: 'Extract part #, pricing, quantities', tag: 'EXTRACT', tagColor: 'text-ibm-blue' },
    { label: 'Orchestrate Agents', sub: 'Customer → Pricing → Inventory → Sales Order', tag: '4 AGENTS', tagColor: 'text-ibm-blue' },
    { label: 'ERP System', sub: 'SAP · Oracle · Del Mia Works', tag: 'VALIDATE', tagColor: 'text-warning/80' },
    { label: 'Auto-update or Hold', sub: 'Tiered fix applied · MOQ routed to director', tag: 'ACTION', tagColor: 'text-success' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-14 px-6 max-w-5xl mx-auto"
    >
      <p className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-6">Win Story — EVCO Plastics</p>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 leading-tight">This is the system that closed the deal.</h2>
      <p className="text-sm text-muted font-light mb-10 max-w-xl">
        Wisconsin-based plastics manufacturer. Del Mia Works ERP. 8 different customer quote formats. Ops team manually reconciling every one.
      </p>

      {/* Architecture diagram */}
      <div className="border border-border mb-2 overflow-x-auto">
        <div className="flex items-stretch min-w-[640px]">
          {nodes.map((node, i) => (
            <div key={i} className="flex items-stretch flex-1">
              <div className={`flex-1 px-4 py-5 text-center flex flex-col justify-between ${i === 2 ? 'bg-ibm-blue/10 border-x border-ibm-blue/30' : ''}`}>
                <div className={`text-[10px] font-mono font-semibold mb-2 ${node.tagColor}`}>{node.tag}</div>
                <div>
                  <div className="text-xs font-semibold text-white mb-1">{node.label}</div>
                  <div className="text-[10px] text-dim font-light leading-snug">{node.sub}</div>
                </div>
              </div>
              {i < nodes.length - 1 && (
                <div className="flex items-center px-1 text-ibm-blue/50 text-xs font-mono shrink-0">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Diagram note */}
      <p className="text-[10px] text-dim font-light mb-10 text-center">Architecture: IBM watsonx.AI + watsonx Orchestrate (4-agent multi-agentic system)</p>

      {/* Pull quote */}
      <div className="border border-ibm-blue/30 bg-ibm-blue/5 px-6 py-6 mb-10">
        <div className="text-xl font-light text-white/80 leading-relaxed mb-3">
          "The ERP wasn't necessarily the source of truth. The quote was."
        </div>
        <div className="text-xs text-muted font-light">VP of IT & Asia, EVCO Plastics — after implementing the multi-agent system</div>
      </div>

      {/* Before / After */}
      <div className="border border-border">
        <div className="px-5 py-3 border-b border-border bg-surface">
          <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Before → After</span>
        </div>
        <div className="grid sm:grid-cols-2 divide-x divide-border">
          <div className="px-5 py-5">
            <div className="text-[10px] font-semibold tracking-wide text-danger uppercase mb-3">Before</div>
            <ul className="space-y-2">
              {[
                'Manual PDF extraction for 8 quote formats',
                'Ops cross-references customer part # by hand',
                'Tiered pricing checked against ERP manually',
                'MOQ violations caught via email, if at all',
                'ERP updated only when someone remembered',
              ].map((item, i) => (
                <li key={i} className="text-xs text-muted font-light flex items-start gap-2">
                  <span className="text-danger mt-0.5 shrink-0">×</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-5 py-5">
            <div className="text-[10px] font-semibold tracking-wide text-success uppercase mb-3">After</div>
            <ul className="space-y-2">
              {[
                'watsonx.AI handles any PDF format automatically',
                'Customer Agent matches in seconds (98%+ accuracy)',
                'Pricing Agent surfaces every discrepancy with comparison table',
                'Sales Order Agent routes MOQ violations automatically',
                'ERP updated overnight — audit trail emailed to executives',
              ].map((item, i) => (
                <li key={i} className="text-xs text-muted font-light flex items-start gap-2">
                  <span className="text-success mt-0.5 shrink-0">✓</span>{item}
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

  const steps = [
    {
      time: '~30 min',
      title: 'Connect your ERP',
      body: 'Provide API credentials. Supports any system with a REST or SOAP API — SAP, Oracle, Dynamics, NetSuite, Del Mia Works, or custom builds. No database access. No on-premise install.',
    },
    {
      time: '~20 min',
      title: 'Define your business rules',
      body: 'Tiered pricing thresholds, MOQ violation routing, approval hierarchy. The rules that live in your ops team\'s heads — we map them to agent decision logic.',
    },
    {
      time: 'Overnight',
      title: 'Go live',
      body: 'Agents run during off-hours so they never conflict with live quote activity. Every correction logged. Every exception routed. Executives get an email summary of what changed.',
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="py-14 px-6 max-w-4xl mx-auto"
    >
      <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-6">Stage 3 — How to Connect</div>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 leading-tight">Any ERP with an API. Any quote format. Live in under an hour.</h2>
      <p className="text-sm text-muted font-light mb-10 max-w-xl">
        The longest step is usually waiting for your IT team to generate API credentials.
      </p>

      {/* Steps */}
      <div className="border border-border mb-10">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-6 border-b border-border last:border-b-0">
            <div className="shrink-0 font-mono text-xs text-ibm-blue-light font-semibold w-16 pt-0.5">{step.time}</div>
            <div>
              <div className="text-sm font-semibold mb-1">{step.title}</div>
              <div className="text-xs text-muted font-light leading-relaxed">{step.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Doc extraction note */}
      <div className="border border-border bg-surface px-5 py-4 mb-6">
        <span className="text-xs text-white/70 font-medium">Document extraction: </span>
        <span className="text-xs text-muted font-light">
          watsonx.AI handles extraction from any PDF format — including custom and legacy layouts. EVCO had 8 different quote formats across customers. The agents handled all of them. RPA is included only as a fail-safe for extreme edge cases.
        </span>
      </div>

      {/* Supported systems */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-dim font-light">Supported:</span>
        {['SAP', 'Oracle ERP', 'MS Dynamics', 'NetSuite', 'Del Mia Works', 'Salesforce CPQ', 'HubSpot', 'Any REST/SOAP API'].map(s => (
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

      {/* Win story + architecture diagram */}
      <div className="border-t border-border bg-surface">
        <ArchSection />
      </div>

      <section id="how" data-stage="3" className="border-t border-border">
        <HowSection />
      </section>

      {/* CTA bridge */}
      <div className="border-t border-border px-6 py-8 text-center bg-surface">
        <p className="text-sm text-muted font-light mb-4">See what the ERP/quote gap is costing your team.</p>
        <a href="#roi" className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm">
          Calculate my ROI
        </a>
      </div>

      <div id="roi" className="border-t border-border">
        <ROICalculator />
      </div>

      <section id="pricing" data-stage="4" className="border-t border-border bg-surface">
        <PricingSection />
      </section>

      <ChatWidget />
    </div>
  );
}

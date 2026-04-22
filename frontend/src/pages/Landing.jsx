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

  const steps = [
    { label: 'Customer sends a purchase order as a PDF', detail: 'One of 8 different formats your team has learned to read.' },
    { label: 'Ops opens it, finds the customer in the ERP', detail: 'Manually looks up their part cross-reference — AKA field in the system.' },
    { label: 'Checks each line against pricing rules', detail: 'Tiered pricing thresholds, MOQ rules — compared by eye, line by line.' },
    { label: 'Updates the ERP manually', detail: 'If the pricing is stale or wrong, someone has to go in and fix it.' },
    { label: 'MOQ violations put on hold via email', detail: 'Director of Ops gets a manual email. Sales order sits until someone acts.' },
  ];

  const stats = [
    { n: '15 hrs', label: 'per week on manual reconciliation', sub: '3 staff avg, mid-market manufacturer' },
    { n: '3–8%', label: 'quotes with undetected pricing violations', sub: 'typically caught weeks later, if ever' },
    { n: '$50K+', label: 'annual ops labor cost', sub: 'just for manual cross-referencing' },
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
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 leading-tight">Manual quote reconciliation is your ops team's biggest hidden cost.</h2>
      <p className="text-sm text-muted font-light mb-8 max-w-xl">Before automation, this was the daily workflow at EVCO Plastics — and at almost every manufacturer we've talked to.</p>

      <div className="border border-border mb-10">
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

      <p className="text-xs text-muted font-light mb-10">
        Then repeat for the next quote. And the one after that.{' '}
        <span className="text-white/70 font-medium">When it's not automated, every pricing rule is only as reliable as the person checking it that day.</span>
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
        <p className="text-sm text-muted font-light mb-4">See what this is costing your team specifically.</p>
        <a
          href="#roi"
          className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm"
        >
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
      desc: 'Extracts customer name, address, and part numbers from the PDF. Cross-references against your ERP customer master — 98%+ match accuracy.',
    },
    {
      n: 2,
      name: 'Pricing Agent',
      desc: 'Compares each line item against tiered pricing rules and contracted rates in your ERP. Surfaces discrepancies with a comparison table.',
    },
    {
      n: 3,
      name: 'Inventory Agent',
      desc: 'Validates order quantities against minimum order quantity (MOQ) rules and inventory constraints defined in your ERP.',
    },
    {
      n: 4,
      name: 'Sales Order Agent',
      desc: 'Auto-updates the ERP for tiered pricing corrections. Holds sales orders with MOQ violations and routes them to your director of operations.',
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
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 leading-tight">Four agents. One overnight run. Zero manual reconciliation.</h2>
      <p className="text-sm text-muted font-light mb-10 max-w-xl">
        watsonx.AI extracts data from your customer quote PDFs — any format. IBM watsonx Orchestrate runs four agents in sequence to validate, update, and route.
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
      <div className="border border-border mb-10">
        <div className="px-5 py-3 border-b border-border bg-surface">
          <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Two Operating Modes</span>
        </div>
        <div className="grid sm:grid-cols-2 divide-x divide-border">
          <div className="px-5 py-5">
            <div className="text-[10px] font-semibold tracking-wide text-success uppercase mb-2">Automated</div>
            <div className="text-sm font-medium mb-2">Overnight batch processing</div>
            <div className="text-xs text-muted font-light leading-relaxed">
              Agents run after hours when your team isn't touching quotes. Tiered pricing corrections applied automatically. Full audit trail emailed to executives when complete.
            </div>
          </div>
          <div className="px-5 py-5">
            <div className="text-[10px] font-semibold tracking-wide text-ibm-blue-light uppercase mb-2">Interactive</div>
            <div className="text-sm font-medium mb-2">Step-by-step with approval gates</div>
            <div className="text-xs text-muted font-light leading-relaxed">
              Director walks through each agent's findings in sequence. Approve or override at each step. Ideal for onboarding and high-value quote review.
            </div>
          </div>
        </div>
      </div>

      {/* EVCO Plastics callout */}
      <div className="border border-ibm-blue/30 bg-ibm-blue/5 px-6 py-6">
        <div className="text-[10px] text-ibm-blue font-semibold tracking-label uppercase mb-3">Case Study — EVCO Plastics</div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold text-white/80 mb-2">The situation</div>
            <p className="text-xs text-muted font-light leading-relaxed">
              Wisconsin-based plastics manufacturer. Del Mia Works ERP. 8 different customer quote formats arriving weekly. Ops team manually extracting pricing from PDFs, cross-referencing part numbers, and updating the ERP by hand — every night.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-white/80 mb-3">Before → After</div>
            <div className="space-y-2">
              {[
                ['Manual PDF extraction', 'watsonx.AI handles any format'],
                ['Hours of ERP cross-referencing', 'Customer Agent matches in seconds'],
                ['Tiered pricing updated by hand', 'Pricing Agent auto-corrects overnight'],
                ['MOQ holds sent via email', 'Sales Order Agent routes automatically'],
              ].map(([before, after], i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="text-danger font-light line-through shrink-0 w-[160px]">{before}</span>
                  <span className="text-success font-light">{after}</span>
                </div>
              ))}
            </div>
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
      body: 'Provide API credentials. Supports any system with a REST or SOAP API — SAP, Oracle, Dynamics, NetSuite, Del Mia Works, or anything custom. No database access. No on-premise install.',
    },
    {
      time: '~20 min',
      title: 'Define your business rules',
      body: 'Tiered pricing thresholds, MOQ violation routing, approval hierarchy. You tell us the rules that live in your ops team\'s heads — we map them to agent logic.',
    },
    {
      time: 'Overnight',
      title: 'Go live',
      body: 'Agents process your quote queue during off-hours so they never conflict with live quote activity. Email audit trail to executives. Exceptions routed to the right person automatically.',
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
        The setup is mostly waiting for your IT team to generate API credentials — that's typically the longest step.
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
      <div className="border border-border bg-surface px-5 py-4 mb-4">
        <span className="text-xs text-white/70 font-medium">Document extraction: </span>
        <span className="text-xs text-muted font-light">
          watsonx.AI handles extraction from any PDF format — including custom, legacy, and non-standard layouts. EVCO had 8 different quote formats; the agents handled all of them. RPA is included only as a fail-safe for edge cases.
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

      <section id="how" data-stage="3" className="border-t border-border bg-surface">
        <HowSection />
      </section>

      {/* Post-how CTA */}
      <div className="border-t border-border px-6 py-8 text-center">
        <p className="text-sm text-muted font-light mb-4">Ready to see the numbers? Calculate your team's cost first.</p>
        <a
          href="#roi"
          className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm"
        >
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

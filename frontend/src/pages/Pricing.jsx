import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEventTracking } from '../hooks/useEventTracking.js';


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

const SETUP_STEPS = [
  { n: '01', time: 'Minutes', title: 'Start your free trial', desc: 'Sign up for IBM watsonx Orchestrate directly on IBM\'s site. No credit card required to get started.' },
  { n: '02', time: '~30 min', title: 'Connect your ERP', desc: 'Have IT generate API credentials in your ERP — typically under an hour. No on-premise install, no firewall exceptions, no database access.' },
  { n: '03', time: 'Overnight', title: 'Agents run, gaps surface', desc: 'Configure your pricing rules and MOQ thresholds, or let our implementation partner handle it. First run is read-only — every discrepancy surfaces before anything changes.' },
];

const FAQS = [
  { q: 'Our customers send POs in completely different formats. Can the agent handle that?', a: 'Yes — that\'s the core of it. Document extraction runs within Orchestrate Flow, pulling structured pricing data from any PO format without templates or manual mapping. One deployment handled 8 distinct formats from a single customer. No standardization needed on your end.' },
  { q: 'Does the agent make changes automatically, or does a human approve?', a: 'Depends on the violation. Tiered pricing discrepancies below your threshold are auto-corrected. MOQ violations and anything above the threshold are held and routed for approval. You set the thresholds.' },
  { q: 'How long does setup take?', a: 'Most of the time is waiting for API credentials to be generated — the configuration itself is fast. A dry-run runs overnight before anything goes live. Your IBM rep will scope a timeline before anything is committed.' },
  { q: 'What ERP and CPQ systems do you support?', a: 'SAP, Oracle ERP, Dynamics 365, NetSuite, Del Mia Works, Salesforce CPQ, HubSpot, Conga, DealHub — and any platform with a REST or SOAP API. Tell us what you\'re running and we\'ll confirm.' },
  { q: 'Can we configure the rules the agent enforces?', a: 'Yes. You set price variance thresholds, MOQ routing logic, contract expiry handling, and approval hierarchy. Rules are configured during onboarding and can be updated anytime.' },
  { q: 'Is there a dry run before the agent goes live?', a: 'Always. The first run is read-only — the agent surfaces every discrepancy but changes nothing. You review and approve before any ERP writes happen.' },
  { q: 'Is our pricing data secure?', a: 'Encrypted in transit (TLS 1.3) and at rest (AES-256). Never used for model training or shared with third parties. Compliance docs available on request.' },
  { q: 'Do we need IT involvement?', a: 'Yes, but minimal. IT generates API credentials in your ERP — typically under an hour. No on-premise install, no firewall exceptions, no database access. Your IBM rep and the implementation partner are available throughout.' },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border first:border-t-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left hover:opacity-80 transition-opacity"
      >
        <span className="text-sm font-medium pr-8">{faq.q}</span>
        {open
          ? <ChevronUp size={14} className="text-ibm-blue shrink-0" />
          : <ChevronDown size={14} className="text-muted shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-muted text-sm font-light leading-relaxed pb-5">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OutreachModal({ title, onClose }) {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'abhi.surampudi@ibm.com';
  const { trackEvent } = useEventTracking();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-surface border border-border p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-semibold text-base">{title}</h3>
            <p className="text-muted text-sm font-light mt-0.5">15 minutes. I'll walk you through a real customer PO end-to-end.</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1"><X size={16} /></button>
        </div>
        <p className="text-sm text-muted font-light mb-6 leading-relaxed">
          Happy to show you what the agent actually catches — no forms, no commitment. Just a live walkthrough of the concept.
        </p>
        <a
          href={calendlyUrl || `mailto:${contactEmail}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('cta_click', { cta: 'book_meeting' })}
          className="w-full flex items-center justify-between px-4 py-3 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold text-sm transition-colors"
        >
          <span>{calendlyUrl ? 'Pick a time' : 'Send me an email'}</span>
          <ChevronRight size={14} />
        </a>
        <p className="text-center text-[10px] text-dim font-light mt-3">No forms. No personal data collected.</p>
      </motion.div>
    </div>
  );
}

export default function Pricing() {
  const [outreachModal, setOutreachModal] = useState(null);
  const { trackEvent } = useEventTracking();
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'abhi.surampudi@ibm.com';
  const implHelpHref = `mailto:${contactEmail}?subject=${encodeURIComponent(IMPL_SUBJECT)}&body=${encodeURIComponent(IMPL_BODY)}`;

  return (
    <div className="min-h-screen bg-surface-2">

      {/* ── Top nav with product tabs ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-2/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center gap-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-6">
            <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">QuoteGuard</span>
          </Link>

          {/* Divider */}
          <div className="h-4 w-px bg-border mr-0 shrink-0" />

          {/* Product tabs */}
          <Link
            to="/"
            className="h-11 flex items-center px-4 text-xs text-muted hover:text-white transition-colors border-b-2 border-transparent"
          >
            Overview
          </Link>
          <div className="h-11 flex items-center px-4 text-xs text-white font-medium border-b-2 border-ibm-blue">
            Pricing
          </div>

          <div className="flex-1" />

          <div className="hidden sm:flex items-center gap-2">
            <a
              href={implHelpHref}
              onClick={() => trackEvent('cta_click', { cta: 'nav_impl' })}
              className="text-xs text-muted hover:text-white font-light transition-colors px-3 py-1.5"
            >
              Work with our implementation partner
            </a>
            <a
              href={import.meta.env.VITE_IBM_TRIAL_URL || 'https://www.ibm.com/account/reg/us-en/signup?formid=urx-52753'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('cta_click', { cta: 'nav_trial' })}
              className="flex items-center gap-1.5 bg-ibm-blue hover:bg-ibm-blue-hover text-white text-xs font-semibold px-3 py-1.5 transition-colors"
            >
              Start free trial
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-11">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted font-light mb-8">
                <Link to="/" className="hover:text-white transition-colors">QuoteGuard</Link>
                <span>/</span>
                <span className="text-white">Pricing</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-light text-white mb-6 leading-none tracking-tight">Pricing</h1>
              <p className="text-base text-muted font-light max-w-sm leading-relaxed">
                Runs on IBM watsonx Orchestrate. Trial starts on IBM's site. Implementation requires our partner network.
              </p>
            </div>
            {/* Right — attribution */}
            <div className="hidden md:flex flex-col items-end justify-center h-48 gap-2">
              <div className="text-[10px] tracking-label text-muted uppercase font-semibold">Built using</div>
              <div className="text-2xl font-light text-white/70 tracking-tight">IBM watsonx</div>
              <div className="text-[11px] text-dim font-light text-right max-w-[220px] leading-relaxed">
                Custom demo by an IBM representative.<br />Not an official IBM product.
              </div>
            </div>
          </div>
        </div>

        {/* ── IBM product ───────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">The platform</div>
          <h2 className="text-3xl font-light text-white mb-3">IBM watsonx Orchestrate</h2>
          <p className="text-muted font-light text-sm mb-12 max-w-lg">
            Document extraction, agent orchestration, and ERP connectivity — all within Orchestrate. Trial on IBM's site. Implementation through our partner network.
          </p>

          <div className="border border-border mb-6">
            <div className="h-1 bg-ibm-blue w-full" />
            <div className="grid md:grid-cols-2 gap-0">

              {/* What it does */}
              <div className="px-8 py-8 border-r border-border">
                <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">What it does</div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Extracts structured data from any PO format via Orchestrate Flow — no templates, no manual mapping',
                    'Connects agents directly to your ERP (SAP, Oracle, Dynamics, Del Mia Works, and more)',
                    'Runs four validation agents overnight: Customer, Pricing, Inventory, Sales Order',
                    'Auto-corrects tiered pricing discrepancies; routes MOQ violations for approval',
                    'Full audit trail emailed to executives after each run',
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check size={12} className="text-ibm-blue-light shrink-0 mt-0.5" />
                      <span className="text-sm text-muted font-light leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={import.meta.env.VITE_IBM_TRIAL_URL || 'https://www.ibm.com/account/reg/us-en/signup?formid=urx-52753'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('cta_click', { cta: 'start_trial_card' })}
                    className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-5 py-3 transition-colors text-sm"
                  >
                    Start free trial
                    <ChevronRight size={14} />
                  </a>
                  <a
                    href={implHelpHref}
                    onClick={() => trackEvent('cta_click', { cta: 'impl_help_card' })}
                    className="inline-flex items-center gap-2 border border-border hover:border-border-bright text-white font-semibold px-5 py-3 transition-colors text-sm"
                  >
                    Work with our implementation partner
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>

              {/* Pricing */}
              <div className="px-8 py-8">
                <div className="text-[10px] tracking-label text-muted font-semibold uppercase mb-4">How it's priced</div>
                <p className="text-sm text-muted font-light leading-relaxed mb-6">
                  Orchestrate is billed on <span className="text-white">message volume</span> — each document extracted and each agent API call counts as a message.
                </p>
                <div className="border border-border px-5 py-5 mb-6">
                  <div className="text-[10px] text-muted font-semibold uppercase tracking-wide mb-3">Essentials Plan</div>
                  <div className="font-mono font-bold text-xl text-ibm-blue-light mb-4">
                    from $530<span className="text-sm font-light text-muted">/month</span>
                  </div>
                  <div className="space-y-3 mb-3">
                    {[
                      ['4,000', 'Monthly Active Users'],
                      ['200,000', 'Messages / month'],
                      ['10 GB', 'Document storage'],
                    ].map(([val, label]) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-muted font-light">{label}</span>
                        <span className="text-base font-mono font-bold text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-dim font-light leading-relaxed border-t border-border pt-3">
                    Document extraction and agent API calls both count toward your message total. Higher tiers available — your IBM rep sizes the right package.
                  </div>
                </div>
                <a
                  href="https://www.ibm.com/products/watsonx-orchestrate/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('cta_click', { cta: 'orchestrate_pricing' })}
                  className="inline-flex items-center gap-2 text-ibm-blue-light hover:text-white text-xs font-semibold transition-colors"
                >
                  View full Orchestrate pricing <ChevronRight size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* watsonx.data add-on */}
          <div className="border border-border flex items-stretch mb-6">
            <div className="w-1 bg-border shrink-0" />
            <div className="px-6 py-5 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] tracking-label text-muted font-semibold uppercase mb-1">Optional add-on — IBM watsonx.data</div>
                  <div className="text-sm font-medium text-white mb-1">No existing document storage?</div>
                  <p className="text-sm text-muted font-light leading-relaxed max-w-xl">
                    If your team doesn't have infrastructure for storing POs and contracts, watsonx.data handles it. Agents query documents directly — no separate file management needed.
                  </p>
                </div>
                <a
                  href="https://www.ibm.com/products/watsonx-data"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('cta_click', { cta: 'watsonxdata_page' })}
                  className="inline-flex items-center gap-2 border border-border hover:border-border-bright text-white font-semibold px-4 py-2.5 transition-colors text-sm shrink-0"
                >
                  Learn more <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Implementation note */}
          <div className="border border-border flex items-stretch">
            <div className="w-1 bg-ibm-blue shrink-0" />
            <div className="px-6 py-5">
              <div className="text-sm font-medium text-white mb-1">Need help with implementation?</div>
              <p className="text-sm text-muted font-light leading-relaxed max-w-2xl">
                Our partner network handles the full setup — ERP API credentials, agent configuration, pricing rules, MOQ thresholds, and approval routing. Reach out and we'll connect you with the right team.
              </p>
            </div>
          </div>
        </div>

        {/* ── Trust signals ─────────────────────────────────────────────────── */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['IBM watsonx Orchestrate', 'SAP · Oracle · Dynamics · Del Mia Works', 'Start free on IBM — no credit card', 'Implementation via partner network'].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={10} className="text-success shrink-0" />
                  <span className="text-[11px] text-muted font-light">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Getting started ───────────────────────────────────────────────── */}
        <div className="border-t border-border bg-surface">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-light text-white mb-2">Start in three steps</h2>
            <p className="text-muted font-light text-sm mb-12">Self-serve or with implementation help. Any ERP with a REST or SOAP API.</p>
            <div className="grid md:grid-cols-3 gap-0 border border-border mb-8">
              {SETUP_STEPS.map((s, i) => (
                <div key={i} className="px-6 py-8 border-r border-border last:border-r-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[10px] text-ibm-blue font-semibold">{s.n}</span>
                    <span className="font-mono text-[10px] text-muted font-light">{s.time}</span>
                  </div>
                  <div className="text-base font-medium mb-2">{s.title}</div>
                  <div className="text-sm text-muted font-light leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={import.meta.env.VITE_IBM_TRIAL_URL || 'https://www.ibm.com/account/reg/us-en/signup?formid=urx-52753'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_click', { cta: 'start_trial_setup' })}
                className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm"
              >
                Start free trial
                <ChevronRight size={14} />
              </a>
              <a
                href={implHelpHref}
                onClick={() => trackEvent('cta_click', { cta: 'impl_help_setup' })}
                className="inline-flex items-center gap-2 border border-border hover:border-border-bright text-white font-semibold px-6 py-3 transition-colors text-sm"
              >
                Work with our implementation partner
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-light text-white mb-12">FAQ</h2>
            <div className="max-w-3xl border-b border-border">
              {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} />)}
            </div>
          </div>
        </div>

        {/* ── Take the next step ────────────────────────────────────────────── */}
        <div className="border-t border-border bg-surface">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-light text-white mb-3">Ready to get started?</h2>
            <p className="text-muted font-light mb-8 max-w-md text-sm leading-relaxed">
              Trial is self-serve on IBM's site. Configuration and ERP setup requires working with our implementation partner.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={import.meta.env.VITE_IBM_TRIAL_URL || 'https://www.ibm.com/account/reg/us-en/signup?formid=urx-52753'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_click', { cta: 'start_trial_bottom' })}
                className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm"
              >
                Start free trial
                <ChevronRight size={14} />
              </a>
              <a
                href={implHelpHref}
                onClick={() => trackEvent('cta_click', { cta: 'impl_help_bottom' })}
                className="flex items-center gap-2 border border-border hover:border-border-bright text-white font-semibold px-6 py-3 transition-colors text-sm"
              >
                Work with our implementation partner
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Disclaimer footer ─────────────────────────────────────────────── */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[10px] text-dim font-light leading-relaxed max-w-xl">
            This is a custom demo created by an IBM representative to illustrate a concept. It is not an official IBM website or product.
          </p>
          <p className="text-[10px] text-dim font-light shrink-0">
            Anonymous page views and clicks only. No personal data collected.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {outreachModal && <OutreachModal title={outreachModal} onClose={() => setOutreachModal(null)} />}
      </AnimatePresence>
    </div>
  );
}

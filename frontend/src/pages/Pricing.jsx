import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEventTracking } from '../hooks/useEventTracking.js';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '~$1,500',
    period: '/month',
    tagline: 'One plant. One ERP. Prove the agent works.',
    priceNote: 'Most single-facility teams fall within this range.',
    features: [
      '1 ERP integration (SAP, Oracle, or Dynamics)',
      'Up to 500 customer POs/month',
      'Overnight agentic validation run',
      'Tiered pricing + MOQ rule templates',
      'Auto-correct or hold with email alert',
      'Email support (next business day)',
    ],
    cta: 'Get a quote',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '~$2,200',
    period: '/month',
    tagline: 'Multi-plant. Custom rule logic. Full audit trail.',
    priceNote: 'Most mid-market manufacturers fall within this range.',
    features: [
      '2 ERP integrations',
      'Up to 2,000 customer POs/month',
      'Custom agent rule logic (pricing, MOQ, contract expiry)',
      'Interactive mode — approval gates per agent',
      'Pricing drift analytics dashboard',
      'Executive email audit trail after each run',
      'Slack support',
    ],
    cta: 'Get a quote',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'Unlimited plants. Dedicated agent engineer.',
    priceNote: null,
    features: [
      'Unlimited ERP integrations',
      'Unlimited PO volume',
      'Dedicated agent configuration engineer',
      'Custom rule logic for any manufacturing workflow',
      'Human-in-the-loop approval routing',
      'SLA with guaranteed uptime',
      'SAML SSO + advanced security',
      'Quarterly business reviews',
    ],
    cta: 'Contact us',
    popular: false,
  },
];

const SETUP_STEPS = [
  { time: '~30 min', title: 'Connect your ERP', desc: 'API credentials only. No on-premise install, no database access.' },
  { time: '~20 min', title: 'Define your business rules', desc: 'Tiered thresholds, MOQ routing, approval hierarchy.' },
  { time: 'Overnight', title: 'Go live', desc: 'Runs after hours. Audit trail emailed to executives.' },
];

const FAQS = [
  { q: 'Our customers send POs in completely different formats. Can the agent handle that?', a: 'Yes — that\'s the core of it. watsonx.AI extracts pricing data from any PO format without templates or manual mapping. One initial deployment handled 8 distinct formats from a single customer. No standardization needed on your end.' },
  { q: 'Does the agent make changes automatically, or does a human approve?', a: 'Depends on the violation. Tiered pricing discrepancies below your threshold are auto-corrected. MOQ violations and anything above the threshold are held and routed for approval. You set the thresholds.' },
  { q: 'How long does setup take?', a: 'Most of the time is waiting for API credentials to be generated — the configuration is fast. We run a dry-run overnight before anything goes live. We\'ll scope a timeline before you commit.' },
  { q: 'What ERP and CPQ systems do you support?', a: 'SAP, Oracle ERP, Dynamics 365, NetSuite, Del Mia Works, Salesforce CPQ, HubSpot, Conga, DealHub — and any platform with a REST or SOAP API. Tell us what you\'re running and we\'ll confirm.' },
  { q: 'Can we configure the rules the agent enforces?', a: 'Yes. You set price variance thresholds, MOQ routing logic, contract expiry handling, and approval hierarchy. Rules are configured during onboarding and can be updated anytime.' },
  { q: 'Is there a dry run before the agent goes live?', a: 'Always. The first run is read-only — the agent surfaces every discrepancy but changes nothing. You review and approve before any ERP writes happen.' },
  { q: 'Is our pricing data secure?', a: 'Encrypted in transit (TLS 1.3) and at rest (AES-256). Never used for model training or shared with third parties. Compliance docs available on request.' },
  { q: 'Do we need IT involvement?', a: 'Yes, but minimal. IT generates API credentials in your ERP — typically under an hour. No on-premise install, no firewall exceptions, no database access. We\'re available throughout.' },
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

function ContactModal({ tier, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [done, setDone] = useState(false);
  const { trackEvent } = useEventTracking();
  const isEnterprise = tier.id === 'enterprise';

  async function handleSubmit() {
    if (!name || !email || !company) return;
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, role: tier.name }),
      });
      trackEvent('purchase_intent', { tier: tier.name, name, company });
    } catch { /* non-critical */ }
    setDone(true);
  }

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
            <h3 className="font-semibold text-base">{isEnterprise ? 'Contact us' : `Get a quote — ${tier.name}`}</h3>
            <p className="text-muted text-sm font-light mt-0.5">Real price scoped to your stack within 1 business day. No discovery call.</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1"><X size={16} /></button>
        </div>
        {done ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-4">
              <Check size={20} className="text-success" />
            </div>
            <h4 className="font-semibold text-base mb-2">Request received!</h4>
            <p className="text-muted text-sm font-light">We'll reach out to {email} within 1 business day.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2.5 mb-5">
              {[
                { ph: 'Full name', val: name, set: setName, type: 'text' },
                { ph: 'Work email', val: email, set: setEmail, type: 'email' },
                { ph: 'Company name', val: company, set: setCompany, type: 'text' },
              ].map(f => (
                <input
                  key={f.ph} type={f.type} placeholder={f.ph} value={f.val}
                  onChange={e => f.set(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors font-light"
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!name || !email || !company}
              className="w-full bg-ibm-blue hover:bg-ibm-blue-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors text-sm"
            >
              {isEnterprise ? 'Contact us' : 'Start protecting my quotes'}
            </button>
            <p className="text-center text-xs text-muted font-light mt-3">Read-only first. Nothing changes until you approve.</p>
          </>
        )}
      </motion.div>
    </div>
  );
}

function RequestMeetingModal({ onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [done, setDone] = useState(false);
  const { trackEvent } = useEventTracking();

  async function handleSubmit() {
    if (!name || !email || !company) return;
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, role: 'meeting_request' }),
      });
      trackEvent('cta_click', { cta: 'request_meeting', company });
    } catch { /* non-critical */ }
    setDone(true);
  }

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
            <h3 className="font-semibold text-base">Request a meeting</h3>
            <p className="text-muted text-sm font-light mt-0.5">15 minutes. We'll show you what the agent catches in your stack.</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1"><X size={16} /></button>
        </div>
        {done ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-4">
              <Check size={20} className="text-success" />
            </div>
            <h4 className="font-semibold text-base mb-2">We'll be in touch.</h4>
            <p className="text-muted text-sm font-light">Expect a reply to {email} within 1 business day.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2.5 mb-5">
              {[
                { ph: 'Full name', val: name, set: setName, type: 'text' },
                { ph: 'Work email', val: email, set: setEmail, type: 'email' },
                { ph: 'Company name', val: company, set: setCompany, type: 'text' },
              ].map(f => (
                <input
                  key={f.ph} type={f.type} placeholder={f.ph} value={f.val}
                  onChange={e => f.set(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors font-light"
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!name || !email || !company}
              className="w-full bg-ibm-blue hover:bg-ibm-blue-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors text-sm"
            >
              Request a meeting
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function Pricing() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [meetingModal, setMeetingModal] = useState(false);
  const { trackEvent } = useEventTracking();

  function openModal(tier) {
    setSelectedTier(tier);
    trackEvent('cta_click', { cta: tier.cta, tier: tier.name });
  }

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

          <button
            onClick={() => setMeetingModal(true)}
            className="hidden sm:flex items-center gap-1.5 bg-ibm-blue hover:bg-ibm-blue-hover text-white text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            Request a meeting
          </button>
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
                Not a script. Not a batch job. An agent that validates every customer PO against your ERP pricing rules — automatically, overnight, every night.
              </p>
            </div>
            {/* Right — IBM logo */}
            <div className="hidden md:flex items-center justify-center h-48">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
                alt="IBM"
                className="w-44 opacity-90"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
        </div>

        {/* ── Pricing plans ─────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-light text-white mb-10">Pricing plans</h2>

          <div className="grid md:grid-cols-3 gap-0 border border-border">
            {TIERS.map((tier, i) => (
              <div
                key={tier.id}
                className={`flex flex-col border-r border-border last:border-r-0 ${tier.popular ? 'bg-ibm-blue/5' : ''}`}
              >
                {/* Top accent bar for popular */}
                {tier.popular
                  ? <div className="h-1 bg-ibm-blue w-full" />
                  : <div className="h-1" />}

                {/* Price + CTA section */}
                <div className="px-6 pt-6 pb-6">
                  <div className="text-[10px] tracking-label font-semibold uppercase text-muted mb-4">{tier.name}</div>
                  {tier.price !== 'Custom' && (
                    <div className="text-[11px] text-muted font-light mb-1">Starting at</div>
                  )}
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="font-mono font-bold text-3xl text-white">{tier.price}</span>
                    {tier.period && <span className="text-muted text-sm font-light">{tier.period}</span>}
                  </div>
                  {tier.priceNote && (
                    <p className="text-[10px] text-dim font-light mb-5">{tier.priceNote}</p>
                  )}
                  {!tier.priceNote && <div className="mb-5" />}
                  <button
                    onClick={() => openModal(tier)}
                    className={`w-full flex items-center justify-between px-4 py-3 font-semibold text-sm transition-colors ${
                      tier.popular
                        ? 'bg-ibm-blue hover:bg-ibm-blue-hover text-white'
                        : 'border border-border hover:border-border-bright text-white'
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Description + features */}
                <div className="px-6 py-6 flex-1">
                  <p className="text-sm text-muted font-light mb-5 leading-relaxed">{tier.tagline}</p>
                  <ul className="space-y-2.5">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        <Check size={12} className={`shrink-0 mt-0.5 ${tier.popular ? 'text-ibm-blue-light' : 'text-success'}`} />
                        <span className="text-xs text-muted font-light leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-dim font-light mt-4">
            * Prices are indicative and confirmed after we scope your ERP, PO volume, and rule complexity.
          </p>
        </div>

        {/* ── Trust signals ─────────────────────────────────────────────────── */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Powered by IBM watsonx Orchestrate', 'SAP · Salesforce · Oracle · Dynamics', 'TLS 1.3 + AES-256 encryption', 'No vendor lock-in'].map((t, i) => (
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
            <h2 className="text-3xl font-light text-white mb-2">Getting started</h2>
            <p className="text-muted font-light text-sm mb-12">Any ERP. Any quote format. Live in under an hour.</p>
            <div className="grid md:grid-cols-3 gap-0 border border-border">
              {SETUP_STEPS.map((s, i) => (
                <div key={i} className="px-6 py-8 border-r border-border last:border-r-0">
                  <div className="font-mono text-xs text-ibm-blue-light font-semibold mb-3">{s.time}</div>
                  <div className="text-base font-medium mb-2">{s.title}</div>
                  <div className="text-sm text-muted font-light leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted font-light mt-4">Any ERP or CPQ with a REST or SOAP API. Credentials only — no on-premise work.</p>
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
            <h2 className="text-3xl font-light text-white mb-3">Take the next step</h2>
            <p className="text-muted font-light mb-8 max-w-md text-sm leading-relaxed">
              Connect your ERP. Define your rules. Let the agent catch what your team catches manually.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setMeetingModal(true); trackEvent('cta_click', { cta: 'request_meeting_bottom' }); }}
                className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm"
              >
                Request a meeting
                <ChevronRight size={14} />
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 border border-ibm-blue text-ibm-blue-light hover:bg-ibm-blue/10 font-semibold px-6 py-3 transition-colors text-sm"
              >
                View the demo
                <ChevronRight size={14} />
              </Link>
            </div>
            <p className="text-xs text-muted font-light mt-4">Takes ~30 minutes. Read-only first. Nothing changes until you approve.</p>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {selectedTier && <ContactModal tier={selectedTier} onClose={() => setSelectedTier(null)} />}
        {meetingModal && <RequestMeetingModal onClose={() => setMeetingModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

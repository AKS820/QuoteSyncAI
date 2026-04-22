import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, X, ArrowLeft } from 'lucide-react';
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
    cta: 'Get a quote for my stack',
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
    cta: 'Get a quote for my stack',
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
    cta: 'Talk to an engineer',
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
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-surface transition-colors"
      >
        <span className="text-sm font-medium pr-4">{faq.q}</span>
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
            <p className="text-muted text-sm font-light leading-relaxed px-4 pb-4">{faq.a}</p>
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
            <h3 className="font-semibold text-base">{isEnterprise ? 'Talk to an engineer' : `Get a quote — ${tier.name}`}</h3>
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
              {isEnterprise ? 'Talk to an engineer' : 'Start protecting my quotes'}
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
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-2/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted hover:text-white transition-colors text-xs font-light">
            <ArrowLeft size={12} />
            <span>Overview</span>
          </Link>
          <Link to="/" className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
            <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">QuoteGuard</span>
          </Link>
          <button
            onClick={() => setMeetingModal(true)}
            className="hidden sm:block bg-ibm-blue hover:bg-ibm-blue-hover text-white text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            Request a meeting
          </button>
        </div>
      </nav>

      <div className="pt-11">
        {/* Pricing header + tiers */}
        <div className="py-24 px-6 max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Pricing</div>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">
              Agents that catch pricing errors<br />
              <span className="font-light text-white/70">before your shop floor does.</span>
            </h1>
            <p className="text-base font-semibold text-white mb-3">
              Not a script. Not a batch job. An agent that validates every customer PO against your ERP pricing rules — automatically, overnight, every night.
            </p>
            <p className="text-muted font-light max-w-xl mb-4">
              Prices are indicative — confirmed after we scope your stack. Reply within 1 business day. No discovery call.
            </p>
            <div className="inline-flex items-center gap-2 border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning/80 font-light">
              Most manufacturers find their first tiered pricing or MOQ violation within 24 hours of connecting.
            </div>
          </div>

          {/* Tier grid */}
          <div className="border border-border mb-12">
            <div className="grid md:grid-cols-3 divide-x divide-border">
              {TIERS.map((tier) => (
                <div key={tier.id} className={`flex flex-col ${tier.popular ? 'bg-ibm-blue/5' : ''}`}>
                  <div className={`px-5 py-3 border-b border-border ${tier.popular ? 'bg-ibm-blue/10' : 'bg-surface'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-label font-semibold uppercase text-muted">{tier.name}</span>
                      {tier.popular && (
                        <span className="text-[10px] bg-ibm-blue text-white px-2 py-0.5 font-semibold tracking-wide">Most Popular</span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className="font-mono font-bold text-3xl text-white">{tier.price}</span>
                      <span className="text-muted text-sm font-light">{tier.period}</span>
                      <p className="text-xs text-muted font-light mt-1">{tier.tagline}</p>
                      {tier.priceNote && <p className="text-[10px] text-dim font-light mt-1">{tier.priceNote}</p>}
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {tier.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm">
                          <Check size={12} className={`shrink-0 mt-0.5 ${tier.popular ? 'text-ibm-blue-light' : 'text-success'}`} />
                          <span className="text-muted font-light leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openModal(tier)}
                      className={`w-full py-3 font-semibold text-sm transition-colors ${
                        tier.popular
                          ? 'bg-ibm-blue hover:bg-ibm-blue-hover text-white'
                          : 'border border-border hover:border-border-bright text-white'
                      }`}
                    >
                      {tier.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust signals */}
          <div className="border border-border bg-surface mb-24">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
              {['Powered by IBM watsonx Orchestrate', 'SAP · Salesforce · Oracle · Dynamics', 'TLS 1.3 + AES-256 encryption', 'No vendor lock-in'].map((t, i) => (
                <div key={i} className="px-4 py-3 text-center">
                  <Check size={10} className="text-success inline mr-1.5" />
                  <span className="text-[11px] text-muted font-light">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Setup */}
        <div className="border-t border-border bg-surface">
          <div className="py-24 px-6 max-w-4xl mx-auto">
            <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Setup</div>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-12 leading-tight">
              Any ERP. Any quote format.<br />
              <span className="font-light text-white/60">Live in under an hour.</span>
            </h2>
            <div className="border border-border mb-4">
              {SETUP_STEPS.map((s, i) => (
                <div key={i} className="flex items-start gap-5 px-5 py-5 border-b border-border last:border-b-0">
                  <div className="font-mono text-xs text-ibm-blue-light font-semibold w-16 shrink-0 pt-0.5">{s.time}</div>
                  <div>
                    <div className="text-sm font-medium mb-0.5">{s.title}</div>
                    <div className="text-xs text-muted font-light">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted font-light">Any ERP or CPQ with a REST or SOAP API. Credentials only — no on-premise work.</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="border-t border-border">
          <div className="py-24 px-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8">Frequently asked questions</h2>
            <div className="border border-border">
              {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} />)}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-border bg-surface">
          <div className="py-24 px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-2">Ready to run your first agent?</h2>
            <p className="text-muted font-light mb-8 max-w-md mx-auto text-sm">
              Connect your ERP. Define your rules. Let the agent catch what your team catches manually.
            </p>
            <button
              onClick={() => { setMeetingModal(true); trackEvent('cta_click', { cta: 'request_meeting_bottom' }); }}
              className="bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-8 py-3.5 transition-colors text-sm"
            >
              Request a meeting
            </button>
            <p className="text-xs text-muted font-light mt-3">
              Takes ~30 minutes. Read-only first. Nothing changes until you approve.
            </p>
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

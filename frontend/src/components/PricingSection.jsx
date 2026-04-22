import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

// ⚠️  PLACEHOLDER PRICING — replace with real numbers before launch.
// These are illustrative anchors only. The self-serve buyer needs a number
// to trust this is real. Even a rough range converts better than "Contact us."
const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '~$1,500',
    period: '/month',
    tagline: 'One ERP. One CPQ. Prove it works.',
    priceNote: 'Most teams in this tier fall within this range.',
    features: [
      '1 ERP integration (SAP, Oracle, or Dynamics)',
      '1 CPQ integration (Salesforce CPQ or HubSpot)',
      'Up to 500 quotes/month',
      'Continuous detection agent — runs 24/7',
      'Email support (next business day)',
      'Standard detection rule templates',
    ],
    cta: 'Get a quote for my stack',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '~$2,200',
    period: '/month',
    tagline: 'Multiple integrations. Custom workflows.',
    priceNote: 'Most mid-market teams fall within this range.',
    features: [
      '2 ERP integrations',
      '2 CPQ integrations',
      'Up to 2,000 quotes/month',
      'Custom approval workflows',
      'Slack support',
      'ROI dashboard + detection analytics',
      'Custom detection rules',
    ],
    cta: 'Get a quote for my stack',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'Unlimited integrations. Dedicated engineer.',
    priceNote: null,
    features: [
      'Unlimited ERP + CPQ integrations',
      'Unlimited quotes/month',
      'Dedicated agent configuration engineer',
      'Custom detection rules & approval workflows',
      'SLA with guaranteed uptime',
      'Quarterly business reviews',
      'Custom onboarding & training',
      'SAML SSO + advanced security',
    ],
    cta: 'Talk to an engineer',
    popular: false,
  },
];

const FAQS = [
  { q: 'How long does setup take?', a: 'Setup involves connecting your ERP and CPQ via API credentials and running a dry run against a sample of your quotes. Most of that time is waiting for credentials to be generated — the actual configuration is fast. We\'ll give you a realistic timeline when we scope your stack.' },
  { q: 'Do you support systems other than SAP?', a: 'Yes. We support Oracle ERP, Microsoft Dynamics 365, NetSuite, HubSpot, Salesforce CPQ, Conga, DealHub, and any platform that exposes a REST or SOAP API. Tell us what you\'re running and we\'ll confirm before you commit.' },
  { q: 'Is our pricing data secure?', a: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Your pricing data is never used for model training or shared with any third party. Compliance documentation available on request.' },
  { q: 'Can we customize the detection rules?', a: 'Yes. You can configure price variance thresholds (e.g., auto-correct if difference ≤ 5%, flag for approval if > 5%), quote status filters, and custom field mappings for non-standard CPQ configurations.' },
  { q: 'What if a detection run fails?', a: 'Every detection event is logged. If something goes wrong mid-run, the agent does not apply partial corrections — it rolls back and alerts you. You can review and replay any run from the dashboard.' },
  { q: 'Do we need IT involvement?', a: 'Yes — your IT team needs to generate API credentials in your ERP and CPQ systems, which typically takes under an hour. No on-premise installation, no firewall exceptions beyond standard API access, no database access. After that, QuoteGuard handles the rest and we\'re available throughout to support your team.' },
  { q: 'Is there a trial?', a: 'We don\'t currently offer a self-serve trial, but you can try the agent in the demo above and we\'ll run a dry run against a real subset of your quotes before any contract is signed.' },
  { q: "What's the contract structure?", a: 'Reach out and we\'ll walk you through options. We\'re not going to make you sit through a 3-call sales process to get a number — that\'s exactly the problem we\'re solving for our customers.' },
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
        {open ? <ChevronUp size={14} className="text-ibm-blue shrink-0" /> : <ChevronDown size={14} className="text-muted shrink-0" />}
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

function PurchaseModal({ tier, onClose }) {
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
            <p className="text-muted text-sm font-light mt-0.5">
              We'll reply within 1 business day with a real price scoped to your stack. No discovery call required.
            </p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1"><X size={16} /></button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-4">
              <Check size={20} className="text-success" />
            </div>
            <h4 className="font-semibold text-base mb-2">Request received!</h4>
            <p className="text-muted text-sm font-light">
              We'll reach out to {email} within 1 business day to walk through your stack and get you set up.
            </p>
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
                  key={f.ph}
                  type={f.type}
                  placeholder={f.ph}
                  value={f.val}
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
            <p className="text-center text-xs text-muted font-light mt-3">
              First run is read-only — nothing changes until you approve. Reply within 1 business day.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PricingSection() {
  const [selectedTier, setSelectedTier] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { trackEvent } = useEventTracking();

  function openModal(tier) {
    setSelectedTier(tier);
    trackEvent('cta_click', { cta: tier.cta, tier: tier.name, stage: 6 });
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-12">
        <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Stage 4 — Pricing</div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">
          This isn't an RPA script.<br />
          <span className="font-light text-white/70">It's an agentic ops team that never sleeps.</span>
        </h2>
        <p className="text-base font-semibold text-white mb-3">
          Eliminate 15 hrs/week of manual reconciliation — most teams break even in under 4 months.
        </p>
        <p className="text-muted font-light max-w-xl mb-4">
          Prices below are indicative — exact cost confirmed after we scope your stack and quote volume. Fill out the form and we reply within 1 business day. No discovery call required.
        </p>
        <div className="inline-flex items-center gap-2 border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning/80 font-light">
          Most teams find their first missed pricing rule within 24 hours of connecting. Every day of manual reconciliation is ops time you won't recover.
        </div>
      </div>

      {/* Pricing grid */}
      <div className="border border-border mb-16">
        <div className="grid md:grid-cols-3 divide-x divide-border">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`flex flex-col ${tier.popular ? 'bg-ibm-blue/5' : ''}`}
            >
              {/* Tier header */}
              <div className={`px-5 py-3 border-b border-border ${tier.popular ? 'bg-ibm-blue/10' : 'bg-surface'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-label font-semibold uppercase text-muted">{tier.name}</span>
                  {tier.popular && (
                    <span className="text-[10px] bg-ibm-blue text-white px-2 py-0.5 font-semibold tracking-wide">Most Popular</span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Price */}
                <div className="mb-4">
                  <span className="font-mono font-bold text-3xl text-white">{tier.price}</span>
                  <span className="text-muted text-sm font-light">{tier.period}</span>
                  <p className="text-xs text-muted font-light mt-1">{tier.tagline}</p>
                  {tier.priceNote && (
                    <p className="text-[10px] text-dim font-light mt-1">{tier.priceNote}</p>
                  )}
                </div>

                {/* Features */}
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust signals */}
      <div className="border border-border bg-surface">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {['Powered by IBM watsonx Orchestrate', 'SAP · Salesforce · Oracle · Dynamics', 'TLS 1.3 + AES-256 encryption', 'No vendor lock-in'].map((t, i) => (
            <div key={i} className="px-4 py-3 text-center">
              <Check size={10} className="text-success inline mr-1.5" />
              <span className="text-[11px] text-muted font-light">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8">Frequently asked questions</h2>
        <div className="border border-border">
          {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} />)}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-16 border border-ibm-blue/30 bg-ibm-blue/5 px-8 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Ready to protect your revenue?</h2>
        <p className="text-muted font-light mb-6 max-w-md mx-auto text-sm">
          Join manufacturing teams that have already eliminated manual quote reconciliation.
        </p>
        <button
          onClick={() => openModal(TIERS[1])}
          className="bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-8 py-3 transition-colors text-sm"
        >
          Start protecting my quotes
        </button>
        <p className="text-xs text-muted font-light mt-3">
          Takes ~30 minutes. Read-only first. Nothing changes until you approve.
        </p>
      </div>

      <AnimatePresence>
        {selectedTier && (
          <PurchaseModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
              Real price scoped to your stack within 1 business day. No discovery call.
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
              We'll reach out to {email} within 1 business day.
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
              Read-only first. Nothing changes until you approve.
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
          Agents that catch pricing errors<br />
          <span className="font-light text-white/70">before your shop floor does.</span>
        </h2>
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
        <h2 className="text-2xl font-semibold mb-2">Ready to run your first agent?</h2>
        <p className="text-muted font-light mb-6 max-w-md mx-auto text-sm">
          Connect your ERP. Define your rules. Let the agent catch what your team catches manually.
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

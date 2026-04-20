import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, X, Zap, Building2, Rocket } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$1,500',
    period: '/month',
    icon: Rocket,
    tagline: 'Prove ROI with your first integration',
    features: [
      '1 ERP integration (SAP, Oracle, or Dynamics)',
      '1 CPQ integration (Salesforce CPQ or HubSpot)',
      'Up to 500 quotes/month',
      'Quote Watcher + ERP Validator + Auto-Updater agents',
      'Email support (next business day)',
      'Standard agent rule templates',
      '14-day free trial',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$2,200',
    period: '/month',
    icon: Zap,
    tagline: 'For teams running complex quoting workflows',
    features: [
      '2 ERP integrations',
      '2 CPQ integrations',
      'Up to 2,000 quotes/month',
      'All 3 agents + custom approval workflows',
      'Slack support (4-hour response)',
      'ROI dashboard + sync analytics',
      'Custom agent rule configuration',
      '14-day free trial',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    icon: Building2,
    tagline: 'For manufacturers at scale with complex stacks',
    features: [
      'Unlimited ERP + CPQ integrations',
      'Unlimited quotes/month',
      'Dedicated agent configuration engineer',
      'Custom sync rules & approval workflows',
      'SLA with guaranteed uptime',
      'Quarterly business reviews',
      'Custom onboarding & training program',
      'SAML SSO + advanced security controls',
    ],
    cta: 'Talk to an Expert',
    popular: false,
  },
];

const FAQS = [
  {
    q: 'How long does setup take?',
    a: 'The average deployment is 3 weeks from contract signature to live production sync. Week 1 is API credential setup, Week 2 is agent configuration and rule building, Week 3 is testing and training. Most customers run their first live sync by Day 12.',
  },
  {
    q: 'Do you support systems other than SAP?',
    a: 'Yes. We support Oracle ERP, Microsoft Dynamics 365, HubSpot CRM, Salesforce CPQ, and any system that exposes a REST API. Custom integrations are available on Growth and Enterprise plans. If you\'re on a legacy on-premise ERP, our implementation team will scope a connector during your trial.',
  },
  {
    q: 'Is our pricing data secure?',
    a: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II compliant. Your pricing data is never used for model training or shared with any third party. You can request a deletion of all your data at any time.',
  },
  {
    q: 'Can we customize the agent rules?',
    a: 'Absolutely. The Auto-Updater Agent supports configurable tolerance thresholds (e.g., "auto-update if variance ≤ 5%, flag for approval if > 5%"), quote status filters (skip quotes already "Won" or "Closed"), and custom field mappings for non-standard CPQ configurations.',
  },
  {
    q: 'What if a sync fails?',
    a: 'The agents are fault-tolerant by design. If a sync fails mid-run, the agents roll back to the last consistent state and alert your configured Slack channel (Growth+) or email. Every sync action is logged with a full audit trail — you can replay or undo any correction within 30 days.',
  },
  {
    q: 'Do we need IT involvement?',
    a: 'Minimal. You need someone who can generate API credentials in your ERP and CPQ systems — typically a 30-minute task. No on-premise installation, no firewall exceptions beyond standard API access, no database access required. Most customers complete setup entirely within their sales ops team.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Starter and Growth plans include a 14-day free trial with full functionality. No credit card required. During the trial you get access to our implementation team via Slack to make sure you get to a live sync before the trial ends.',
  },
  {
    q: 'What\'s the contract commitment?',
    a: 'Month-to-month contracts are available on all plans at the listed price. Annual contracts save 15% (billed upfront). Enterprise contracts are negotiated individually. We offer a 30-day money-back guarantee if your first live sync doesn\'t work as expected.',
  },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-ibm-blue-light transition-colors"
      >
        <span className="font-medium text-sm pr-4">{faq.q}</span>
        {open ? <ChevronUp size={16} className="text-ibm-blue shrink-0" /> : <ChevronDown size={16} className="text-muted shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-muted text-sm leading-relaxed pb-5">{faq.a}</p>
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

  const isEnterprise = tier.id === 'enterprise';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-bold text-lg">{isEnterprise ? 'Talk to an Expert' : `Start Your Free Trial — ${tier.name}`}</h3>
            <p className="text-muted text-sm mt-0.5">
              {isEnterprise ? 'A solutions engineer will reach out within 1 business day.' : '14-day free trial. No credit card required.'}
            </p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-success-dim rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-success" />
            </div>
            <h4 className="font-bold text-lg mb-2">
              {isEnterprise ? 'Request received!' : 'Trial activated!'}
            </h4>
            <p className="text-muted text-sm">
              {isEnterprise
                ? 'A QuoteSync solutions engineer will contact you within 1 business day to schedule a discovery call.'
                : `We'll send your trial access to ${email} within a few minutes. Your 14-day clock starts when you activate.`}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-5">
              <input
                type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors"
              />
              <input
                type="email" placeholder="Work email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors"
              />
              <input
                type="text" placeholder="Company name" value={company} onChange={e => setCompany(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!name || !email || !company}
              className="w-full bg-ibm-blue hover:bg-ibm-blue-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {isEnterprise ? 'Request a Call' : 'Start Free Trial'}
            </button>
            <p className="text-center text-xs text-muted mt-3">No credit card required. Cancel anytime.</p>
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
      transition={{ duration: 0.6 }}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <div className="text-center mb-14">
        <div className="inline-block text-xs font-semibold text-ibm-blue bg-ibm-blue-dim px-3 py-1 rounded-full mb-4">STAGE 6 — PRICING</div>
        <h2 className="text-4xl font-bold mb-3">Simple pricing, serious ROI</h2>
        <p className="text-muted max-w-xl mx-auto">The average customer recovers the full annual contract cost within 3 months of going live. Annual contracts save 15%.</p>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              tier.popular
                ? 'border-ibm-blue bg-ibm-blue-dim shadow-glow-blue'
                : 'border-border bg-surface'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-ibm-blue text-white text-xs font-bold px-4 py-1 rounded-full shadow-glow-blue-sm">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tier.popular ? 'bg-ibm-blue/30' : 'bg-surface-2'}`}>
                <tier.icon size={20} className={tier.popular ? 'text-ibm-blue-light' : 'text-muted'} />
              </div>
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="text-muted text-sm mt-1">{tier.tagline}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">{tier.price}</span>
              <span className="text-muted text-sm">{tier.period}</span>
              {tier.price !== 'Custom' && <div className="text-xs text-muted mt-1">or ${(parseInt(tier.price.replace('$', '').replace(',', '')) * 10.2).toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr (save 15%)</div>}
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {tier.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-sm">
                  <Check size={14} className={`shrink-0 mt-0.5 ${tier.popular ? 'text-ibm-blue-light' : 'text-success'}`} />
                  <span className="text-muted leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => openModal(tier)}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01] ${
                tier.popular
                  ? 'bg-ibm-blue hover:bg-ibm-blue-hover text-white shadow-glow-blue-sm'
                  : 'bg-surface-2 hover:bg-surface-3 border border-border hover:border-ibm-blue/40 text-white'
              }`}
            >
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted mb-20 text-center">
        <span>✓ SOC 2 Type II</span>
        <span>✓ 30-day money-back guarantee</span>
        <span>✓ No credit card for trial</span>
        <span>✓ Cancel anytime (month-to-month)</span>
        <span>✓ 99.9% uptime SLA (Enterprise)</span>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
        <div className="bg-surface border border-border rounded-2xl px-6 divide-y divide-border">
          {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} />)}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-20 text-center bg-gradient-to-br from-surface-2 via-ibm-blue-dim to-surface-2 border border-ibm-blue/20 rounded-2xl p-10">
        <h2 className="text-3xl font-bold mb-3">Ready to stop syncing manually?</h2>
        <p className="text-muted mb-6 max-w-md mx-auto">Join manufacturing teams that have already eliminated manual quote reconciliation. Start your free trial — no credit card, no commitments.</p>
        <button
          onClick={() => openModal(TIERS[1])}
          className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-bold px-8 py-4 rounded-xl shadow-glow-blue hover:scale-105 transition-all"
        >
          <Zap size={18} className="fill-white" />
          Start Free Trial — Growth Plan
        </button>
        <p className="text-xs text-muted mt-3">14 days free · 2,000 quotes/month · Slack support included</p>
      </div>

      {/* Purchase modal */}
      <AnimatePresence>
        {selectedTier && (
          <PurchaseModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

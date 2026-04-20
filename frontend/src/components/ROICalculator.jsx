import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, TrendingUp, DollarSign, Clock, Percent, CheckCircle } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = Date.now();
    const from = prev.current;
    prev.current = target;
    const diff = target - from;
    if (diff === 0) return;
    const step = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + eased * diff));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function Slider({ label, value, min, max, step = 1, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-white">{label}</label>
        <span className="text-ibm-blue-light font-semibold text-sm font-mono">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ background: `linear-gradient(to right, #0F62FE ${pct}%, #2A2A3E ${pct}%)` }}
      />
      <div className="flex justify-between text-xs text-muted">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function OutputCard({ icon: Icon, label, value, sub, highlight }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? 'border-ibm-blue bg-ibm-blue-dim' : 'border-border bg-surface-2'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${highlight ? 'bg-ibm-blue/30' : 'bg-surface-3'}`}>
        <Icon size={16} className={highlight ? 'text-ibm-blue-light' : 'text-muted'} />
      </div>
      <div className={`text-2xl font-bold font-mono mb-0.5 ${highlight ? 'text-white' : 'text-ibm-blue-light'}`}>{value}</div>
      <div className="text-sm font-medium">{label}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}

const ANNUAL_CONTRACT = 26000;

export default function ROICalculator() {
  const [inputs, setInputs] = useState({
    quotesPerMonth: 200,
    hoursPerWeek: 5,
    hourlyRate: 65,
    errorRate: 12,
    avgDealSize: 18000,
    staffCount: 3,
  });

  const [emailModal, setEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { trackEvent } = useEventTracking();

  const calc = useMemo(() => {
    const annualHoursSaved  = inputs.hoursPerWeek * 52;
    const laborSaved        = annualHoursSaved * inputs.hourlyRate * inputs.staffCount;
    const revenueRecovered  = inputs.quotesPerMonth * inputs.avgDealSize * (inputs.errorRate / 100) * 0.4 * 12;
    const totalValue        = laborSaved + revenueRecovered;
    const paybackMonths     = totalValue > 0 ? (ANNUAL_CONTRACT / totalValue) * 12 : 0;
    const roi               = totalValue > 0 ? ((totalValue - ANNUAL_CONTRACT) / ANNUAL_CONTRACT) * 100 : 0;
    return { annualHoursSaved, laborSaved: Math.round(laborSaved), revenueRecovered: Math.round(revenueRecovered), totalValue: Math.round(totalValue), paybackMonths: Math.round(paybackMonths * 10) / 10, roi: Math.round(roi) };
  }, [inputs]);

  useEffect(() => {
    const t = setTimeout(() => {
      trackEvent('roi_calculated', { inputs, result: calc });
    }, 800);
    return () => clearTimeout(t);
  }, [calc]);

  function set(key) { return v => setInputs(p => ({ ...p, [key]: v })); }
  function fmt$n(v) { return `$${v.toLocaleString()}`; }
  function fmtPct(v) { return `${v}%`; }

  const animHours    = useCountUp(calc.annualHoursSaved);
  const animLabor    = useCountUp(calc.laborSaved);
  const animRevenue  = useCountUp(calc.revenueRecovered);
  const animTotal    = useCountUp(calc.totalValue);
  const animRoi      = useCountUp(calc.roi);

  async function handleEmailSubmit() {
    if (!email.includes('@')) return;
    try {
      await fetch('/api/roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, inputs, result: calc }),
      });
    } catch { /* non-critical */ }
    setSubmitted(true);
    setEmailModal(false);
    trackEvent('cta_click', { cta: 'roi_email_report', email_provided: true });
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-block text-xs font-semibold text-ibm-blue bg-ibm-blue-dim px-3 py-1 rounded-full mb-4">STAGE 5 — ROI CALCULATOR</div>
        <h2 className="text-4xl font-bold mb-3">What's manual quote sync actually costing you?</h2>
        <p className="text-muted max-w-xl mx-auto">Adjust the sliders to match your environment. The calculator updates instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-7">
          <h3 className="font-semibold text-lg">Your Environment</h3>

          <Slider label="Quotes managed per month" value={inputs.quotesPerMonth} min={10} max={2000} step={10} onChange={set('quotesPerMonth')} format={v => v.toLocaleString()} />
          <Slider label="Hours spent on manual sync per week" value={inputs.hoursPerWeek} min={1} max={40} onChange={set('hoursPerWeek')} format={v => `${v}h`} />
          <Slider label="Average hourly cost of ops staff" value={inputs.hourlyRate} min={30} max={150} step={5} onChange={set('hourlyRate')} format={fmt$n} />
          <Slider label="% of deals delayed due to pricing errors" value={inputs.errorRate} min={1} max={40} onChange={set('errorRate')} format={fmtPct} />
          <Slider label="Average deal size" value={inputs.avgDealSize} min={1000} max={150000} step={1000} onChange={set('avgDealSize')} format={fmt$n} />
          <Slider label="Sales ops staff touching quotes" value={inputs.staffCount} min={1} max={20} onChange={set('staffCount')} format={v => `${v} people`} />
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Your Annual Impact</h3>

          <div className="grid grid-cols-2 gap-3">
            <OutputCard
              icon={Clock} label="Hours saved / year"
              value={animHours.toLocaleString()}
              sub={`${inputs.hoursPerWeek} hrs/wk × 52 weeks × ${inputs.staffCount} staff`}
            />
            <OutputCard
              icon={DollarSign} label="Labor cost saved"
              value={`$${animLabor.toLocaleString()}`}
              sub="Based on your hourly rate"
            />
            <OutputCard
              icon={TrendingUp} label="Revenue recovered"
              value={`$${animRevenue.toLocaleString()}`}
              sub="From reduced pricing errors (40% recovery rate)"
            />
            <OutputCard
              icon={Percent} label="ROI"
              value={`${animRoi}%`}
              sub={`vs. $${(ANNUAL_CONTRACT / 1000).toFixed(0)}K/yr QuoteSync contract`}
            />
          </div>

          <OutputCard
            icon={TrendingUp} label="Total annual value"
            value={`$${animTotal.toLocaleString()}`}
            sub={`Payback period: ~${calc.paybackMonths} months`}
            highlight
          />

          {/* Payback visualization */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex justify-between text-xs text-muted mb-2">
              <span>Break-even point</span>
              <span>{calc.paybackMonths} months</span>
            </div>
            <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-ibm-blue rounded-full"
                animate={{ width: `${Math.min((calc.paybackMonths / 12) * 100, 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted mt-1.5">
              <span>Month 0</span>
              <span className="text-ibm-blue font-medium">Month {calc.paybackMonths}</span>
              <span>Month 12</span>
            </div>
          </div>

          {submitted ? (
            <div className="flex items-center gap-2 p-4 bg-success-dim border border-success/30 rounded-xl text-success text-sm">
              <CheckCircle size={16} />
              Report saved! We'll send it to {email} shortly.
            </div>
          ) : (
            <button
              onClick={() => setEmailModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.01] shadow-glow-blue-sm"
            >
              <Mail size={16} />
              Email Me This Report
            </button>
          )}
        </div>
      </div>

      {/* Email modal */}
      {emailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="font-bold text-lg mb-1">Email ROI Report</h3>
            <p className="text-muted text-sm mb-5">We'll send a summary of your ROI calculation with our assessment of your QuoteSync fit.</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
              placeholder="you@company.com"
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors mb-3"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setEmailModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm text-muted hover:text-white hover:border-border-bright transition-colors">Cancel</button>
              <button onClick={handleEmailSubmit} className="flex-1 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">Send Report</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

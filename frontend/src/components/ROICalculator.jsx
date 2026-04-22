import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

function useCountUp(target, duration = 1000) {
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
    <div className="px-4 py-4 border-b border-border last:border-b-0">
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-xs text-muted font-light">{label}</label>
        <span className="font-mono font-semibold text-sm text-ibm-blue-light">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ background: `linear-gradient(to right, #0F62FE ${pct}%, rgba(255,255,255,0.12) ${pct}%)` }}
      />
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
    const rawTotal          = laborSaved + revenueRecovered;
    const totalValue        = Math.min(rawTotal, 400000);
    const paybackMonths     = totalValue > 0 ? (ANNUAL_CONTRACT / totalValue) * 12 : 0;
    const roi               = totalValue > 0 ? ((totalValue - ANNUAL_CONTRACT) / ANNUAL_CONTRACT) * 100 : 0;
    return {
      annualHoursSaved,
      laborSaved: Math.round(Math.min(laborSaved, 200000)),
      revenueRecovered: Math.round(Math.min(revenueRecovered, 200000)),
      totalValue: Math.round(totalValue),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      roi: Math.round(roi),
      capped: rawTotal > 400000,
    };
  }, [inputs]);

  useEffect(() => {
    const t = setTimeout(() => trackEvent('roi_calculated', { inputs, result: calc }), 800);
    return () => clearTimeout(t);
  }, [calc]);

  function set(key) { return v => setInputs(p => ({ ...p, [key]: v })); }
  function fmt$n(v) { return `$${v.toLocaleString()}`; }
  function fmtPct(v) { return `${v}%`; }

  const animHours   = useCountUp(calc.annualHoursSaved);
  const animLabor   = useCountUp(calc.laborSaved);
  const animRevenue = useCountUp(calc.revenueRecovered);
  const animTotal   = useCountUp(calc.totalValue);
  const animRoi     = useCountUp(calc.roi);

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

  const OUTPUT_ROWS = [
    { label: 'Hours saved / year', value: `${animHours.toLocaleString()} hrs`, sub: `${inputs.hoursPerWeek} h/wk × 52 × ${inputs.staffCount} staff` },
    { label: 'Labor cost saved', value: `$${animLabor.toLocaleString()}`, sub: `at $${inputs.hourlyRate}/hr` },
    { label: 'Revenue recovered', value: `$${animRevenue.toLocaleString()}`, sub: '40% recovery on pricing errors' },
    { label: 'ROI vs contract cost', value: `${animRoi}%`, sub: `vs. $${(ANNUAL_CONTRACT / 1000).toFixed(0)}K/yr contract` },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-10">
        <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">ROI Calculator</div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">What's manual quote reconciliation actually costing you?</h2>
        <p className="text-muted font-light max-w-xl mb-2">Adjust the inputs to match your environment. Results update instantly.</p>
        <p className="text-xs text-dim font-light">Defaults based on typical teams managing 200+ quotes/month. Results are estimates — your actual ROI is scoped with real data after onboarding.</p>
      </div>

      <div className="grid lg:grid-cols-2 border border-border">

        {/* Inputs */}
        <div className="border-r border-border">
          <div className="px-4 py-2 border-b border-border bg-surface">
            <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Your Environment</span>
          </div>
          <Slider label="Quotes managed per month" value={inputs.quotesPerMonth} min={10} max={2000} step={10} onChange={set('quotesPerMonth')} format={v => v.toLocaleString()} />
          <Slider label="Hours spent on manual price reconciliation per week" value={inputs.hoursPerWeek} min={1} max={40} onChange={set('hoursPerWeek')} format={v => `${v}h`} />
          <Slider label="Average hourly cost of ops staff" value={inputs.hourlyRate} min={30} max={150} step={5} onChange={set('hourlyRate')} format={fmt$n} />
          <Slider label="% of deals delayed due to pricing errors" value={inputs.errorRate} min={1} max={40} onChange={set('errorRate')} format={fmtPct} />
          <Slider label="Average deal size" value={inputs.avgDealSize} min={1000} max={150000} step={1000} onChange={set('avgDealSize')} format={fmt$n} />
          <Slider label="Sales ops staff touching quotes" value={inputs.staffCount} min={1} max={20} onChange={set('staffCount')} format={v => `${v} people`} />
        </div>

        {/* Outputs */}
        <div>
          <div className="px-4 py-2 border-b border-border bg-surface">
            <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Your Annual Impact</span>
          </div>

          {OUTPUT_ROWS.map((row, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div>
                <div className="text-xs text-muted font-light">{row.label}</div>
                <div className="text-[10px] text-dim font-light mt-0.5">{row.sub}</div>
              </div>
              <span className="font-mono font-semibold text-lg text-ibm-blue-light">{row.value}</span>
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-ibm-blue/5">
            <div>
              <div className="text-sm font-semibold">Total annual value</div>
              <div className="text-[10px] text-muted font-light mt-0.5">Break-even: ~{calc.paybackMonths} months</div>
              {calc.capped && (
                <div className="text-[10px] text-dim font-light mt-0.5">Capped at typical mid-market range ($150K–$400K)</div>
              )}
            </div>
            <span className="font-mono font-bold text-2xl text-white">${animTotal.toLocaleString()}</span>
          </div>

          {/* Payback bar */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex justify-between text-[10px] font-mono text-muted mb-1.5">
              <span>Break-even</span>
              <span>Month {calc.paybackMonths}</span>
            </div>
            <div className="h-0.5 bg-surface-3">
              <motion.div
                className="h-full bg-ibm-blue"
                animate={{ width: `${Math.min((calc.paybackMonths / 12) * 100, 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-dim mt-1">
              <span>Month 0</span>
              <span>Month 12</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[10px] text-dim font-light">Based on typical mid-market teams. Results vary by stack and error rate. Exact ROI scoped with your data after onboarding.</p>
          </div>

          {/* Email CTA */}
          <div className="px-4 py-4">
            {submitted ? (
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle size={14} />
                <span className="font-light">Report sent to {email}</span>
              </div>
            ) : (
              <button
                onClick={() => setEmailModal(true)}
                className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-5 py-2.5 text-sm transition-colors"
              >
                <Mail size={14} />
                Email Me This Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Email modal */}
      {emailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEmailModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-semibold text-base mb-1">Email ROI Report</h3>
            <p className="text-muted text-sm font-light mb-5">We'll send your ROI summary with a QuoteGuard fit assessment.</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
              placeholder="you@company.com"
              className="w-full bg-surface-2 border border-border px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors mb-3 font-light"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setEmailModal(false)} className="flex-1 py-2.5 border border-border text-sm text-muted hover:text-white hover:border-border-bright transition-colors">Cancel</button>
              <button onClick={handleEmailSubmit} className="flex-1 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold py-2.5 transition-colors text-sm">Send Report</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

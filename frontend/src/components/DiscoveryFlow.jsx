import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, User, AlertCircle, BarChart2, Database } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const ROLES = [
  'VP of Sales', 'CRO', 'Director of Sales Ops', 'RevOps Manager',
  'Pricing Manager', 'Director of IT', 'CIO', 'Other'
];

const PAINS = [
  { id: 'manual_sync',     label: 'Manual quote-to-price-list sync' },
  { id: 'erp_mismatch',   label: 'ERP misalignment on active quotes' },
  { id: 'pricing_errors',  label: 'Pricing errors causing deal disputes' },
  { id: 'slow_turnaround', label: 'Slow quote turnaround times' },
  { id: 'waiting_on_ops',  label: 'Sales team waiting on ops for updates' },
];

const SYSTEMS = [
  { id: 'sap',        label: 'SAP' },
  { id: 'sfdc_cpq',   label: 'Salesforce CPQ' },
  { id: 'oracle',     label: 'Oracle ERP' },
  { id: 'hubspot',    label: 'HubSpot' },
  { id: 'dynamics',   label: 'Microsoft Dynamics' },
  { id: 'custom_erp', label: 'Custom / Other ERP' },
  { id: 'custom_cpq', label: 'Custom / Other CPQ' },
];

function PersonalizedHeadline({ answers }) {
  const systems = answers.systems || [];
  const systemNames = systems
    .filter(s => ['sap', 'sfdc_cpq', 'oracle', 'hubspot', 'dynamics'].includes(s))
    .map(s => ({ sap: 'SAP', sfdc_cpq: 'Salesforce CPQ', oracle: 'Oracle', hubspot: 'HubSpot', dynamics: 'Dynamics' }[s]));
  const role = answers.role || 'your team';
  const painLabel = PAINS.find(p => (answers.pains || []).includes(p.id))?.label?.toLowerCase();
  if (systemNames.length >= 2) {
    return `Here's how QuoteSync AI eliminates manual ${systemNames[0]} + ${systemNames[1]} sync for ${role.toLowerCase() === 'cro' ? 'your revenue team' : role}`;
  }
  if (systemNames.length === 1) {
    return `Here's how QuoteSync AI eliminates manual ${systemNames[0]} sync for ${role}`;
  }
  return `Here's how QuoteSync AI eliminates ${painLabel || 'manual quote sync'} for ${role.toLowerCase() === 'cro' ? 'your revenue team' : role}`;
}

const questions = [
  { id: 'role',    icon: User,        headline: "What's your primary role?",                         sub: "We'll tailor the demo to what matters most to you.", type: 'single', options: ROLES },
  { id: 'pains',   icon: AlertCircle, headline: "Which of these sound familiar?",                    sub: "Select everything that applies.",                    type: 'multi',  options: PAINS.map(p => p.label), optionIds: PAINS.map(p => p.id) },
  { id: 'volume',  icon: BarChart2,   headline: "How many active quotes do you manage per month?",    sub: "Drag the slider or pick a preset.",                  type: 'slider', min: 10, max: 5000, default: 200 },
  { id: 'systems', icon: Database,    headline: "Which systems are you using?",                       sub: "Select all that apply.",                             type: 'multi',  options: SYSTEMS.map(s => s.label), optionIds: SYSTEMS.map(s => s.id) },
];

export default function DiscoveryFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [sliderValue, setSliderValue] = useState(200);
  const { trackEvent } = useEventTracking();

  const q = questions[step];

  function canAdvance() {
    if (q.type === 'single') return !!answers[q.id];
    if (q.type === 'multi') return (answers[q.id] || []).length > 0;
    return true;
  }

  function handleSingle(option) { setAnswers(a => ({ ...a, [q.id]: option })); }

  function handleMulti(optionId) {
    setAnswers(a => {
      const cur = a[q.id] || [];
      return { ...a, [q.id]: cur.includes(optionId) ? cur.filter(x => x !== optionId) : [...cur, optionId] };
    });
  }

  function advance() {
    if (q.type === 'slider') setAnswers(a => ({ ...a, [q.id]: sliderValue }));
    setDirection(1);
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      const finalAnswers = { ...answers, volume: sliderValue };
      setCompleted(true);
      trackEvent('discovery_complete', { role: finalAnswers.role, pains: finalAnswers.pains, volume: finalAnswers.volume, systems: finalAnswers.systems });
      fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: `anon_${Date.now()}@quotesync.demo`, role: finalAnswers.role }) }).catch(() => {});
    }
  }

  const pct = (step / questions.length) * 100;

  if (completed) {
    return (
      <div className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Stage 2 — Your Fit</div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="w-9 h-9 bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-6">
              <Check size={18} className="text-success" />
            </div>
            <h2 className="text-3xl font-semibold mb-4 max-w-2xl mx-auto leading-tight">
              {PersonalizedHeadline({ answers })}
            </h2>
            <p className="text-muted font-light mb-8 max-w-lg mx-auto text-sm">
              Based on your answers, QuoteSync AI is a strong fit. See the live demo below — then request access to get your custom setup guide.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {answers.role && (
                <span className="border border-border bg-surface px-3 py-1.5 text-xs font-light">{answers.role}</span>
              )}
              {answers.volume && (
                <span className="border border-border bg-surface px-3 py-1.5 text-xs font-mono">{answers.volume.toLocaleString()} quotes/month</span>
              )}
              {(answers.systems || []).slice(0, 3).map(s => (
                <span key={s} className="border border-ibm-blue/30 bg-ibm-blue-dim text-ibm-blue-light px-3 py-1.5 text-xs font-light">
                  {SYSTEMS.find(sys => sys.id === s)?.label || s}
                </span>
              ))}
            </div>
            <a
              href="#stage-3"
              className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-6 py-3 transition-colors text-sm"
            >
              View Live Demo
              <ChevronRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-6 max-w-3xl mx-auto">
      <div className="mb-10">
        <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Stage 2 — Personalize</div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-3xl font-semibold leading-tight">Tell us your stack — we'll tailor what you see</h2>
          <a
            href="#stage-3"
            className="shrink-0 text-xs text-muted hover:text-white transition-colors underline underline-offset-2 pt-1"
          >
            Skip →
          </a>
        </div>
        <p className="text-muted font-light text-sm">4 questions. Takes 30 seconds. Skip anytime if you just want the demo.</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-[10px] font-mono text-muted mb-1.5">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-0.5 bg-surface-3">
          <motion.div className="h-full bg-ibm-blue" animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      {/* Question — no absolute positioning so content can grow freely */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
        >
          <div className="border border-border bg-surface">
            {/* Question header */}
            <div className="px-5 py-4 border-b border-border flex items-start gap-3">
              <div className="w-7 h-7 bg-ibm-blue-dim border border-ibm-blue/30 flex items-center justify-center shrink-0 mt-0.5">
                <q.icon size={14} className="text-ibm-blue" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-snug">{q.headline}</h3>
                <p className="text-muted text-xs font-light mt-0.5">{q.sub}</p>
              </div>
            </div>

            <div className="p-5">
              {q.type === 'single' && (
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleSingle(opt)}
                      className={`text-left px-4 py-3 border text-sm font-light transition-colors ${
                        answers[q.id] === opt
                          ? 'border-ibm-blue bg-ibm-blue-dim text-white'
                          : 'border-border bg-surface-2 text-muted hover:border-ibm-blue/30 hover:text-white'
                      }`}
                    >
                      {answers[q.id] === opt && <Check size={10} className="inline mr-1.5 text-ibm-blue" />}
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'multi' && (
                <div className="divide-y divide-border border border-border">
                  {q.options.map((opt, i) => {
                    const id = q.optionIds ? q.optionIds[i] : opt;
                    const selected = (answers[q.id] || []).includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => handleMulti(id)}
                        className={`w-full flex items-center gap-3 text-left px-4 py-3 text-sm font-light transition-colors ${
                          selected ? 'bg-ibm-blue/5 text-white' : 'text-muted hover:text-white hover:bg-surface-3'
                        }`}
                      >
                        <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                          selected ? 'bg-ibm-blue border-ibm-blue' : 'border-border-bright'
                        }`}>
                          {selected && <Check size={10} className="text-white" />}
                        </div>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'slider' && (
                <div className="space-y-5">
                  <div className="text-center">
                    <span className="font-mono font-bold text-4xl text-white">
                      {sliderValue >= 5000 ? '5,000+' : sliderValue.toLocaleString()}
                    </span>
                    <span className="text-muted font-light ml-2 text-base">quotes / month</span>
                  </div>
                  <input
                    type="range"
                    min={q.min}
                    max={q.max}
                    value={sliderValue}
                    onChange={e => setSliderValue(parseInt(e.target.value))}
                    className="w-full"
                    style={{ background: `linear-gradient(to right, #0F62FE ${((sliderValue - q.min) / (q.max - q.min)) * 100}%, rgba(255,255,255,0.12) ${((sliderValue - q.min) / (q.max - q.min)) * 100}%)` }}
                  />
                  <div className="flex gap-2">
                    {[50, 200, 500].map(v => (
                      <button
                        key={v}
                        onClick={() => setSliderValue(v)}
                        className={`flex-1 py-2 text-sm font-mono font-medium border transition-colors ${
                          sliderValue === v ? 'border-ibm-blue bg-ibm-blue-dim text-white' : 'border-border text-muted hover:border-ibm-blue/30 hover:text-white'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex justify-between items-center mt-5">
        <button
          onClick={() => { setDirection(-1); setStep(s => Math.max(0, s - 1)); }}
          disabled={step === 0}
          className="px-5 py-2.5 border border-border text-sm font-light text-muted hover:text-white hover:border-border-bright transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={advance}
          disabled={!canAdvance()}
          className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 transition-colors text-sm"
        >
          {step === questions.length - 1 ? 'Show My Demo' : 'Next'}
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

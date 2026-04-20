import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, User, AlertCircle, BarChart2, Database } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const ROLES = [
  'VP of Sales', 'CRO', 'Director of Sales Ops', 'RevOps Manager',
  'Pricing Manager', 'Director of IT', 'CIO', 'Other'
];

const PAINS = [
  { id: 'manual_sync',    label: 'Manual quote-to-price-list sync' },
  { id: 'erp_mismatch',  label: 'ERP misalignment on active quotes' },
  { id: 'pricing_errors', label: 'Pricing errors causing deal disputes' },
  { id: 'slow_turnaround', label: 'Slow quote turnaround times' },
  { id: 'waiting_on_ops', label: 'Sales team waiting on ops for updates' },
];

const SYSTEMS = [
  { id: 'sap',       label: 'SAP' },
  { id: 'sfdc_cpq',  label: 'Salesforce CPQ' },
  { id: 'oracle',    label: 'Oracle ERP' },
  { id: 'hubspot',   label: 'HubSpot' },
  { id: 'dynamics',  label: 'Microsoft Dynamics' },
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

  let headline = `Here's how QuoteSync AI eliminates ${painLabel || 'manual quote sync'} for ${role.toLowerCase() === 'other' ? 'your team' : role.toLowerCase() === 'cro' ? 'your revenue team' : role.toLowerCase()}`;

  if (systemNames.length >= 2) {
    headline = `Here's how QuoteSync AI eliminates manual ${systemNames[0]} + ${systemNames[1]} sync for ${role.toLowerCase() === 'cro' ? 'your revenue team' : role}`;
  } else if (systemNames.length === 1) {
    headline = `Here's how QuoteSync AI eliminates manual ${systemNames[0]} sync for ${role}`;
  }

  return headline;
}

const questions = [
  {
    id: 'role',
    icon: User,
    headline: "What's your primary role?",
    sub: "We'll tailor the demo to what matters most to you.",
    type: 'single',
    options: ROLES,
  },
  {
    id: 'pains',
    icon: AlertCircle,
    headline: "Which of these sound familiar?",
    sub: "Select everything that applies to your current situation.",
    type: 'multi',
    options: PAINS.map(p => p.label),
    optionIds: PAINS.map(p => p.id),
  },
  {
    id: 'volume',
    icon: BarChart2,
    headline: "How many active quotes does your team manage per month?",
    sub: "Drag the slider or type a number.",
    type: 'slider',
    min: 10,
    max: 5000,
    default: 200,
  },
  {
    id: 'systems',
    icon: Database,
    headline: "Which systems are you using?",
    sub: "Select all that apply — we support all common ERP and CPQ platforms.",
    type: 'multi',
    options: SYSTEMS.map(s => s.label),
    optionIds: SYSTEMS.map(s => s.id),
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

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
    if (q.type === 'slider') return true;
    return false;
  }

  function handleSingle(option) {
    setAnswers(a => ({ ...a, [q.id]: option }));
  }

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
      handleComplete();
    }
  }

  function handleComplete() {
    const finalAnswers = { ...answers, volume: sliderValue };
    setCompleted(true);
    trackEvent('discovery_complete', {
      role: finalAnswers.role,
      pains: finalAnswers.pains,
      volume: finalAnswers.volume,
      systems: finalAnswers.systems,
    });

    // Save to backend
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `anon_${Date.now()}@quotesync.demo`, role: finalAnswers.role }),
    }).catch(() => {});
  }

  const progress = ((step) / questions.length) * 100;

  if (completed) {
    return (
      <div className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-semibold text-ibm-blue bg-ibm-blue-dim px-3 py-1 rounded-full mb-4">STAGE 2 — YOUR FIT</div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-14 h-14 bg-success-dim rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-success" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl mx-auto leading-tight">
              {PersonalizedHeadline({ answers })}
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Based on your answers, QuoteSync AI is a strong fit. Here's your personalized live demo — built around your systems and the problems you just described.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {answers.role && (
                <span className="bg-surface-2 border border-border px-4 py-2 rounded-full text-sm">
                  👤 {answers.role}
                </span>
              )}
              {answers.volume && (
                <span className="bg-surface-2 border border-border px-4 py-2 rounded-full text-sm">
                  📊 {answers.volume.toLocaleString()} quotes/month
                </span>
              )}
              {(answers.systems || []).slice(0, 3).map(s => (
                <span key={s} className="bg-ibm-blue-dim border border-ibm-blue/20 text-ibm-blue-light px-4 py-2 rounded-full text-sm">
                  {SYSTEMS.find(sys => sys.id === s)?.label || s}
                </span>
              ))}
            </div>
            <a
              href="#stage-3"
              className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-glow-blue"
            >
              View Your Personalized Demo
              <ChevronRight size={18} />
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-block text-xs font-semibold text-ibm-blue bg-ibm-blue-dim px-3 py-1 rounded-full mb-4">STAGE 2 — YOUR FIT</div>
        <h2 className="text-4xl font-bold mb-3">Is QuoteSync AI right for you?</h2>
        <p className="text-muted">Answer 4 quick questions and we'll personalize the demo to your exact stack.</p>
      </div>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ibm-blue rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="relative overflow-hidden" style={{ minHeight: 360 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <div className="bg-surface border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-ibm-blue-dim rounded-xl flex items-center justify-center">
                  <q.icon size={20} className="text-ibm-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{q.headline}</h3>
                  <p className="text-muted text-sm">{q.sub}</p>
                </div>
              </div>

              {/* Single select */}
              {q.type === 'single' && (
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleSingle(opt)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        answers[q.id] === opt
                          ? 'border-ibm-blue bg-ibm-blue-dim text-white'
                          : 'border-border bg-surface-2 text-muted hover:border-ibm-blue/40 hover:text-white'
                      }`}
                    >
                      {answers[q.id] === opt && <Check size={12} className="inline mr-1.5 text-ibm-blue" />}
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Multi select */}
              {q.type === 'multi' && (
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, i) => {
                    const id = q.optionIds ? q.optionIds[i] : opt;
                    const selected = (answers[q.id] || []).includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => handleMulti(id)}
                        className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                          selected
                            ? 'border-ibm-blue bg-ibm-blue-dim text-white'
                            : 'border-border bg-surface-2 text-muted hover:border-ibm-blue/40 hover:text-white'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          selected ? 'bg-ibm-blue border-ibm-blue' : 'border-border-bright'
                        }`}>
                          {selected && <Check size={12} className="text-white" />}
                        </div>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Slider */}
              {q.type === 'slider' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-5xl font-bold text-ibm-blue-light">
                      {sliderValue >= 5000 ? '5,000+' : sliderValue.toLocaleString()}
                    </span>
                    <span className="text-muted ml-2 text-lg">quotes / month</span>
                  </div>
                  <input
                    type="range"
                    min={q.min}
                    max={q.max}
                    value={sliderValue}
                    onChange={e => setSliderValue(parseInt(e.target.value))}
                    className="w-full accent-ibm-blue"
                    style={{ background: `linear-gradient(to right, #0F62FE ${((sliderValue - q.min) / (q.max - q.min)) * 100}%, #2A2A3E ${((sliderValue - q.min) / (q.max - q.min)) * 100}%)` }}
                  />
                  <div className="flex justify-between text-xs text-muted">
                    <span>10</span>
                    <span>1,000</span>
                    <span>5,000+</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[50, 200, 500].map(v => (
                      <button
                        key={v}
                        onClick={() => setSliderValue(v)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          sliderValue === v ? 'border-ibm-blue bg-ibm-blue-dim text-white' : 'border-border bg-surface-2 text-muted hover:border-ibm-blue/40'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => { setDirection(-1); setStep(s => Math.max(0, s - 1)); }}
          disabled={step === 0}
          className="px-5 py-2.5 border border-border rounded-xl text-sm text-muted hover:text-white hover:border-border-bright transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={advance}
          disabled={!canAdvance()}
          className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-7 py-2.5 rounded-xl transition-all hover:scale-105"
        >
          {step === questions.length - 1 ? 'Show My Demo' : 'Next'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

export default function Hero() {
  const { trackEvent } = useEventTracking();

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-12 px-6 bg-surface-2">
      <div className="w-full max-w-2xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2 border border-ibm-blue/30 bg-ibm-blue-dim px-3 py-1.5">
            <ShieldCheck size={11} className="text-ibm-blue shrink-0" />
            <span className="text-xs tracking-wide text-ibm-blue-light font-medium">IBM watsonx Orchestrate</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-tight mb-5"
        >
          <span className="font-semibold text-white">Your ERP has pricing rules.</span>
          <br />
          <span className="font-light text-white/60">Your customers ignore them.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-base font-light text-white/50 mb-10"
        >
          Extract, validate, and reconcile across any system — ERP, CPQ, or otherwise. Overnight, automatically, without templates.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <a
            href={import.meta.env.VITE_IBM_TRIAL_URL || 'https://www.ibm.com/products/watsonx-orchestrate/pricing'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { cta: 'start_trial', stage: 0 })}
            className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-7 py-3.5 transition-colors text-sm"
          >
            Start free trial
            <ChevronRight size={16} />
          </a>
          <a
            href="#why"
            onClick={() => trackEvent('cta_click', { cta: 'see_how', stage: 0 })}
            className="text-sm text-muted hover:text-white font-light transition-colors px-4 py-3.5"
          >
            See how it works →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          <span className="text-[10px] text-dim font-light mr-1">Connects to</span>
          {['SAP', 'Oracle ERP', 'MS Dynamics', 'NetSuite', 'Del Mia Works', 'Any REST/SOAP API'].map(s => (
            <span key={s} className="text-[10px] border border-border px-2 py-1 text-muted font-light">{s}</span>
          ))}
        </motion.div>

      </div>
    </div>
  );
}

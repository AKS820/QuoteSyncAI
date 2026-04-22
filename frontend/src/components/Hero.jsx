import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const DRIFT_TYPES = [
  'ERP pricing is stale from last quarter',
  'Tiered rules applied at wrong threshold',
  'MOQ violation not flagged on close',
  'Negotiated terms not reflected in ERP',
];

export default function Hero() {
  const { trackEvent } = useEventTracking();

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-12 px-6 bg-surface-2">
      <div className="w-full max-w-2xl mx-auto text-center">

        {/* IBM badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2 border border-ibm-blue/30 bg-ibm-blue-dim px-3 py-1.5">
            <ShieldCheck size={11} className="text-ibm-blue shrink-0" />
            <span className="text-xs tracking-wide text-ibm-blue-light font-medium">Built on IBM watsonx — secure, enterprise-grade AI</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-tight mb-4"
        >
          <span className="font-semibold text-white">Your ERP is making pricing decisions</span>
          <br />
          <span className="font-light text-white/60">on outdated data.</span>
        </motion.h1>

        {/* ICP line */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="text-xs text-muted font-light tracking-wide mb-4"
        >
          For ops and RevOps teams at B2B manufacturers
        </motion.p>

        {/* Urgency */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-sm font-light text-white/50 mb-8"
        >
          Most teams don't find out until a deal closes wrong — or not at all.
        </motion.p>

        {/* Error rate stat */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.11 }}
          className="border-t border-b border-border py-5 mb-8"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="font-mono font-bold text-4xl text-white tracking-tight">3–8%</span>
            <div className="text-left">
              <p className="text-sm text-white/80 font-light leading-snug">of quotes contain pricing errors<br />against your own ERP rules</p>
              <p className="text-[10px] text-muted font-light mt-1">most are caught only after orders close — or never</p>
            </div>
          </div>
        </motion.div>

        {/* Drift type chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {DRIFT_TYPES.map(t => (
            <span key={t} className="text-[11px] border border-border px-2.5 py-1 text-muted font-light">{t}</span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <a
            href="#why"
            onClick={() => trackEvent('cta_click', { cta: 'see_why', stage: 0 })}
            className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-7 py-3.5 transition-colors text-sm"
          >
            See how this happens
            <ChevronRight size={16} />
          </a>
          <a
            href="#pricing"
            onClick={() => trackEvent('cta_click', { cta: 'see_pricing', stage: 0 })}
            className="flex items-center gap-2 border border-border hover:border-border-bright text-white font-light px-7 py-3.5 transition-colors text-sm"
          >
            See pricing
          </a>
        </motion.div>

        {/* Logos */}
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

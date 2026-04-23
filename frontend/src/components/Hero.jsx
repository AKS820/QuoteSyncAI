import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const IMPL_SUBJECT = 'Implementation help — Price List & Order Entry Agent';
const IMPL_BODY = `Hi Abhi,

I came across the QuoteGuard demo and I'm interested in learning more about implementing the Price List & Order Entry Agent for my team.

Our situation:
- ERP system: [SAP / Oracle / Dynamics 365 / Del Mia Works / Other]
- Monthly PO volume: [approximate number]
- Main challenge: [pricing validation / order entry errors / part cross-referencing / other]

[Add any additional context here]

---
[Your name]
[Company]
[Phone]`;

export default function Hero() {
  const { trackEvent } = useEventTracking();
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'abhi.surampudi@ibm.com';
  const implHelpHref = `mailto:${contactEmail}?subject=${encodeURIComponent(IMPL_SUBJECT)}&body=${encodeURIComponent(IMPL_BODY)}`;

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-12 px-6 bg-surface-2">
      <div className="w-full max-w-3xl mx-auto text-center">

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
          className="text-4xl sm:text-5xl lg:text-[2.75rem] leading-[1.08] tracking-tight mb-5"
        >
          <span className="font-semibold text-white">How many steps does it take</span>
          <br />
          <span className="font-light text-white/60">to process an order?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-base font-light text-white/50 mb-10"
        >
          Pricing lookups. ERP validation. Part number cross-referencing. Manual corrections. AI agents handle the entire flow — from order intake to ERP-ready in one coordinated run.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <a
            href={import.meta.env.VITE_IBM_TRIAL_URL || 'https://www.ibm.com/account/reg/us-en/signup?formid=urx-52753'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { cta: 'start_trial', stage: 0 })}
            className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-7 py-3.5 transition-colors text-sm"
          >
            Start free trial
            <ChevronRight size={16} />
          </a>
          <a
            href={implHelpHref}
            onClick={() => trackEvent('cta_click', { cta: 'implementation_help', stage: 0 })}
            className="text-sm text-muted hover:text-white font-light transition-colors px-4 py-3.5"
          >
            Work with our implementation partner →
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

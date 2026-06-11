import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const IMPL_MEETING_URL = 'https://meetings.salesloft.com/ibmdigitalsales/abhisurampudi';

export default function Hero() {
  const { trackEvent } = useEventTracking();

  return (
    <div
      className="min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-12 px-6 bg-surface-2"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L20 0 L40 20' fill='none' stroke='rgba(0,0,0,0.04)' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="w-full max-w-4xl mx-auto text-center">

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-5xl sm:text-6xl lg:text-[3.5rem] leading-[1.08] tracking-tight mb-6"
        >
          <span className="font-semibold text-[#161616]">Agentic Document Processing.</span>
          <br />
          <span className="font-light text-[#161616]/60">Built for manufacturing.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2 border border-ibm-blue/30 bg-ibm-blue-dim px-3 py-1.5">
            <ShieldCheck size={11} className="text-ibm-blue shrink-0" />
            <span className="text-xs tracking-wide text-ibm-blue font-medium">Powered by IBM watsonx Orchestrate</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <a
            href={IMPL_MEETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { cta: 'book_demo', stage: 0 })}
            className="flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-7 py-3.5 transition-colors text-sm"
          >
            Book a live demo
            <ChevronRight size={16} />
          </a>
          <a
            href={IMPL_MEETING_URL}
            onClick={() => trackEvent('cta_click', { cta: 'implementation_help', stage: 0 })}
            className="text-sm text-muted hover:text-[#161616] font-light transition-colors px-4 py-3.5"
          >
            Work with an implementation partner →
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

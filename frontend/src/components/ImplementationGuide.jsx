import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';

const SYSTEMS = ['SAP S/4HANA', 'Oracle ERP Cloud', 'Microsoft Dynamics 365', 'NetSuite', 'Salesforce CPQ', 'HubSpot CRM', 'DealHub', 'Conga CPQ'];

export default function ImplementationGuide() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="py-24 px-6 max-w-4xl mx-auto"
    >
      <div className="mb-10">
        <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-4">Stage 2 — Setup</div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-3 leading-tight">Connect in under an hour.</h2>
        <p className="text-muted font-light max-w-xl text-base">
          Read-only first. Nothing changes in your systems until you approve it.
        </p>
      </div>

      {/* Three steps */}
      <div className="border border-border mb-8">
        {[
          { n: 1, time: '~30 min', title: 'Your IT team generates API credentials', body: 'One read-only API key from your ERP, one from your CPQ. No server access, no firewall rules, no on-premise install. We send your IT team a one-page checklist.' },
          { n: 2, time: '~20 min', title: 'We connect and map your fields', body: 'Paste the credentials into QuoteGuard. We handle the connection and field mapping. Most customers use defaults with zero changes.' },
          { n: 3, time: '~10 min', title: 'Run a read-only detection dry run', body: 'We scan a subset of your active quotes. You see every error that would have shipped — before we touch anything live. Approve when ready.' },
        ].map(step => (
          <div key={step.n} className="flex gap-4 px-5 py-5 border-b border-border last:border-b-0">
            <div className="shrink-0 flex flex-col items-center gap-1">
              <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center text-white text-xs font-semibold font-mono">
                {step.n}
              </div>
              <span className="text-[10px] font-mono text-muted whitespace-nowrap">{step.time}</span>
            </div>
            <div>
              <div className="text-sm font-semibold mb-1">{step.title}</div>
              <div className="text-xs text-muted font-light leading-relaxed">{step.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border bg-surface px-4 py-3 flex items-center justify-between mb-8">
        <span className="text-sm text-muted font-light">Total estimated setup time</span>
        <span className="font-mono font-semibold text-white">~1 hour</span>
      </div>

      {/* Supported systems */}
      <div className="border border-border">
        <div className="px-4 py-2 border-b border-border bg-surface">
          <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Works with your stack</span>
        </div>
        <div className="flex flex-wrap gap-2 px-4 py-4">
          {SYSTEMS.map(s => (
            <span key={s} className="flex items-center gap-1.5 text-xs border border-border px-2.5 py-1.5 text-muted font-light">
              <Check size={10} className="text-success shrink-0" />
              {s}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-xs border border-border px-2.5 py-1.5 text-dim font-light">
            + any REST / SOAP API
          </span>
        </div>
      </div>
    </motion.div>
  );
}

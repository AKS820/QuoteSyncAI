import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

function AgentFlowSVG() {
  return (
    <svg viewBox="0 0 700 220" className="w-full max-w-2xl" aria-hidden="true">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0F62FE" stopOpacity="0" />
          <stop offset="50%" stopColor="#0F62FE" stopOpacity="1" />
          <stop offset="100%" stopColor="#0F62FE" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* SAP Node */}
      <rect x="20" y="75" width="140" height="70" rx="10" fill="#1A1A28" stroke="#2A2A3E" strokeWidth="1" />
      <rect x="20" y="75" width="140" height="4" rx="2" fill="#0F62FE" />
      <text x="90" y="115" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">SAP S/4HANA</text>
      <text x="90" y="132" textAnchor="middle" fill="#8B8BA7" fontSize="9">ERP Master Data</text>

      {/* QuoteSync Node (center) */}
      <rect x="280" y="65" width="140" height="90" rx="10" fill="#0F62FE" fillOpacity="0.1" stroke="#0F62FE" strokeWidth="1.5" filter="url(#glow)" />
      <rect x="280" y="65" width="140" height="4" rx="2" fill="#0F62FE" />
      <text x="350" y="107" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">QuoteSync AI</text>
      <text x="350" y="122" textAnchor="middle" fill="#4589FF" fontSize="9">3 Autonomous Agents</text>
      <text x="350" y="137" textAnchor="middle" fill="#8B8BA7" fontSize="8">Watching • Validating • Syncing</text>

      {/* CPQ Node */}
      <rect x="540" y="75" width="140" height="70" rx="10" fill="#1A1A28" stroke="#2A2A3E" strokeWidth="1" />
      <rect x="540" y="75" width="140" height="4" rx="2" fill="#0F62FE" />
      <text x="610" y="115" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">Salesforce CPQ</text>
      <text x="610" y="132" textAnchor="middle" fill="#8B8BA7" fontSize="9">Quote Management</text>

      {/* Animated connection lines */}
      <line x1="160" y1="110" x2="280" y2="110" stroke="#2A2A3E" strokeWidth="1.5" />
      <line x1="420" y1="110" x2="540" y2="110" stroke="#2A2A3E" strokeWidth="1.5" />

      <motion.circle
        cx="0" cy="110" r="4"
        fill="#0F62FE"
        filter="url(#glow)"
        animate={{ cx: [160, 280] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
      />
      <motion.circle
        cx="0" cy="110" r="4"
        fill="#0F62FE"
        filter="url(#glow)"
        animate={{ cx: [420, 540] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.circle
        cx="0" cy="110" r="3"
        fill="#24A148"
        filter="url(#glow)"
        animate={{ cx: [540, 420] }}
        transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut", delay: 1.4 }}
      />

      {/* Labels */}
      <text x="220" y="100" textAnchor="middle" fill="#8B8BA7" fontSize="8">price data</text>
      <text x="480" y="100" textAnchor="middle" fill="#8B8BA7" fontSize="8">corrections</text>
    </svg>
  );
}

export default function Hero() {
  const { trackEvent } = useEventTracking();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-12 overflow-hidden bg-gradient-hero">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-ibm-blue/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-ibm-blue-dim border border-ibm-blue/20 rounded-full px-4 py-1.5 text-ibm-blue-light text-sm font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 bg-ibm-blue rounded-full animate-pulse" />
          Now available for mid-market manufacturing
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          Your quotes are out of sync
          <br />
          <span className="text-gradient">with your ERP.</span>
          <br />
          <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white/70 mt-2 block">
            Every hour costs you deals.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          QuoteSync AI uses autonomous AI agents to keep your quoting system
          and ERP perfectly aligned — automatically. No manual reconciliation.
          No pricing errors. No lost deals.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <a
            href="#stage-1"
            onClick={() => trackEvent('cta_click', { cta: 'see_how_it_works', stage: 0 })}
            className="group flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-7 py-4 rounded-xl transition-all hover:scale-105 shadow-glow-blue"
          >
            See How It Works
            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#stage-3"
            onClick={() => trackEvent('cta_click', { cta: 'jump_to_demo', stage: 0 })}
            className="group flex items-center gap-2 bg-surface-2 hover:bg-surface-3 border border-border hover:border-ibm-blue/40 text-white font-semibold px-7 py-4 rounded-xl transition-all"
          >
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Jump to Live Demo
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Agent Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mb-14"
        >
          <AgentFlowSVG />
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-border pt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full" />
            Used by manufacturing teams managing 10,000+ SKUs
          </span>
          <span>|</span>
          <span>Average deployment: 3 weeks</span>
          <span>|</span>
          <span>$26K/yr replaces $85K+ of manual ops labor</span>
          <span>|</span>
          <span>SAP · Salesforce CPQ · Oracle · Dynamics</span>
        </motion.div>
      </div>
    </div>
  );
}

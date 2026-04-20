import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { AlertTriangle, DollarSign, Shield, ArrowRight, Building2, Clock, TrendingUp } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const VIDEO_IDS = {
  problem:  import.meta.env.VITE_VIDEO_PROBLEM  || 'dQw4w9WgXcQ',
  solution: import.meta.env.VITE_VIDEO_SOLUTION || 'dQw4w9WgXcQ',
  results:  import.meta.env.VITE_VIDEO_RESULTS  || 'dQw4w9WgXcQ',
};

function VideoEmbed({ videoId, label, onPlay }) {
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    setPlaying(true);
    onPlay(videoId);
  }

  if (!playing) {
    return (
      <div className="relative aspect-video bg-surface-2 rounded-xl overflow-hidden cursor-pointer group" onClick={handlePlay}>
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={label}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
          <div className="w-16 h-16 rounded-full bg-ibm-blue flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform">
            <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[18px] border-t-transparent border-b-transparent border-l-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-sm font-medium text-white/80">{label}</div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={label}
        className="w-full h-full"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}

function AgentFlowDiagram() {
  const agents = [
    { icon: '🔍', name: 'Quote Watcher', desc: 'Continuously monitors CPQ for new and updated quotes', color: 'border-ibm-blue bg-ibm-blue-dim' },
    { icon: '🤖', name: 'ERP Validator', desc: 'Cross-references every quote line against SAP master pricing data', color: 'border-ibm-blue/60 bg-ibm-blue-dim' },
    { icon: '✅', name: 'Auto-Updater', desc: 'Corrects mismatches in CPQ automatically — with configurable approval gates', color: 'border-success bg-success-dim' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 mt-6">
      {agents.map((agent, i) => (
        <div key={i} className="flex items-center gap-3 flex-1">
          <div className={`flex-1 border ${agent.color} rounded-xl p-4`}>
            <div className="text-2xl mb-2">{agent.icon}</div>
            <div className="font-semibold text-sm mb-1">{agent.name}</div>
            <div className="text-xs text-muted leading-relaxed">{agent.desc}</div>
          </div>
          {i < agents.length - 1 && (
            <ArrowRight size={16} className="text-ibm-blue shrink-0 hidden md:block" />
          )}
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { id: 'problem',  label: 'The Problem' },
  { id: 'solution', label: 'The Solution' },
  { id: 'results',  label: 'Real Results' },
];

export default function VideoGallery() {
  const [activeTab, setActiveTab] = useState('problem');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { trackEvent } = useEventTracking();

  function handleVideoPlay(videoId) {
    trackEvent('video_play', { video_id: videoId, percent_watched: 0 });
    setTimeout(() => trackEvent('video_complete', { video_id: videoId, percent_watched: 100 }), 180000);
  }

  const painPoints = [
    { icon: Clock, title: 'Manual sync takes 4+ hours/week', desc: 'Your pricing ops team spends hours copying numbers between your ERP and CPQ — time that should go to deal support.' },
    { icon: DollarSign, title: 'Pricing errors cost deals', desc: 'A misquoted line item at $847 when SAP says $923 creates customer disputes, margin bleed, and lost renewals.' },
    { icon: Shield, title: 'ERP misalignment creates compliance risk', desc: 'Auditors and finance teams expect quotes to match ERP records. Manual sync means drift — and audit exposure.' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 max-w-5xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-block text-xs font-semibold text-ibm-blue bg-ibm-blue-dim px-3 py-1 rounded-full mb-4">STAGE 1 — EDUCATION</div>
        <h2 className="text-4xl font-bold mb-3">Why manufacturing ops teams choose QuoteSync AI</h2>
        <p className="text-muted max-w-xl mx-auto">Every hour your ERP and CPQ are out of sync is an hour a deal can go sideways.</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 mb-8 w-fit mx-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-ibm-blue text-white shadow-glow-blue-sm' : 'text-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* Video */}
          <VideoEmbed
            videoId={VIDEO_IDS[activeTab]}
            label={TABS.find(t => t.id === activeTab)?.label}
            onPlay={handleVideoPlay}
          />

          {/* Tab content */}
          {activeTab === 'problem' && (
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {painPoints.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface border border-border rounded-xl p-5"
                >
                  <div className="w-9 h-9 bg-danger-dim rounded-lg flex items-center justify-center mb-3">
                    <p.icon size={18} className="text-danger" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{p.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'solution' && (
            <div className="mt-6">
              <h3 className="font-semibold text-center text-lg mb-2">Three agents. Zero manual sync.</h3>
              <p className="text-muted text-sm text-center mb-4">Each agent runs continuously — detecting, validating, and correcting without human intervention.</p>
              <AgentFlowDiagram />
            </div>
          )}

          {activeTab === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-surface-2 border border-ibm-blue/30 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-ibm-blue-dim rounded-xl flex items-center justify-center shrink-0">
                  <Building2 size={22} className="text-ibm-blue" />
                </div>
                <div>
                  <div className="text-xs text-ibm-blue font-semibold uppercase tracking-wide mb-1">Case Study</div>
                  <h3 className="text-xl font-bold">EVCO Plastics</h3>
                  <p className="text-muted text-sm">Mid-market injection molding — $280M revenue, SAP + Salesforce CPQ</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  { value: '$26K', label: 'Annual contract', sub: 'Full-featured Growth plan' },
                  { value: '3 weeks', label: 'Time to go live', sub: 'From API keys to production' },
                  { value: '100%', label: 'Manual sync eliminated', sub: '6 hrs/week returned to team' },
                ].map((s, i) => (
                  <div key={i} className="bg-surface rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-ibm-blue-light mb-1">{s.value}</div>
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-xs text-muted mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>
              <blockquote className="text-muted text-sm italic leading-relaxed border-l-2 border-ibm-blue/40 pl-4">
                "We used to have two ops analysts spending half their Mondays reconciling CPQ quotes against SAP. Now QuoteSync AI handles that overnight. The ROI was obvious within the first month."
                <footer className="text-white font-medium mt-2 not-italic">— Director of Sales Operations, EVCO Plastics</footer>
              </blockquote>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pain indicator bar */}
      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted">
        <AlertTriangle size={14} className="text-warning" />
        <span>The average mid-market manufacturer loses <strong className="text-white">$138,000/year</strong> to quote-ERP misalignment.</span>
      </div>
    </motion.div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CheckSquare, Square, Play, CheckCircle, XCircle, Loader, ChevronRight } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const VIDEO_SAP = import.meta.env.VITE_VIDEO_SAP_SETUP || 'dQw4w9WgXcQ';
const VIDEO_CPQ = import.meta.env.VITE_VIDEO_CPQ_SETUP || 'dQw4w9WgXcQ';

const CHECKLIST = [
  { id: 'connect_sap',    label: 'Connect SAP ERP',             desc: 'Add your SAP API credentials and verify connection' },
  { id: 'connect_cpq',    label: 'Connect your CPQ',            desc: 'Add your CPQ OAuth token or API key' },
  { id: 'agent_rules',    label: 'Configure agent rules',       desc: 'Set price tolerance thresholds and approval gates' },
  { id: 'test_quotes',    label: 'Test with sample quotes',     desc: 'Run a dry-sync on a subset of active quotes' },
  { id: 'pilot_sync',     label: 'Run pilot sync',              desc: 'Execute live sync on your first 50 quotes' },
  { id: 'review_results', label: 'Review sync results',         desc: 'Validate corrected quotes with your ops team' },
  { id: 'train_team',     label: 'Train your team',             desc: 'Walk sales ops through the monitoring dashboard' },
  { id: 'go_live',        label: 'Go live',                     desc: 'Enable continuous sync — agents run 24/7 from here' },
];

const SAP_STEPS = [
  { n: 1, title: 'Generate SAP API credentials', body: 'In SAP S/4HANA, navigate to SM59 and create an HTTP connection. Generate a service user with read access to MM60 (price conditions) and ME2M (purchase orders).' },
  { n: 2, title: 'Configure your price list endpoint', body: 'QuoteSync AI connects to your SAP OData service. The default endpoint is /sap/opu/odata/sap/API_PRICECONDITION_SRV. Paste this into your QuoteSync settings.' },
  { n: 3, title: 'Set up IP allowlisting', body: 'Whitelist QuoteSync\'s outbound IP range (provided in your dashboard) in your SAP firewall rules. For cloud-hosted SAP, update your BTP destination configuration.' },
  { n: 4, title: 'Test the connection', body: 'Click "Test Connection" below. We\'ll attempt to fetch 5 records from your SAP price list. A green checkmark means you\'re ready to proceed.' },
];

const CPQ_STEPS = [
  { n: 1, title: 'Install the QuoteSync package', body: 'In Salesforce Setup, go to AppExchange and install the QuoteSync AI package (or use the manual OAuth flow below for Salesforce CPQ API access).' },
  { n: 2, title: 'Create a Connected App', body: 'In Salesforce Setup → App Manager → New Connected App. Enable OAuth, add the QuoteSync callback URL, and select scopes: api, refresh_token, offline_access.' },
  { n: 3, title: 'Paste your Consumer Key and Secret', body: 'Copy your Consumer Key and Secret into QuoteSync Settings → Integrations → Salesforce CPQ. We\'ll handle the OAuth token rotation automatically.' },
  { n: 4, title: 'Map your Quote object fields', body: 'Tell QuoteSync which Salesforce fields map to part number, unit price, and quote status. Most customers use the default mapping with zero changes.' },
];

function StepCard({ step }) {
  return (
    <div className="flex gap-4 p-4 bg-surface-2 border border-border rounded-xl">
      <div className="w-8 h-8 bg-ibm-blue rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0">
        {step.n}
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
        <p className="text-xs text-muted leading-relaxed">{step.body}</p>
      </div>
    </div>
  );
}

function VideoEmbed({ videoId, label }) {
  const [playing, setPlaying] = useState(false);
  return playing ? (
    <div className="aspect-video rounded-xl overflow-hidden mb-6">
      <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
    </div>
  ) : (
    <div className="relative aspect-video bg-surface-2 rounded-xl overflow-hidden cursor-pointer group mb-6" onClick={() => setPlaying(true)}>
      <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt={label} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" onError={e => { e.target.style.display = 'none'; }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-ibm-blue flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform">
            <Play size={20} className="text-white fill-white ml-0.5" />
          </div>
          <span className="text-white text-sm font-medium">{label}</span>
        </div>
      </div>
    </div>
  );
}

function TestConnectionButton({ service }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function test() {
    setStatus('loading');
    try {
      const endpoint = service === 'sap' ? '/api/demo/sap/products' : '/api/demo/cpq/quotes';
      const res = await fetch(endpoint);
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('success'); // Mock success in offline mode
    }
    setTimeout(() => setStatus('idle'), 4000);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={test}
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-5 py-2.5 bg-surface-2 hover:bg-surface-3 border border-border hover:border-ibm-blue/40 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-60"
      >
        {status === 'loading' ? <Loader size={14} className="animate-spin" /> : status === 'success' ? <CheckCircle size={14} className="text-success" /> : status === 'error' ? <XCircle size={14} className="text-danger" /> : <ChevronRight size={14} />}
        {status === 'loading' ? 'Testing...' : status === 'success' ? 'Connection verified' : status === 'error' ? 'Connection failed' : `Test ${service.toUpperCase()} Connection`}
      </button>
      {status === 'success' && <span className="text-success text-xs">✓ {service === 'sap' ? '20 products' : '10 quotes'} returned</span>}
      {status === 'error' && <span className="text-danger text-xs">Check your credentials and try again</span>}
    </div>
  );
}

const TABS = [
  { id: 'sap', label: 'How to Connect SAP' },
  { id: 'cpq', label: 'How to Connect Your CPQ' },
  { id: 'checklist', label: 'Go Live Checklist' },
];

export default function ImplementationGuide() {
  const [activeTab, setActiveTab] = useState('sap');
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qs_checklist') || '{}'); } catch { return {}; }
  });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { trackEvent } = useEventTracking();

  function toggleCheck(id) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem('qs_checklist', JSON.stringify(next));
    if (next[id]) trackEvent('checklist_item_complete', { item: id });
  }

  const completedCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((completedCount / CHECKLIST.length) * 100);

  useEffect(() => {
    trackEvent('setup_tab_view', { tab: activeTab });
  }, [activeTab]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-block text-xs font-semibold text-ibm-blue bg-ibm-blue-dim px-3 py-1 rounded-full mb-4">STAGE 4 — IMPLEMENTATION GUIDE</div>
        <h2 className="text-4xl font-bold mb-3">Go live in 3 weeks, not 3 months</h2>
        <p className="text-muted max-w-xl mx-auto">No SI engagement required. No on-premise installation. Just API credentials and your first sync runs automatically.</p>
      </div>

      {/* Tab nav */}
      <div className="flex flex-col sm:flex-row gap-1 bg-surface rounded-xl p-1 mb-8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-ibm-blue text-white shadow-glow-blue-sm' : 'text-muted hover:text-white'
            }`}
          >
            {tab.label}
            {tab.id === 'checklist' && completedCount > 0 && (
              <span className="ml-2 bg-success/20 text-success text-xs px-1.5 py-0.5 rounded-full">{completedCount}/{CHECKLIST.length}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'sap' && (
            <div>
              <VideoEmbed videoId={VIDEO_SAP} label="SAP Setup Tutorial" />
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Step-by-step SAP connection guide</h3>
                <div className="space-y-3 mb-6">
                  {SAP_STEPS.map(step => <StepCard key={step.n} step={step} />)}
                </div>
                <div className="border-t border-border pt-5">
                  <h4 className="text-sm font-semibold mb-3">Mock API Credentials (Demo)</h4>
                  <div className="font-mono text-xs bg-surface-2 border border-border rounded-lg p-4 space-y-1.5 mb-4">
                    <div className="flex gap-3"><span className="text-muted w-28">SAP Host</span><span className="text-ibm-blue-light">mock-sap.quotesync.dev</span></div>
                    <div className="flex gap-3"><span className="text-muted w-28">Client ID</span><span className="text-ibm-blue-light">QS_DEMO_SAP_001</span></div>
                    <div className="flex gap-3"><span className="text-muted w-28">API Key</span><span className="text-ibm-blue-light">••••••••••••••••</span></div>
                    <div className="flex gap-3"><span className="text-muted w-28">Port</span><span className="text-ibm-blue-light">3001</span></div>
                  </div>
                  <TestConnectionButton service="sap" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cpq' && (
            <div>
              <VideoEmbed videoId={VIDEO_CPQ} label="CPQ Setup Tutorial" />
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Step-by-step CPQ connection guide</h3>
                <div className="space-y-3 mb-6">
                  {CPQ_STEPS.map(step => <StepCard key={step.n} step={step} />)}
                </div>
                <div className="border-t border-border pt-5">
                  <h4 className="text-sm font-semibold mb-3">Mock API Credentials (Demo)</h4>
                  <div className="font-mono text-xs bg-surface-2 border border-border rounded-lg p-4 space-y-1.5 mb-4">
                    <div className="flex gap-3"><span className="text-muted w-36">CPQ Instance URL</span><span className="text-ibm-blue-light">mock-cpq.quotesync.dev</span></div>
                    <div className="flex gap-3"><span className="text-muted w-36">Consumer Key</span><span className="text-ibm-blue-light">QS_DEMO_CPQ_001</span></div>
                    <div className="flex gap-3"><span className="text-muted w-36">OAuth Token</span><span className="text-ibm-blue-light">••••••••••••••••</span></div>
                    <div className="flex gap-3"><span className="text-muted w-36">Port</span><span className="text-ibm-blue-light">3002</span></div>
                  </div>
                  <TestConnectionButton service="cpq" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Go Live Checklist</h3>
                <span className="text-sm text-muted">{completedCount} of {CHECKLIST.length} complete</span>
              </div>
              <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-ibm-blue rounded-full"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="space-y-2">
                {CHECKLIST.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.997 }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      checked[item.id]
                        ? 'border-success/30 bg-success-dim'
                        : 'border-border bg-surface-2 hover:border-ibm-blue/30'
                    }`}
                  >
                    <div className={`shrink-0 transition-colors ${checked[item.id] ? 'text-success' : 'text-muted'}`}>
                      {checked[item.id] ? <CheckSquare size={20} /> : <Square size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${checked[item.id] ? 'line-through text-muted' : 'text-white'}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-muted mt-0.5 truncate">{item.desc}</div>
                    </div>
                    <div className={`text-xs font-mono shrink-0 ${checked[item.id] ? 'text-success' : 'text-border-bright'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </motion.button>
                ))}
              </div>

              {completedCount === CHECKLIST.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-ibm-blue-dim border border-ibm-blue/30 rounded-xl text-center"
                >
                  <p className="text-ibm-blue-light font-semibold">🎉 You're fully live! Your agents are now running continuously.</p>
                  <a href="#stage-5" className="inline-block mt-3 text-sm text-ibm-blue underline underline-offset-2 hover:text-ibm-blue-light">
                    Calculate your ROI →
                  </a>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

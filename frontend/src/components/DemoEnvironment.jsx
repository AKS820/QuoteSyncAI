import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Play, RefreshCw, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const VIDEO_DEMO = import.meta.env.VITE_VIDEO_DEMO || 'dQw4w9WgXcQ';

const AGENT_STEPS = [
  { icon: '🔍', text: 'Quote Watcher Agent scanning Salesforce CPQ for active quotes...', type: 'info',    delay: 0 },
  { icon: '📊', text: 'Loaded 10 active quotes across 9 customers. Analyzing line items...', type: 'info', delay: 1200 },
  { icon: '⚠️', text: 'Mismatch detected: Part #MFG-4421 — CPQ shows $847.00, SAP shows $923.00 (+$76)', type: 'warning', delay: 2400 },
  { icon: '⚠️', text: 'Mismatch detected: Part #MFG-7832 — CPQ shows $1,240.00, SAP shows $1,380.00 (+$140)', type: 'warning', delay: 3300 },
  { icon: '⚠️', text: 'Mismatch detected: Part #MFG-2209 — CPQ shows $456.00, SAP shows $512.00 (+$56)', type: 'warning', delay: 4000 },
  { icon: '🤖', text: 'ERP Validator Agent cross-referencing against SAP Material Master data...', type: 'info', delay: 4900 },
  { icon: '✓',  text: 'Validation complete. 3 mismatches confirmed. All flagged prices are below current SAP master.', type: 'info', delay: 5800 },
  { icon: '⚡', text: 'Auto-Updater Agent initiating corrective sync on 3 CPQ quotes...', type: 'info', delay: 6600 },
  { icon: '✅', text: 'Updated Quote #Q-2847 (Midwest Machining Co.) — MFG-4421: $847.00 → $923.00', type: 'success', delay: 7500 },
  { icon: '✅', text: 'Updated Quote #Q-2851 (Lake Shore Industries) — MFG-7832: $1,240.00 → $1,380.00', type: 'success', delay: 8400 },
  { icon: '✅', text: 'Updated Quote #Q-2863 (Precision Metalworks Group) — MFG-2209: $456.00 → $512.00', type: 'success', delay: 9200 },
  { icon: '📋', text: 'Sync complete. 10 quotes scanned, 3 updated, 0 errors. All CPQ data now matches SAP ERP.', type: 'complete', delay: 10100 },
];

function PriceTag({ value, highlight }) {
  return (
    <span className={`font-mono font-semibold ${highlight ? 'text-danger' : 'text-white'}`}>
      ${typeof value === 'number' ? value.toFixed(2) : value}
    </span>
  );
}

function QuoteRow({ quote, corrected }) {
  const hasMismatch = quote.mismatch && !corrected;
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border mb-2 transition-all duration-700 ${
      hasMismatch ? 'border-danger/40 bg-danger-dim' : 'border-border bg-surface-2'
    }`}>
      <div>
        <div className="text-xs font-semibold text-white">{quote.quote_id}</div>
        <div className="text-xs text-muted">{quote.customer}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className={`text-sm font-mono font-bold ${hasMismatch ? 'text-danger' : corrected ? 'text-success' : 'text-white'}`}>
            ${quote.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-xs ${hasMismatch ? 'text-danger/70' : 'text-muted'}`}>
            {hasMismatch ? '⚠ Price mismatch' : corrected ? '✓ Synced' : quote.status}
          </div>
        </div>
        {hasMismatch && <AlertTriangle size={14} className="text-danger shrink-0" />}
        {corrected && <CheckCircle size={14} className="text-success shrink-0" />}
      </div>
    </div>
  );
}

export default function DemoEnvironment() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [logs, setLogs] = useState([]);
  const [sapData, setSapData] = useState([]);
  const [cpqData, setCpqData] = useState([]);
  const [correctedQuotes, setCorrectedQuotes] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const logContainerRef = useRef(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { trackEvent } = useEventTracking();
  const timers = useRef([]);

  useEffect(() => {
    fetchInitialData();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  async function fetchInitialData() {
    setLoadingData(true);
    try {
      const [sapRes, cpqRes] = await Promise.all([
        fetch('/api/demo/sap/products'),
        fetch('/api/demo/cpq/quotes')
      ]);
      const sapJson = await sapRes.json();
      const cpqJson = await cpqRes.json();
      setSapData((sapJson.products || []).slice(0, 8));
      setCpqData(cpqJson.quotes || []);
    } catch {
      // Mock data fallback for when backend is not running
      setSapData([
        { part_number: 'MFG-4421', description: 'Servo Motor 400W', list_price: 923.00 },
        { part_number: 'MFG-7832', description: 'Encoder 1000PPR', list_price: 1380.00 },
        { part_number: 'MFG-2209', description: 'Compression Spring', list_price: 512.00 },
        { part_number: 'MFG-3301', description: 'Steel Gear Module', list_price: 612.00 },
        { part_number: 'MFG-1001', description: 'CNC Precision Shaft', list_price: 284.00 },
      ]);
      setCpqData([
        { quote_id: 'Q-2847', customer: 'Midwest Machining Co.', total: 4612.00, status: 'Draft', mismatch: true },
        { quote_id: 'Q-2848', customer: 'Great Lakes Fabrication', total: 4148.00, status: 'Sent', mismatch: false },
        { quote_id: 'Q-2851', customer: 'Lake Shore Industries', total: 5510.00, status: 'Draft', mismatch: true },
        { quote_id: 'Q-2852', customer: 'Summit Metal Works', total: 3807.00, status: 'Sent', mismatch: false },
        { quote_id: 'Q-2863', customer: 'Precision Metalworks', total: 4322.00, status: 'Draft', mismatch: true },
      ]);
    } finally {
      setLoadingData(false);
    }
  }

  function runAgents() {
    if (running) return;
    setRunning(true);
    setDone(false);
    setLogs([]);
    setCorrectedQuotes([]);
    trackEvent('demo_start', { scenario: 'sap_cpq_sync' });

    AGENT_STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        setLogs(prev => [...prev, { ...step, id: i }]);
        trackEvent('demo_action', { step: i, text: step.text.slice(0, 80), type: step.type });

        if (step.type === 'complete') {
          setDone(true);
          setRunning(false);
          setCorrectedQuotes(['Q-2847', 'Q-2851', 'Q-2863']);
          trackEvent('demo_complete', { quotes_fixed: 3, scenario: 'sap_cpq_sync' });
        }
      }, step.delay);
      timers.current.push(t);
    });
  }

  function resetDemo() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(false);
    setDone(false);
    setLogs([]);
    setCorrectedQuotes([]);
  }

  const logColors = { warning: 'text-warning', success: 'text-success', complete: 'text-ibm-blue', info: 'text-muted' };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="py-24 px-4 md:px-6 max-w-7xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-block text-xs font-semibold text-ibm-blue bg-ibm-blue-dim px-3 py-1 rounded-full mb-4">STAGE 3 — LIVE DEMO</div>
        <h2 className="text-4xl font-bold mb-3">See the agents work — live</h2>
        <p className="text-muted max-w-xl mx-auto">This is real mock data pulled from our SAP and CPQ services. Hit the button and watch the agents sync everything in under 10 seconds.</p>
      </div>

      {/* Run button */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={running ? undefined : done ? resetDemo : runAgents}
          disabled={running}
          className={`flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all text-lg ${
            running
              ? 'bg-surface-2 border border-border text-muted cursor-not-allowed'
              : done
              ? 'bg-surface-2 border border-border text-white hover:border-ibm-blue/40'
              : 'bg-ibm-blue hover:bg-ibm-blue-hover text-white shadow-glow-blue hover:scale-105'
          }`}
        >
          {running ? (
            <><RefreshCw size={20} className="animate-spin" /> Running Agents...</>
          ) : done ? (
            <><RefreshCw size={18} /> Run Again</>
          ) : (
            <><Zap size={20} className="fill-white" /> Run the Agents</>
          )}
        </button>
      </div>

      {/* Three-panel demo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">

        {/* LEFT: Before state */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Your Systems (Before)</h3>
            <span className="text-xs text-muted bg-surface-2 px-2 py-1 rounded-full">SAP + CPQ</span>
          </div>

          <div className="mb-4">
            <div className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">SAP Price List</div>
            {loadingData ? (
              <div className="text-muted text-xs animate-pulse">Loading SAP data...</div>
            ) : (
              <div className="space-y-1.5">
                {sapData.slice(0, 5).map(p => (
                  <div key={p.part_number} className="flex justify-between items-center py-1.5 border-b border-border/50 text-xs">
                    <span className="font-mono text-muted">{p.part_number}</span>
                    <span className="font-semibold">${p.list_price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
              CPQ Quotes
              {cpqData.filter(q => q.mismatch).length > 0 && (
                <span className="ml-2 text-danger">{cpqData.filter(q => q.mismatch).length} mismatches</span>
              )}
            </div>
            {loadingData ? (
              <div className="text-muted text-xs animate-pulse">Loading CPQ data...</div>
            ) : (
              cpqData.slice(0, 5).map(q => (
                <QuoteRow key={q.quote_id} quote={q} corrected={false} />
              ))
            )}
          </div>
        </div>

        {/* CENTER: Agent Activity Feed */}
        <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Agent Activity</h3>
            {running && <span className="flex items-center gap-1.5 text-xs text-success"><span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />Live</span>}
            {done && <span className="flex items-center gap-1.5 text-xs text-ibm-blue"><CheckCircle size={12} />Complete</span>}
          </div>

          <div ref={logContainerRef} className="flex-1 overflow-y-auto scrollbar-hide space-y-2 min-h-[320px] max-h-[400px] agent-log-scroll">
            {logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted text-center">
                <Zap size={32} className="mb-3 opacity-30" />
                <p className="text-sm">Click <strong className="text-white">Run the Agents</strong> to start the live sync</p>
              </div>
            )}
            <AnimatePresence>
              {logs.map(log => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 p-2.5 rounded-lg text-xs ${
                    log.type === 'warning' ? 'bg-warning-dim border border-warning/20' :
                    log.type === 'success' ? 'bg-success-dim border border-success/20' :
                    log.type === 'complete' ? 'bg-ibm-blue-dim border border-ibm-blue/20' :
                    'bg-surface-2 border border-border/50'
                  }`}
                >
                  <span className="text-base leading-tight shrink-0">{log.icon}</span>
                  <span className={`leading-relaxed ${logColors[log.type]}`}>{log.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-success-dim border border-success/30 rounded-xl text-center"
            >
              <p className="text-success font-semibold text-sm">✓ Sync complete in ~10 seconds</p>
              <p className="text-success/70 text-xs mt-0.5">3 quotes corrected, 0 errors</p>
            </motion.div>
          )}
        </div>

        {/* RIGHT: After state */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">After QuoteSync</h3>
            {correctedQuotes.length > 0 ? (
              <span className="text-xs text-success bg-success-dim border border-success/20 px-2 py-1 rounded-full">
                {correctedQuotes.length} fixed
              </span>
            ) : (
              <span className="text-xs text-muted bg-surface-2 px-2 py-1 rounded-full">Pending sync</span>
            )}
          </div>

          <div className="mb-4">
            <div className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">SAP Price List</div>
            <div className="space-y-1.5">
              {sapData.slice(0, 5).map(p => (
                <div key={p.part_number} className="flex justify-between items-center py-1.5 border-b border-border/50 text-xs">
                  <span className="font-mono text-muted">{p.part_number}</span>
                  <span className="font-semibold text-success">${p.list_price?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
              CPQ Quotes
              {correctedQuotes.length > 0 && <span className="ml-2 text-success">All synced ✓</span>}
            </div>
            {cpqData.slice(0, 5).map(q => (
              <QuoteRow
                key={q.quote_id}
                quote={correctedQuotes.length > 0 ? { ...q, mismatch: false } : q}
                corrected={correctedQuotes.includes(q.quote_id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats after demo */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: 'Quotes scanned', value: '10', icon: '📊' },
            { label: 'Mismatches found', value: '3', icon: '⚠️' },
            { label: 'Quotes corrected', value: '3', icon: '✅' },
            { label: 'Time elapsed', value: '~10s', icon: '⚡' },
          ].map((s, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-ibm-blue-light">{s.value}</div>
              <div className="text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Video walkthrough */}
      <div className="mt-10 bg-surface border border-border rounded-2xl p-6">
        <h3 className="font-semibold mb-1">Video Walkthrough</h3>
        <p className="text-muted text-sm mb-4">Watch a full product walkthrough with a real SAP + CPQ environment.</p>
        {!showVideo ? (
          <div
            className="relative aspect-video bg-surface-2 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setShowVideo(true)}
          >
            <img
              src={`https://img.youtube.com/vi/${VIDEO_DEMO}/maxresdefault.jpg`}
              alt="Demo walkthrough"
              className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-ibm-blue flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
                <span className="text-white font-medium text-sm">Full Product Walkthrough</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_DEMO}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

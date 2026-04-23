import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Zap, Calendar, CreditCard, MessageSquare, RefreshCw, Lock, ShieldCheck } from 'lucide-react';

const ADMIN_PASSWORD = 'quoteguard-admin';

const STAGE_LABELS = ['Overview', 'Why', 'Win Story'];

function MetricCard({ icon: Icon, label, value, sub, accent = false }) {
  return (
    <div className={`border border-border p-5 ${accent ? 'bg-ibm-blue/5 border-ibm-blue/30' : 'bg-surface'}`}>
      <div className="flex items-start justify-between mb-4">
        <Icon size={16} className={accent ? 'text-ibm-blue' : 'text-muted'} />
        {accent && <span className="w-1.5 h-1.5 bg-ibm-blue rounded-full animate-pulse-dot" />}
      </div>
      <div className="font-mono font-bold text-2xl text-white mb-0.5">{value}</div>
      <div className="text-xs font-medium text-white/80">{label}</div>
      {sub && <div className="text-[10px] text-muted font-light mt-1">{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-2 border border-border p-3 text-xs">
        <p className="font-medium mb-1 text-white">{label}</p>
        <p className="text-ibm-blue-light font-mono">{payload[0].value} visitors</p>
        {payload[1] && <p className="text-muted">{payload[1].value}% of total</p>}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [pwError, setPwError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/summary');
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetStats = useCallback(async () => {
    if (!window.confirm('Reset all analytics data to zero? This cannot be undone.')) return;
    try {
      await fetch('/api/analytics/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'quoteguard-admin' }),
      });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  }, [loadData]);

  useEffect(() => {
    if (!authed) return;
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [authed, loadData]);

  function handleAuth() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center px-4">
        <div className="bg-surface border border-border p-8 w-full max-w-sm">
          <div className="w-8 h-8 bg-ibm-blue flex items-center justify-center mb-6">
            <Lock size={14} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold mb-1">QuoteGuard Analytics</h1>
          <p className="text-muted text-xs font-light mb-6">Admin access only</p>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            placeholder="Password"
            className={`w-full bg-surface-2 border px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors mb-3 font-light ${pwError ? 'border-danger' : 'border-border'}`}
          />
          {pwError && <p className="text-[10px] text-danger font-light mb-3">Incorrect password</p>}
          <button
            onClick={handleAuth}
            className="w-full bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold py-3 transition-colors text-sm"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  const funnelData = (data?.stageFunnel || [])
    .filter(s => s.stage < STAGE_LABELS.length)
    .map(s => ({ stage: STAGE_LABELS[s.stage], users: s.users, pct: s.pct }));

  const tierData = Object.entries(data?.purchaseIntents?.byTier || {}).map(([tier, count]) => ({ tier, count }));

  return (
    <div className="min-h-screen bg-surface-2 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-ibm-blue flex items-center justify-center">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold">QuoteGuard — Analytics</h1>
              <p className="text-[10px] text-muted font-light font-mono mt-0.5">
                {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : 'Loading...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-3 py-2 bg-surface border border-border text-xs hover:border-ibm-blue transition-colors"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={resetStats}
              className="flex items-center gap-2 px-3 py-2 bg-surface border border-border text-xs hover:border-danger text-muted hover:text-danger transition-colors"
            >
              Reset stats
            </button>
          </div>
        </div>

        {!data ? (
          <div className="flex items-center justify-center h-64 text-muted text-sm">Loading analytics...</div>
        ) : (
          <>
            {/* Top metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 border border-border mb-8">
              {[
                { icon: Users,         label: 'Unique Visitors',    value: data.totalUsers,               sub: null,                                     accent: false },
                { icon: Zap,           label: 'Demo Opens',         value: data.demo.starts,              sub: null,                                     accent: true  },
                { icon: Calendar,      label: 'Meeting Requests',   value: data.meetingRequests,          sub: null,                                     accent: true  },
                { icon: CreditCard,    label: 'Quote Requests',     value: data.purchaseIntents.total,    sub: null,                                     accent: false },
                { icon: MessageSquare, label: 'Agent Questions',    value: data.agentQuestions.total,     sub: null,                                     accent: false },
              ].map((m, i) => (
                <div key={i} className={`border-r border-border last:border-r-0 ${i > 2 ? 'border-t border-t-border md:border-t-0' : ''}`}>
                  <MetricCard {...m} />
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border mb-8">
              {/* Funnel */}
              <div className="p-6 border-r border-border">
                <div className="text-[10px] tracking-label text-muted uppercase font-semibold mb-4">Buyer Journey Funnel</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={funnelData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="stage" tick={{ fill: '#8B8BA7', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#8B8BA7', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="users" radius={0}>
                      {funnelData.map((_, i) => (
                        <Cell key={i} fill={`rgba(15,98,254,${1 - i * 0.12})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Purchase intent by tier */}
              <div className="p-6">
                <div className="text-[10px] tracking-label text-muted uppercase font-semibold mb-4">Purchase Intent by Tier</div>
                {tierData.length === 0 ? (
                  <div className="text-muted text-xs h-48 flex items-center justify-center">No purchase intents yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={tierData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="tier" tick={{ fill: '#8B8BA7', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#8B8BA7', fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: '#13131C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 0 }} />
                      <Bar dataKey="count" fill="#24A148" radius={0} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* CTA clicks breakdown */}
            <div className="border border-border mb-8">
              <div className="px-4 py-2 border-b border-border bg-surface">
                <span className="text-[10px] tracking-label text-muted uppercase font-semibold">CTA Clicks</span>
              </div>
              <div className="divide-y divide-border">
                {Object.entries(data.ctaClicks?.byCta || {}).length === 0 ? (
                  <p className="text-muted text-xs font-light px-4 py-4">No CTA clicks yet</p>
                ) : Object.entries(data.ctaClicks.byCta)
                    .sort(([,a],[,b]) => b - a)
                    .map(([cta, count]) => (
                  <div key={cta} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-muted font-mono">{cta}</span>
                    <span className="font-mono font-semibold text-sm text-ibm-blue-light">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent agent questions */}
            <div className="border border-border">
              <div className="px-4 py-2 border-b border-border bg-surface">
                <span className="text-[10px] tracking-label text-muted uppercase font-semibold">Agent Questions</span>
              </div>
              <div className="divide-y divide-border">
                {data.agentQuestions.recent.length === 0 ? (
                  <p className="text-muted text-xs font-light px-4 py-4">No questions yet</p>
                ) : data.agentQuestions.recent.map((q, i) => (
                  <div key={i} className="flex gap-4 px-4 py-3">
                    <span className="text-ibm-blue text-[10px] font-mono shrink-0 mt-0.5">Q</span>
                    <div>
                      <p className="text-sm text-white/50 italic font-light">Question text not stored</p>
                      <p className="text-[10px] text-muted font-mono mt-0.5">{q.timestamp ? new Date(q.timestamp).toLocaleString() : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

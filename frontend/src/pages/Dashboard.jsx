import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Play, Zap, Calculator, CreditCard, MessageSquare, RefreshCw, Lock } from 'lucide-react';

const ADMIN_PASSWORD = 'quotesync-admin';

function MetricCard({ icon: Icon, label, value, sub, color = 'ibm-blue' }) {
  const colors = {
    'ibm-blue': 'text-ibm-blue',
    'success': 'text-success',
    'warning': 'text-warning',
    'purple': 'text-purple-400',
  };
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color === 'ibm-blue' ? 'bg-ibm-blue-dim' : color === 'success' ? 'bg-success-dim' : color === 'warning' ? 'bg-warning-dim' : 'bg-purple-400/10'}`}>
        <Icon size={18} className={colors[color]} />
      </div>
      <div className="text-2xl font-bold mb-0.5">{value}</div>
      <div className="text-sm font-medium text-white">{label}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-2 border border-border rounded-lg p-3 text-sm">
        <p className="font-medium mb-1">Stage {label}</p>
        <p className="text-ibm-blue">{payload[0].value} users ({payload[1]?.value}%)</p>
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

  const STAGE_LABELS = ['Overview', 'How It Works', 'Your Fit', 'Live Demo', 'Setup', 'ROI Calc', 'Pricing'];

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

  useEffect(() => {
    if (!authed) return;
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [authed, loadData]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#09090E] flex items-center justify-center">
        <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-sm">
          <div className="w-12 h-12 bg-ibm-blue-dim rounded-xl flex items-center justify-center mb-6">
            <Lock size={22} className="text-ibm-blue" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Analytics Dashboard</h1>
          <p className="text-muted text-sm mb-6">Enter admin password to continue</p>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pw === ADMIN_PASSWORD && setAuthed(true)}
            placeholder="Password"
            className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-ibm-blue transition-colors mb-3"
          />
          <button
            onClick={() => pw === ADMIN_PASSWORD ? setAuthed(true) : alert('Incorrect password')}
            className="w-full bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  const funnelData = data?.stageFunnel?.map(s => ({
    stage: STAGE_LABELS[s.stage] || `Stage ${s.stage}`,
    users: s.users,
    pct: s.pct
  })) || [];

  const tierData = Object.entries(data?.purchaseIntents?.byTier || {}).map(([tier, count]) => ({ tier, count }));
  const videoKeys = Object.keys(data?.videoStats || {});

  return (
    <div className="min-h-screen bg-[#09090E] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">QuoteSync AI — Analytics</h1>
            <p className="text-muted text-sm mt-1">
              {lastRefresh ? `Last updated ${lastRefresh.toLocaleTimeString()}` : 'Loading...'}
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm hover:border-ibm-blue transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {!data ? (
          <div className="flex items-center justify-center h-64 text-muted">Loading analytics...</div>
        ) : (
          <>
            {/* Top metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <MetricCard icon={Users} label="Unique Visitors" value={data.totalUsers} color="ibm-blue" />
              <MetricCard icon={Play} label="Demo Runs" value={data.demo.starts} sub={`${data.demo.completionRate}% completion`} color="success" />
              <MetricCard icon={Calculator} label="ROI Calcs" value={data.roi.totalCalculations} sub={`Avg ROI: ${data.roi.avgRoiPct}%`} color="warning" />
              <MetricCard icon={CreditCard} label="Purchase Intents" value={data.purchaseIntents.total} color="purple" />
              <MetricCard icon={MessageSquare} label="Agent Questions" value={data.agentQuestions.total} color="ibm-blue" />
              <MetricCard icon={Zap} label="Demo Complete" value={data.demo.completes} sub={`of ${data.demo.starts} started`} color="success" />
            </div>

            {/* Stage Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Buyer Journey Funnel</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={funnelData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
                    <XAxis dataKey="stage" tick={{ fill: '#8B8BA7', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#8B8BA7', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                      {funnelData.map((_, i) => (
                        <Cell key={i} fill={`rgba(15,98,254,${1 - i * 0.1})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Purchase Intent by Tier</h2>
                {tierData.length === 0 ? (
                  <div className="text-muted text-sm h-48 flex items-center justify-center">No purchase intents yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={tierData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
                      <XAxis dataKey="tier" tick={{ fill: '#8B8BA7', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#8B8BA7', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1A1A28', border: '1px solid #2A2A3E', borderRadius: 8 }} />
                      <Bar dataKey="count" fill="#24A148" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Video + Questions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Video Engagement</h2>
                <div className="space-y-3">
                  {videoKeys.length === 0 ? (
                    <p className="text-muted text-sm">No video plays yet</p>
                  ) : videoKeys.map(vid => {
                    const stats = data.videoStats[vid];
                    const rate = stats.plays > 0 ? Math.round((stats.completes / stats.plays) * 100) : 0;
                    return (
                      <div key={vid} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <div className="text-sm font-medium capitalize">{vid} video</div>
                          <div className="text-xs text-muted">{stats.plays} plays</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                            <div className="h-full bg-ibm-blue rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-sm text-ibm-blue font-medium w-10 text-right">{rate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Recent Agent Questions</h2>
                <div className="space-y-2">
                  {data.agentQuestions.recent.length === 0 ? (
                    <p className="text-muted text-sm">No questions yet</p>
                  ) : data.agentQuestions.recent.map((q, i) => (
                    <div key={i} className="flex gap-3 py-2 border-b border-border last:border-0">
                      <span className="text-ibm-blue text-xs mt-0.5 shrink-0">Q</span>
                      <div>
                        <p className="text-sm">{q.question || '—'}</p>
                        <p className="text-xs text-muted mt-0.5">{q.timestamp ? new Date(q.timestamp).toLocaleString() : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from 'recharts';
import { getMetrics, getLogs } from '../services/api.js';
import MetricsCard from '../components/MetricsCard.jsx';
import { Activity, RefreshCw, Cpu, Clock, Terminal, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const fetchData = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [mRes, lRes] = await Promise.all([getMetrics(), getLogs(20)]);
      setData(mRes.data);
      setLogs(lRes.data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the telemetry server. Is the backend running?");
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return (
    <div className="flex flex-col h-full items-center justify-center text-[var(--text-secondary)] text-sm font-mono space-y-4">
      <div className="flex items-center text-[#f87171]">
        <AlertCircle className="mr-2" size={18} />
        {error}
      </div>
      <button onClick={fetchData} className="px-4 py-2 bg-surface-200 hover:bg-surface-300 rounded-lg border border-surface-300 transition-colors flex items-center gap-2">
        <RefreshCw size={14} /> Retry Connection
      </button>
    </div>
  );

  if (!data) return (
    <div className="flex h-full items-center justify-center text-[var(--text-secondary)] text-sm font-mono">
      <RefreshCw className="animate-spin text-accent mr-2" size={16} />
      Fetching telemetry metrics...
    </div>
  );

  const { summary, latencyTrend, providerBreakdown } = data;

  return (
    <div className="h-full overflow-y-auto p-8 space-y-8 bg-surface">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-surface-300 pb-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">System Analytics</h1>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">Live Telemetry Ingestion Active</span>
          </div>
        </div>
        
        <button onClick={fetchData}
          disabled={refreshing}
          className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 transition-all border border-surface-300 bg-surface-100 hover:bg-surface-200 px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm">
          <RefreshCw size={13} className={refreshing ? "animate-spin text-accent" : "text-zinc-500"} />
          <span>{refreshing ? 'Syncing...' : 'Sync Traces'}</span>
        </button>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard label="Total Logged Traces" value={summary.totalRequests.toLocaleString()} />
        <MetricsCard label="Average LLM Latency" value={`${summary.avgLatencyMs}ms`} />
        <MetricsCard label="Exception Rate" value={`${summary.errorRate}%`} />
        <MetricsCard 
          label="Telemetry Tokens"
          value={(summary.totalPromptTokens + summary.totalCompletionTokens).toLocaleString()}
          sub={`${summary.totalPromptTokens.toLocaleString()} input / ${summary.totalCompletionTokens.toLocaleString()} completion`}
        />
      </div>

      {/* Real-time Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Chart */}
        <div className="bg-surface-100 border border-surface-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider">Inference Latency Trend</h2>
            <Clock size={14} className="text-zinc-500" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={latencyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-300)" opacity={0.15} />
              <XAxis dataKey="_id" tick={{ fontSize: 9, fill: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }} />
              <Tooltip 
                contentStyle={{ background: 'var(--surface-100)', border: '1px solid var(--surface-300)', borderRadius: '6px', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="avgLatency" stroke="var(--accent)" strokeWidth={2} dot={false} name="Latency (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Provider Breakdown Chart */}
        <div className="bg-surface-100 border border-surface-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider">Gateway Model Breakdown</h2>
            <Cpu size={14} className="text-zinc-500" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={providerBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-300)" opacity={0.15} />
              <XAxis dataKey="_id" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }} />
              <Tooltip 
                contentStyle={{ background: 'var(--surface-100)', border: '1px solid var(--surface-300)', borderRadius: '6px', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Inferences">
                {providerBreakdown.map((_, i) => <Cell key={i} fill={i === 0 ? 'var(--accent)' : 'var(--accent-dim)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Inference Logs Table */}
      <div className="bg-surface-100 border border-surface-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider flex items-center gap-2">
            <Terminal size={14} className="text-accent" />
            Raw Ingested Logs (Near Realtime)
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono">Limit: 20 logs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-[var(--text-primary)]">
            <thead>
              <tr className="border-b border-surface-300 text-[10px] uppercase font-mono tracking-wider">
                {['Provider', 'Model', 'Latency', 'Status', 'Payload Preview', 'Timestamp'].map(h => (
                  <th key={h} className="pb-3 text-left font-semibold text-[var(--text-secondary)] pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300/40 font-mono">
              {logs.map(log => (
                <tr key={log._id} className="hover:bg-surface-200/50 transition-colors">
                  <td className="py-3 pr-4 font-semibold capitalize">{log.provider}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)] text-[11px] truncate max-w-[120px]">{log.model}</td>
                  <td className="py-3 pr-4 text-accent font-semibold">{log.latency}ms</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      log.status === 'success' 
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'bg-red-500/10 text-red-600 border border-red-500/20'
                    }`}>
                      {log.status === 'success' ? '200 OK' : '500 ERR'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 max-w-xs truncate text-[var(--text-secondary)]">{log.inputPreview || 'No input'}</td>
                  <td className="py-3 text-[var(--text-secondary)] text-[11px]">{new Date(log.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[var(--text-secondary)]">
                    <AlertCircle className="mx-auto mb-2 text-zinc-600" size={20} />
                    No traces found. Send message prompts to trigger endpoint tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

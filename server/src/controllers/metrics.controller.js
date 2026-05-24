import { getSummaryMetrics, getLatencyTrend, getProviderBreakdown, getRecentLogs } from '../services/analytics/metrics.service.js';

export async function getMetrics(req, res) {
  const [summary, latencyTrend, providerBreakdown] = await Promise.all([
    getSummaryMetrics(), getLatencyTrend(), getProviderBreakdown(),
  ]);
  res.json({ summary, latencyTrend, providerBreakdown });
}

export async function getLogs(req, res) {
  const filter = req.query.conversationId ? { conversationId: req.query.conversationId } : {};
  const logs = await getRecentLogs(parseInt(req.query.limit) || 50, filter);
  res.json(logs);
}

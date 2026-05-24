import InferenceLog from '../../models/InferenceLog.js';

export async function getSummaryMetrics() {
  const [total, avgLatency, errorRate, tokenUsage] = await Promise.all([
    InferenceLog.countDocuments(),
    InferenceLog.aggregate([{ $group: { _id: null, avg: { $avg: '$latency' } } }]),
    InferenceLog.aggregate([{ $group: { _id: null, total: { $sum: 1 }, errors: { $sum: { $cond: [{ $eq: ['$status', 'error'] }, 1, 0] } } } }]),
    InferenceLog.aggregate([{ $group: { _id: null, prompt: { $sum: '$promptTokens' }, completion: { $sum: '$completionTokens' } } }]),
  ]);
  return {
    totalRequests: total,
    avgLatencyMs: Math.round(avgLatency[0]?.avg || 0),
    errorRate: errorRate[0] ? ((errorRate[0].errors / errorRate[0].total) * 100).toFixed(1) : '0.0',
    totalPromptTokens: tokenUsage[0]?.prompt || 0,
    totalCompletionTokens: tokenUsage[0]?.completion || 0,
  };
}

export async function getLatencyTrend(hours = 24) {
  const since = new Date(Date.now() - hours * 3600 * 1000);
  return InferenceLog.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%dT%H:00', date: '$createdAt' } }, avgLatency: { $avg: '$latency' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
}

export async function getProviderBreakdown() {
  return InferenceLog.aggregate([{ $group: { _id: '$provider', count: { $sum: 1 } } }]);
}

export async function getRecentLogs(limit = 50, filter = {}) {
  return InferenceLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
}

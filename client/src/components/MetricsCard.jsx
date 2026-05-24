export default function MetricsCard({ label, value, sub }) {
  return (
    <div className="bg-surface-100 border border-surface-300 rounded-xl p-5 hover:border-accent/30 transition-all duration-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/15 group-hover:bg-accent transition-all duration-300"></div>
      <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1.5 font-mono">{label}</p>
      <p className="text-2xl font-mono font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors duration-200">{value}</p>
      {sub && <p className="text-[10px] text-[var(--text-secondary)] mt-2 font-mono truncate">{sub}</p>}
    </div>
  );
}

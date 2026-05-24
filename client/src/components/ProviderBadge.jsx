export default function ProviderBadge({ provider, onChange }) {
  return (
    <select value={provider} onChange={e => onChange(e.target.value)}
      className="text-xs bg-surface-200 border border-surface-300 text-[var(--text-secondary)] rounded-lg px-2 py-1 outline-none hover:border-accent/40 transition-colors cursor-pointer w-full">
      <option value="gemini">✦ Gemini Flash</option>
      <option value="openai" disabled>◈ GPT-4o Mini (Disabled)</option>
    </select>
  );
}

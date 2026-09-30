const STYLES = {
  acknowledged: 'bg-forest-light text-forest',
  pending: 'bg-amber-light text-amber',
  'no-group': 'bg-rust-light text-rust',
};

const LABELS = {
  acknowledged: 'Acknowledged',
  pending: 'Pending',
  'no-group': 'No group',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] || STYLES.pending}`}>
      {status === 'acknowledged' && (
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
      {LABELS[status] || status}
    </span>
  );
}

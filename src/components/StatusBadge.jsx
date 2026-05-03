export default function StatusBadge({ status }) {
  const map = {
    TODO:        { label: 'todo',        color: '#8a8070', bg: '#f3f1ed', border: '#e8e4dc' },
    IN_PROGRESS: { label: 'in progress', color: '#1d4ed8', bg: 'rgba(37,99,235,0.06)', border: 'rgba(37,99,235,0.18)' },
    DONE:        { label: 'done',        color: '#15803d', bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.18)' },
  }
  const { label, color, bg, border } = map[status] || map.TODO
  return (
    <span className="tag" style={{ color, background: bg, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}

import { useEffect } from 'react'

export default function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26, 24, 20, 0.18)', backdropFilter: 'blur(3px)' }}
      />
      <div
        className="slide-up"
        style={{
          position: 'relative',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: wide ? '480px' : '360px',
          boxShadow: '0 8px 40px rgba(60, 50, 30, 0.14), 0 1px 4px rgba(60, 50, 30, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.01em' }}>{title}</span>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-4)', lineHeight: 0, transition: 'color 0.1s', padding: '2px', borderRadius: '4px' }}
            onMouseEnter={e => e.target.style.color = 'var(--text-2)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-4)'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{ padding: '18px' }}>{children}</div>
      </div>
    </div>
  )
}

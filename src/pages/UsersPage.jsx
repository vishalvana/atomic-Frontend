import { useEffect, useState } from 'react'
import { usersAPI } from '../services/api'
import Modal from '../components/Modal'

function AddUserModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return
    setLoading(true); setError('')
    try {
      await usersAPI.create(form)
      onAdded(); onClose()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create user')
    } finally { setLoading(false) }
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '5px' }
  const labelStyle = { fontSize: '12px', color: 'var(--text-2)' }

  return (
    <Modal title="Add member" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={fieldStyle}><label style={labelStyle}>Full name</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" className="tt-input" autoFocus /></div>
        <div style={fieldStyle}><label style={labelStyle}>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" className="tt-input" /></div>
        <div style={fieldStyle}><label style={labelStyle}>Password</label><input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" className="tt-input" /></div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)} className="tt-input">
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {error && <div style={{ padding: '8px 12px', borderRadius: 'var(--radius)', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.18)', fontSize: '12px', color: 'var(--accent-red)' }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
          <button onClick={onClose} className="tt-btn tt-btn-ghost">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="tt-btn tt-btn-primary">{loading ? 'Adding…' : 'Add member'}</button>
        </div>
      </div>
    </Modal>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = () => {
    usersAPI.getAll().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  return (
    <div className="fade-in" style={{ padding: '40px 48px', maxWidth: '760px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: '7px' }}>{ '{ team }' }</p>
          <h1 style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            {users.length} <span style={{ color: 'var(--text-3)', fontWeight: 300 }}>member{users.length !== 1 ? 's' : ''}</span>
          </h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="tt-btn tt-btn-ghost" style={{ marginTop: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Add member
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>Loading…</p>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 1px 3px var(--shadow)' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 100px', gap: '16px', padding: '9px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            {['Name', 'Email', 'Role'].map(h => (
              <span key={h} className="mono" style={{ fontSize: '10px', color: 'var(--text-3)', letterSpacing: '0.07em' }}>{h.toUpperCase()}</span>
            ))}
          </div>

          {users.length === 0 ? (
            <p style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'var(--text-3)' }}>No team members found</p>
          ) : users.map((u, i) => (
            <div
              key={u.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1.6fr 100px', gap: '16px',
                padding: '12px 20px',
                borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{ width: 26, height: 26, borderRadius: '6px', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: 'var(--text-2)', flexShrink: 0 }}>
                  {u.name?.charAt(0)?.toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text)', letterSpacing: '-0.01em' }}>{u.name}</span>
              </div>

              <span className="mono" style={{ fontSize: '12px', color: 'var(--text-3)', alignSelf: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.email}
              </span>

              <div style={{ alignSelf: 'center' }}>
                <span className="tag" style={{
                  color: u.role === 'ADMIN' ? 'var(--text)' : 'var(--text-3)',
                  background: u.role === 'ADMIN' ? 'var(--surface-3)' : 'transparent',
                  border: `1px solid ${u.role === 'ADMIN' ? 'var(--border-hover)' : 'var(--border)'}`,
                  fontSize: '10px',
                }}>
                  {(u.role || 'member').toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onAdded={load} />}
    </div>
  )
}

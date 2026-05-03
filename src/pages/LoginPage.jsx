import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      {/* Left panel */}
      <div style={{
        width: '360px', flexShrink: 0,
        borderRight: '1px solid var(--border)',
        padding: '44px 40px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--surface-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor"/>
            <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor"/>
            <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor"/>
            <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.25"/>
          </svg>
          <span style={{ fontSize: '13.5px', fontWeight: 500, letterSpacing: '-0.02em' }}>AtomicFlow</span>
        </div>

        <div>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: '18px' }}>{ '{ workspace }' }</p>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: 'var(--text)', lineHeight: 1.25, letterSpacing: '-0.03em' }}>
            Manage tasks.<br />
            <span style={{ color: 'var(--text-3)' }}>Track progress.</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '14px', lineHeight: 1.6 }}>
            Collaborate with your team and ship faster.
          </p>
        </div>

        <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)' }}>© 2025 AtomicFlow</p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: '320px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 500, color: 'var(--text)', marginBottom: '5px', letterSpacing: '-0.02em' }}>Welcome back</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px', fontWeight: 400 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="tt-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px', fontWeight: 400 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="tt-input" />
            </div>

            {error && (
              <div style={{ padding: '8px 12px', borderRadius: 'var(--radius)', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.18)', fontSize: '12px', color: 'var(--accent-red)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="tt-btn tt-btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '4px', padding: '9px', fontSize: '13px' }}
            >
              {loading
                ? <><span style={{ width: 13, height: 13, border: '1.5px solid rgba(247,246,243,0.4)', borderTop: '1.5px solid rgba(247,246,243,0.9)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Signing in…</>
                : 'Continue →'
              }
            </button>
          </form>

          <p style={{ marginTop: '22px', fontSize: '12px', color: 'var(--text-3)', textAlign: 'center' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'var(--text-2)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

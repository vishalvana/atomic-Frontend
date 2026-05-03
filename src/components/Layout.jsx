import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Logo = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor"/>
    <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor"/>
    <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor"/>
    <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.25"/>
  </svg>
)

function NavItem({ to, end, icon, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
    >
      <span style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.55 }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

const icons = {
  dashboard: <svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z"/></svg>,
  projects:  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2a1 1 0 011-1h4a1 1 0 010 2H3v8h8v-4a1 1 0 012 0v4a2 2 0 01-2 2H3a2 2 0 01-2-2V2zm8.5-1a1 1 0 011 1v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0V6h-2a1 1 0 010-2h2V2a1 1 0 011-1z"/></svg>,
  tasks:     <svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 3h10v2H3V3zm0 4h10v2H3V7zm0 4h6v2H3v-2z"/></svg>,
  team:      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 7a3 3 0 100-6 3 3 0 000 6zm-4 7s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H2zm9-7a2 2 0 100-4 2 2 0 000 4zm3 7h-2.5c.3-.7.5-1.4.5-2 0-.8-.2-1.6-.6-2.3A3 3 0 0114 12c.6.2 1 .8 1 1.5 0 .8-.6 1.5-1.5 1.5H14z"/></svg>,
  logout:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"/></svg>,
}

export default function Layout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: '212px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border)',
        padding: '14px 10px',
        gap: '1px',
        background: 'var(--surface-2)',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', marginBottom: '18px', color: 'var(--text)' }}>
          <Logo />
          <span style={{ fontSize: '13.5px', fontWeight: 500, letterSpacing: '-0.02em' }}>AtomicFlow</span>
          <span className="mono" style={{
            marginLeft: 'auto', color: 'var(--text-4)',
            background: 'var(--surface-3)', border: '1px solid var(--border)',
            fontSize: '9.5px', padding: '1px 5px', borderRadius: '3px',
          }}>
            beta
          </span>
        </div>

        {/* User chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '7px 8px', marginBottom: '10px',
          borderRadius: '7px', background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 2px var(--shadow)',
        }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '5px',
            background: 'var(--surface-3)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 500, color: 'var(--text-2)',
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '12px', color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{user?.name}</p>
            <p className="mono" style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '1px' }}>{isAdmin ? 'admin' : 'member'}</p>
          </div>
        </div>

        {/* Section label */}
        <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', padding: '4px 8px 5px', letterSpacing: '0.07em', fontWeight: 400 }}>WORKSPACE</p>

        <NavItem end to="/"         icon={icons.dashboard} label="Dashboard" />
        <NavItem     to="/projects" icon={icons.projects}  label="Projects" />
        <NavItem     to="/tasks"    icon={icons.tasks}     label="Tasks" />
        {isAdmin && <NavItem to="/users" icon={icons.team} label="Team" />}

        <div style={{ flex: 1 }} />
        <hr className="divider" style={{ margin: '8px 0' }} />

        <button
          onClick={() => { logout(); navigate('/login') }}
          className="sidebar-item"
          style={{ width: '100%', textAlign: 'left' }}
        >
          <span style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.45 }}>{icons.logout}</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        <Outlet />
      </main>
    </div>
  )
}

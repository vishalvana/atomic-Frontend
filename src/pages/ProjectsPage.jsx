import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectsAPI, usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'

function Avatar({ name, size = 22 }) {
  const colors = ['#e8e4dc', '#dce8dc', '#dce4e8', '#e8dce8', '#e8e0dc']
  const idx = (name?.charCodeAt(0) || 0) % colors.length
  return (
    <div style={{
      width: size, height: size, borderRadius: '4px',
      background: colors[idx], border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 500, color: 'var(--text-2)',
      flexShrink: 0,
    }}>
      {name?.charAt(0)?.toUpperCase()}
    </div>
  )
}

function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--surface-2)' : 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: hovered ? '0 2px 8px var(--shadow-md)' : '0 1px 3px var(--shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{
          width: 30, height: 30, borderRadius: '6px',
          background: 'var(--surface-3)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 500, color: 'var(--text-2)',
        }}>
          {project.name?.charAt(0)?.toUpperCase()}
        </div>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--text-3)', opacity: hovered ? 0.8 : 0.3, transition: 'opacity 0.15s', marginTop: '1px' }}>
          <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px', letterSpacing: '-0.01em' }}>{project.name}</p>
      <p className="mono" style={{ fontSize: '10.5px', color: 'var(--text-3)', marginBottom: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {project.createdBy}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        {project.members?.slice(0, 5).map((m, i) => <Avatar key={i} name={m} />)}
        {project.members?.length > 5 && (
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-3)', marginLeft: '3px' }}>+{project.members.length - 5}</span>
        )}
        {(!project.members || project.members.length === 0) && (
          <span style={{ fontSize: '11px', color: 'var(--text-4)' }}>No members</span>
        )}
      </div>
    </div>
  )
}

function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [users, setUsers] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    usersAPI.getAll().then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const toggle = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await projectsAPI.create({ name, memberIds: selectedIds })
      onCreated(); onClose()
    } catch {} finally { setLoading(false) }
  }

  return (
    <Modal title="New project" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px' }}>Project name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Website Redesign" className="tt-input" autoFocus />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', marginBottom: '8px' }}>Members</label>
          <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {users.map(u => (
              <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 8px', borderRadius: 'var(--radius)', cursor: 'pointer', background: selectedIds.includes(u.id) ? 'var(--surface-3)' : 'transparent', transition: 'background 0.1s' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '3px',
                  border: `1px solid ${selectedIds.includes(u.id) ? 'var(--text)' : 'var(--border-hover)'}`,
                  background: selectedIds.includes(u.id) ? 'var(--text)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.1s',
                }}>
                  {selectedIds.includes(u.id) && (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5l2 2L7.5 2" stroke="var(--bg)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggle(u.id)} style={{ display: 'none' }} />
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text)' }}>{u.name}</p>
                  <p className="mono" style={{ fontSize: '10px', color: 'var(--text-3)' }}>{u.email}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
          <button onClick={onClose} className="tt-btn tt-btn-ghost">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="tt-btn tt-btn-primary">
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const load = () => {
    projectsAPI.getAll().then(r => setProjects(r.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="fade-in" style={{ padding: '40px 48px', maxWidth: '960px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: '7px' }}>{ '{ projects }' }</p>
          <h1 style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            {projects.length} <span style={{ color: 'var(--text-3)', fontWeight: 300 }}>project{projects.length !== 1 ? 's' : ''}</span>
          </h1>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="tt-btn tt-btn-ghost" style={{ marginTop: '4px' }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            New project
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>Loading…</p>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-3)' }}>
          <p className="mono" style={{ fontSize: '11px' }}>{ '{ empty }' }</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>No projects yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} onClick={() => navigate(`/projects/${p.id}`)} />
          ))}
        </div>
      )}

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onCreated={load} />}
    </div>
  )
}

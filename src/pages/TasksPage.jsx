import { useEffect, useState } from 'react'
import { tasksAPI, projectsAPI, usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']
const STATUS_LABELS = { TODO: 'Todo', IN_PROGRESS: 'In Progress', DONE: 'Done' }

const statusStyle = (s) => ({
  TODO:        { color: '#8a8070', bg: '#f3f1ed', border: '#e8e4dc' },
  IN_PROGRESS: { color: '#1d4ed8', bg: 'rgba(37,99,235,0.06)', border: 'rgba(37,99,235,0.18)' },
  DONE:        { color: '#15803d', bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.18)' },
}[s] || { color: '#8a8070', bg: '#f3f1ed', border: '#e8e4dc' })

const colAccent = {
  TODO:        'var(--text-3)',
  IN_PROGRESS: 'var(--accent-blue)',
  DONE:        'var(--accent-green)',
}

function TaskCard({ task, onStatusChange }) {
  const [updating, setUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(task.status)
  const [hovered, setHovered] = useState(false)
  const st = statusStyle(currentStatus)

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    const prev = currentStatus
    setCurrentStatus(newStatus)
    onStatusChange(task.id, newStatus)
    setUpdating(true)
    try {
      await tasksAPI.updateStatus(task.id, newStatus)
    } catch {
      setCurrentStatus(prev)
      onStatusChange(task.id, prev)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--surface-2)' : 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '12px 13px',
        marginBottom: '5px',
        transition: 'all 0.12s',
        boxShadow: hovered ? '0 2px 6px var(--shadow-md)' : '0 1px 2px var(--shadow)',
        cursor: 'default',
      }}
    >
      <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.4, marginBottom: '10px', letterSpacing: '-0.01em' }}>
        {task.title}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 17, height: 17, borderRadius: '4px', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 500, color: 'var(--text-2)', flexShrink: 0 }}>
            {task.assignedTo?.charAt(0)?.toUpperCase()}
          </div>
          <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px', whiteSpace: 'nowrap' }}>
            {task.assignedTo?.split('@')[0]}
          </span>
        </div>
        {task.dueDate && (
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-3)' }}>{task.dueDate}</span>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={currentStatus}
          disabled={updating}
          onChange={handleStatusChange}
          style={{
            width: '100%',
            background: st.bg,
            color: st.color,
            border: `1px solid ${st.border}`,
            borderRadius: '4px',
            padding: '4px 24px 4px 8px',
            fontSize: '11px',
            fontFamily: 'Geist Mono, monospace',
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none',
            transition: 'all 0.15s',
            opacity: updating ? 0.5 : 1,
          }}
        >
          {STATUSES.map(s => (
            <option key={s} value={s} style={{ background: '#ffffff', color: '#1a1814' }}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: st.color, opacity: 0.5 }}>
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
            <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        {updating && (
          <span style={{ position: 'absolute', right: 26, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, border: '1px solid var(--border-hover)', borderTop: '1px solid var(--text-3)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
        )}
      </div>
    </div>
  )
}

function CreateTaskModal({ onClose, onCreated, projects, users }) {
  const [form, setForm] = useState({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '', status: 'TODO' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.title || !form.projectId || !form.assignedTo) return
    setLoading(true)
    try {
      await tasksAPI.create({ title: form.title, description: form.description, projectId: Number(form.projectId), assignedTo: Number(form.assignedTo), dueDate: form.dueDate })
      onCreated(); onClose()
    } catch {} finally { setLoading(false) }
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '5px' }
  const labelStyle = { fontSize: '12px', color: 'var(--text-2)' }

  return (
    <Modal title="New task" onClose={onClose} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Title</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="What needs to be done?" className="tt-input" autoFocus />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional details…" rows={2} className="tt-input" style={{ resize: 'none' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Project</label>
            <select value={form.projectId} onChange={e => set('projectId', e.target.value)} className="tt-input">
              <option value="">Select project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Assign to</label>
            <select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)} className="tt-input">
              <option value="">Select member</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Due date</label>
            <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className="tt-input" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="tt-input">
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
          <button onClick={onClose} className="tt-btn tt-btn-ghost">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="tt-btn tt-btn-primary">
            {loading ? 'Creating…' : 'Create task'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [filterProject, setFilterProject] = useState('')
  const { user } = useAuth()

  const load = () => {
    Promise.all([
      tasksAPI.getByUser(user.id),
      projectsAPI.getAll(),
      usersAPI.getAll(),
    ]).then(([t, p, u]) => {
      setTasks(t.data || [])
      setProjects(p.data || [])
      setUsers(u.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  const filtered = filterProject ? tasks.filter(t => t.project === filterProject) : tasks
  const col = (s) => filtered.filter(t => t.status === s)

  if (loading) return (
    <div style={{ padding: '48px', color: 'var(--text-3)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ width: 12, height: 12, border: '1.5px solid var(--border-hover)', borderTop: '1.5px solid var(--text-3)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
      Loading…
    </div>
  )

  return (
    <div className="fade-in" style={{ padding: '40px 48px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexShrink: 0 }}>
        <div>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: '7px' }}>{ '{ kanban }' }</p>
          <h1 style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            Tasks <span style={{ color: 'var(--text-3)', fontWeight: 300 }}>— {tasks.length}</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="tt-input" style={{ width: '156px', fontSize: '12px' }}>
            <option value="">All projects</option>
            {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <button onClick={() => setShowCreate(true)} className="tt-btn tt-btn-ghost">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            New task
          </button>
        </div>
      </div>

      {/* Kanban columns */}
      <div style={{ display: 'flex', gap: '10px', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {STATUSES.map(status => (
          <div key={status} style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--surface-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '12px' }}>
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px', flexShrink: 0 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: colAccent[status], flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-2)', letterSpacing: '-0.01em' }}>{STATUS_LABELS[status]}</span>
              <span className="mono" style={{
                fontSize: '10px',
                color: statusStyle(status).color,
                background: statusStyle(status).bg,
                border: `1px solid ${statusStyle(status).border}`,
                padding: '1px 6px',
                borderRadius: '4px',
                marginLeft: 'auto',
              }}>
                {col(status).length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1px' }}>
              {col(status).map(t => (
                <TaskCard key={t.id} task={t} onStatusChange={updateStatus} />
              ))}
              {col(status).length === 0 && (
                <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center', marginTop: '2px' }}>
                  <p className="mono" style={{ fontSize: '10.5px', color: 'var(--text-4)' }}>empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <CreateTaskModal onClose={() => setShowCreate(false)} onCreated={load} projects={projects} users={users} />
      )}
    </div>
  )
}

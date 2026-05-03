import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectsAPI, tasksAPI } from '../services/api'
import StatusBadge from '../components/StatusBadge'

function Spinner() {
  return (
    <>
      <span style={{ width: 12, height: 12, border: '1.5px solid var(--border-hover)', borderTop: '1.5px solid var(--text-3)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
    </>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      projectsAPI.getById(id).catch(() => null),
      tasksAPI.getByProject(id).catch(() => ({ data: [] })),
    ]).then(([p, t]) => {
      if (p) setProject(p.data)
      setTasks(t.data || [])
    }).finally(() => setLoading(false))
  }, [id])

  const byStatus = (s) => tasks.filter(t => t.status === s)

  if (loading) return (
    <div style={{ padding: '48px', color: 'var(--text-3)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Spinner /> Loading…
    </div>
  )

  return (
    <div className="fade-in" style={{ padding: '40px 48px', maxWidth: '880px' }}>
      {/* Back */}
      <button
        onClick={() => navigate('/projects')}
        style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-3)', marginBottom: '28px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Geist Mono, monospace', transition: 'color 0.1s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-2)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
      >
        ← projects
      </button>

      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: '7px' }}>{ '{ project }' }</p>
        <h1 style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          {project?.name || `Project #${id}`}
        </h1>
        {project?.createdBy && (
          <p className="mono" style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '4px' }}>by {project.createdBy}</p>
        )}
      </div>

      {/* Members */}
      {project?.members?.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: '10px' }}>MEMBERS</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {project.members.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '5px 10px', borderRadius: 'var(--radius)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                boxShadow: '0 1px 2px var(--shadow)',
              }}>
                <div style={{ width: 18, height: 18, borderRadius: '4px', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'var(--text-2)', fontWeight: 500 }}>
                  {m?.charAt(0)?.toUpperCase()}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-2)', letterSpacing: '-0.01em' }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '7px', marginBottom: '28px' }}>
        {[
          { label: 'total',       val: tasks.length },
          { label: 'todo',        val: byStatus('TODO').length },
          { label: 'in progress', val: byStatus('IN_PROGRESS').length },
          { label: 'done',        val: byStatus('DONE').length },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center', boxShadow: '0 1px 2px var(--shadow)' }}>
            <p style={{ fontSize: '24px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.03em' }}>{val}</p>
            <p className="mono" style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px', letterSpacing: '0.04em' }}>{label.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div>
        <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: '10px' }}>RECENT TASKS</p>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 1px 3px var(--shadow)', overflow: 'hidden' }}>
          {tasks.length === 0 ? (
            <p style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'var(--text-3)' }}>No tasks yet</p>
          ) : (
            tasks.slice(0, 8).map((t, i) => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 18px',
                borderBottom: i < Math.min(tasks.length, 8) - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{t.title}</p>
                  <p className="mono" style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '2px' }}>{t.assignedTo}</p>
                </div>
                <StatusBadge status={t.status} />
                {t.dueDate && <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-3)', flexShrink: 0 }}>{t.dueDate}</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

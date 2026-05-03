import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'

function StatCard({ label, value, accent, note }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: '0 1px 3px var(--shadow)',
      transition: 'box-shadow 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-md)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px var(--shadow)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className="mono" style={{ fontSize: '10px', color: 'var(--text-3)', letterSpacing: '0.06em', fontWeight: 400 }}>{label.toUpperCase()}</p>
        {accent && <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent }} />}
      </div>
      <p style={{ fontSize: '30px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value ?? '—'}
      </p>
    </div>
  )
}

function TaskRow({ task }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '9px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{task.title}</p>
        <p className="mono" style={{ fontSize: '10.5px', color: 'var(--text-3)', marginTop: '2px' }}>{task.project}</p>
      </div>
      <StatusBadge status={task.status} />
      {task.dueDate && (
        <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-3)', flexShrink: 0 }}>{task.dueDate}</span>
      )}
    </div>
  )
}

const Spinner = () => (
  <span style={{ width: 12, height: 12, border: '1.5px solid var(--border-hover)', borderTop: '1.5px solid var(--text-3)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
)

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    dashboardAPI.get().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ padding: '48px', color: 'var(--text-3)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Spinner /> Loading…
    </div>
  )

  return (
    <div className="fade-in" style={{ padding: '40px 48px', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p className="mono" style={{ fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: '7px' }}>{ '{ dashboard }' }</p>
        <h1 style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Good to see you, <span style={{ color: 'var(--text-3)', fontWeight: 300 }}>{user?.name?.split(' ')[0]}</span>
        </h1>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '36px' }}>
        <StatCard label="Total"       value={data?.totalTasks} />
        <StatCard label="In Progress" value={data?.inProgress} accent="var(--accent-blue)" />
        <StatCard label="Completed"   value={data?.done}       accent="var(--accent-green)" />
        <StatCard label="Overdue"     value={data?.overdueTasks?.length} accent="var(--accent-red)" />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* My Tasks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '12.5px', color: 'var(--text)', fontWeight: 500, letterSpacing: '-0.01em' }}>My Tasks</p>
            <button
              onClick={() => navigate('/tasks')}
              className="mono"
              style={{ fontSize: '10.5px', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.1s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-2)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
            >
              view all →
            </button>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '0 18px', boxShadow: '0 1px 3px var(--shadow)' }}>
            {data?.myTasks?.length > 0
              ? data.myTasks.slice(0, 6).map(t => <TaskRow key={t.id} task={t} />)
              : <p style={{ fontSize: '13px', color: 'var(--text-3)', padding: '24px 0', textAlign: 'center' }}>No tasks assigned</p>
            }
          </div>
        </div>

        {/* Overdue */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '12.5px', color: 'var(--text)', fontWeight: 500, letterSpacing: '-0.01em' }}>Overdue</p>
            <span className="mono" style={{ fontSize: '10.5px', color: 'var(--accent-red)' }}>
              {data?.overdueTasks?.length || 0} tasks
            </span>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '0 18px', boxShadow: '0 1px 3px var(--shadow)' }}>
            {data?.overdueTasks?.length > 0
              ? data.overdueTasks.slice(0, 6).map(t => <TaskRow key={t.id} task={t} />)
              : <p style={{ fontSize: '13px', color: 'var(--text-3)', padding: '24px 0', textAlign: 'center' }}>Nothing overdue 🎉</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

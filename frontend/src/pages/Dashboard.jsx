import { useEffect, useState } from 'react'
import { getTasks } from '../services/tasks'
import { useAuth } from '../context/AuthContext'

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl p-6 text-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-white/80">{label}</div>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const res = await getTasks({ per_page: 100 })
      const tasks = res.data.data

      const total = res.data.total
      const pending = tasks.filter((t) => t.status === 'pending').length
      const inProgress = tasks.filter((t) => t.status === 'in_progress').length
      const completed = tasks.filter((t) => t.status === 'completed').length

      setStats({ total, pending, inProgress, completed })
    } catch (err) {
      console.error('Failed to load stats', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Here's an overview of your tasks.
        </p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Tasks" value={stats.total} icon="📋" />
          <StatCard label="Pending" value={stats.pending} icon="⏳" />
          <StatCard label="In Progress" value={stats.inProgress} icon="⚙️" />
          <StatCard label="Completed" value={stats.completed} icon="✅" />
        </div>
      )}
    </div>
  )
}

export default Dashboard

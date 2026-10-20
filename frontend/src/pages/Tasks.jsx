import { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks'
import { getUsers } from '../services/users'
import { useAuth } from '../context/AuthContext'
import TaskTable from '../components/TaskTable'
import TaskForm from '../components/TaskForm'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'

function Tasks() {
  const { isAdmin } = useAuth()

  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [page, status])

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      loadTasks()
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  async function loadTasks() {
    setLoading(true)
    setError('')
    try {
      const params = { page, per_page: 10 }
      if (search) params.search = search
      if (status) params.status = status

      const res = await getTasks(params)
      setTasks(res.data.data)
      setLastPage(res.data.last_page)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  async function loadUsers() {
    try {
      const res = await getUsers()
      setUsers(res.data.users)
    } catch (err) {
      console.error('Failed to load users', err)
    }
  }

  function openCreate() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingTask(null)
  }

  async function handleSubmit(data) {
    setSaving(true)
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data)
      } else {
        await createTask(data)
      }
      closeModal()
      loadTasks()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(task) {
    const ok = window.confirm(`Delete task "${task.title}"?`)
    if (!ok) return

    try {
      await deleteTask(task.id)
      loadTasks()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none w-full sm:w-64"
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
          <button onClick={openCreate} className="btn-primary">+ New Task</button>

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading tasks...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : (
          <>
            <TaskTable
              tasks={tasks}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
            <Pagination
              currentPage={page}
              lastPage={lastPage}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        onClose={closeModal}
      >
        <TaskForm
          initialTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          saving={saving}
          isAdmin={isAdmin}
          users={users}
        />
      </Modal>
    </div>
  )
}

export default Tasks

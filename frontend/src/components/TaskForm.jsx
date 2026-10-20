import { useState, useEffect } from 'react'

function TaskForm({ initialTask, onSubmit, onCancel, saving, isAdmin, users }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [userId, setUserId] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '')
      setDescription(initialTask.description || '')
      setStatus(initialTask.status || 'pending')
      setUserId(initialTask.user_id ? String(initialTask.user_id) : '')
    } else {
      setTitle('')
      setDescription('')
      setStatus('pending')
      setUserId('')
    }
    setErrors({})
  }, [initialTask])

  function validate() {
    const err = {}
    if (!title.trim()) err.title = 'Title is required'
    if (title.length > 150) err.title = 'Title is too long'
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      err.status = 'Invalid status'
    }
    if (isAdmin && !userId) {
      err.user_id = 'Please assign to a user'
    }
    return err
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length > 0) {
      setErrors(err)
      return
    }

    const payload = { title, description, status }
    if (isAdmin) {
      payload.user_id = Number(userId)
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="Enter task title"
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="Optional description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {isAdmin && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign to <span className="text-red-500">*</span>
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          >
            <option value="">-- Select a user --</option>
            {users && users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.user_id && <p className="text-xs text-red-500 mt-1">{errors.user_id}</p>}
          {users && users.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">No users available to assign.</p>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : (initialTask ? 'Update Task' : 'Create Task')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TaskForm

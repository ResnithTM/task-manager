function statusBadge(status) {
  if (status === 'completed') {
    return 'bg-green-100 text-green-700'
  }
  if (status === 'in_progress') {
    return 'bg-blue-100 text-blue-700'
  }
  return 'bg-yellow-100 text-yellow-700'
}

function statusLabel(status) {
  if (status === 'in_progress') return 'In Progress'
  if (status === 'completed') return 'Completed'
  return 'Pending'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function TaskTable({ tasks, isAdmin, onEdit, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No tasks found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Status</th>
            {isAdmin && <th className="py-3 px-4">Owner</th>}
            <th className="py-3 px-4">Created</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{task.title}</div>
                {task.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {task.description}
                  </div>
                )}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(task.status)}`}>
                  {statusLabel(task.status)}
                </span>
              </td>
              {isAdmin && (
                <td className="py-3 px-4 text-gray-600">
                  {task.user ? task.user.name : '-'}
                </td>
              )}
              <td className="py-3 px-4 text-gray-500">{formatDate(task.created_at)}</td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => onEdit(task)}
                  className="text-brand-600 hover:text-brand-700 font-medium mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable

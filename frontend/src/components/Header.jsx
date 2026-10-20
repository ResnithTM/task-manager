import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'

function Header({ title }) {
  const { user, clearAuth } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {}

    clearAuth()
    navigate('/login')
  }

  let initial = ''
  if (user && user.name) {
    initial = user.name.charAt(0).toUpperCase()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
            {initial}
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">{user?.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-brand-200 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-50 transition"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header

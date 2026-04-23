import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Map, BookOpen, BarChart3, Clock, LogOut, Route, Home } from 'lucide-react'

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/route-builder', icon: Route, label: 'Route Builder' },
    { to: '/learning', icon: BookOpen, label: 'Learning Mode' },
    { to: '/compare', icon: BarChart3, label: 'Compare' },
    { to: '/history', icon: Clock, label: 'History' },
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Map className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">SmartRoute</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

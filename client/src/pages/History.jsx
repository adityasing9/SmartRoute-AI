import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import api from '../services/api.js'
import { Clock, Trash2, RotateCcw, Route } from 'lucide-react'

export default function History() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/api/routes')
      setRoutes(res.data.routes || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchRoutes() }, [])

  const deleteRoute = async (id) => {
    if (!confirm('Delete this route?')) return
    try {
      await api.delete(`/api/routes/${id}`)
      setRoutes(prev => prev.filter(r => r.id !== id))
    } catch {}
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">History</h1>
            <p className="text-sm text-gray-500 mt-1">Your saved routes and optimizations.</p>
          </div>

          {loading ? (
            <div className="text-center py-24 text-gray-400 text-sm">Loading...</div>
          ) : routes.length === 0 ? (
            <div className="text-center py-24">
              <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">No saved routes yet.</p>
              <p className="text-gray-300 text-xs mt-1">Optimize and save a route to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {routes.map((route) => {
                let locs = []
                try { locs = typeof route.locations === 'string' ? JSON.parse(route.locations) : route.locations } catch {}
                return (
                  <div key={route.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                        <Route className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{route.name || `Route #${route.id}`}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {locs.length} cities · {route.algorithm_used?.replace('-', ' ')} · {route.total_distance ? `${Number(route.total_distance).toFixed(0)} km` : '—'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href="/route-builder" className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <RotateCcw className="w-4 h-4 text-gray-400" />
                      </a>
                      <button onClick={() => deleteRoute(route.id)} className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

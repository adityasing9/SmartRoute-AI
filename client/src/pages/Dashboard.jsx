import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import AIChat from '../components/AIChat.jsx'
import api from '../services/api.js'
import { Route, BarChart3, Clock, TrendingDown } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRoutes: 0, bestDistance: null, avgTime: null })

  useEffect(() => {
    api.get('/api/routes').then(res => {
      const routes = res.data.routes || []
      const totalRoutes = routes.length
      const bestDistance = routes.length > 0 ? Math.min(...routes.map(r => r.total_distance || Infinity)) : null
      setStats({ totalRoutes, bestDistance, avgTime: null })
    }).catch(() => {})
  }, [])

  const cards = [
    { icon: Route, label: 'Total Routes', value: stats.totalRoutes, color: 'bg-gray-50' },
    { icon: TrendingDown, label: 'Best Distance', value: stats.bestDistance ? `${stats.bestDistance.toFixed(0)} km` : '—', color: 'bg-gray-50' },
    { icon: BarChart3, label: 'Algorithms', value: '3', color: 'bg-gray-50' },
    { icon: Clock, label: 'Max Cities', value: '50', color: 'bg-gray-50' },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your route optimization activity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((c, i) => (
              <div key={i} className="p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 ${c.color} rounded-xl flex items-center justify-center`}>
                    <c.icon className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-xs text-gray-400 mt-1">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-gray-100 rounded-2xl">
              <h2 className="font-semibold mb-4">Quick Start</h2>
              <div className="space-y-3">
                {[
                  { title: 'Build a Route', desc: 'Add cities and find the optimal path', link: '/route-builder' },
                  { title: 'Learn Step-by-Step', desc: 'Watch algorithms solve TSP visually', link: '/learning' },
                  { title: 'Compare Algorithms', desc: 'See how different approaches perform', link: '/compare' },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                    <div className="text-gray-300 group-hover:text-black transition-colors">→</div>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white border border-gray-100 rounded-2xl">
              <h2 className="font-semibold mb-4">Algorithms Available</h2>
              <div className="space-y-3">
                {[
                  { name: 'Nearest Neighbor', type: 'Greedy Heuristic', speed: 'Fast', quality: 'Good' },
                  { name: '2-Opt Optimization', type: 'Local Search', speed: 'Medium', quality: 'Better' },
                  { name: 'Genetic Algorithm', type: 'Evolutionary', speed: 'Slower', quality: 'Best' },
                ].map((algo, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-sm font-medium">{algo.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{algo.type}</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <div className="text-xs font-medium">{algo.speed}</div>
                        <div className="text-[10px] text-gray-400">Speed</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium">{algo.quality}</div>
                        <div className="text-[10px] text-gray-400">Quality</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <AIChat />
    </div>
  )
}

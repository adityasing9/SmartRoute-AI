import { Link } from 'react-router-dom'
import { ArrowRight, Route, BookOpen, BarChart3, Zap, Globe, Brain } from 'lucide-react'

export default function LandingPage() {
  const features = [
    { icon: Route, title: 'Route Optimization', desc: 'Find the shortest path through multiple cities using advanced algorithms.' },
    { icon: BookOpen, title: 'Learn Algorithms', desc: 'Step-by-step visualizations of Nearest Neighbor, 2-Opt, and Genetic Algorithm.' },
    { icon: BarChart3, title: 'Compare Performance', desc: 'Run multiple algorithms side-by-side and compare distance, time, and efficiency.' },
    { icon: Brain, title: 'AI Assistant', desc: 'Get intelligent insights about your routes and optimization suggestions.' },
    { icon: Globe, title: 'Interactive Maps', desc: 'Click-to-add locations on a real world map with animated route drawing.' },
    { icon: Zap, title: 'Real-time Results', desc: 'Instant optimization handling up to 50 locations with efficient computation.' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Route className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">SmartRoute AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-gray-500 hover:text-black px-4 py-2 transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="text-sm bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center pt-24 pb-20 px-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-500 mb-8">
          <Zap className="w-3 h-3" />
          Powered by advanced optimization algorithms
        </div>
        <h1 className="text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Optimize Routes.<br />
          <span className="text-gray-400">Learn Algorithms.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          An interactive platform to solve the Traveling Salesman Problem. Visualize algorithms step-by-step,
          compare performance, and find optimal routes through your cities.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Optimizing
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 border border-gray-200 px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
          <div className="grid grid-cols-3 gap-4 h-64">
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-2">Input</div>
                <div className="space-y-2">
                  {['New York', 'London', 'Tokyo', 'Sydney', 'Paris'].map((city, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 bg-black text-white rounded-md flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <div className="text-sm text-gray-400">Interactive Map</div>
                <div className="text-xs text-gray-300 mt-1">Click to add points</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-2">Results</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold">12,847 km</div>
                    <div className="text-xs text-gray-400">Total Distance</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">23ms</div>
                    <div className="text-xs text-gray-400">Execution Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">-18.4%</div>
                    <div className="text-xs text-gray-400">vs. naive path</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need</h2>
          <p className="text-gray-500 max-w-lg mx-auto">A complete toolkit for route optimization and algorithm learning.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Route className="w-4 h-4" />
            SmartRoute AI
          </div>
          <p className="text-sm text-gray-400">Built for learning and optimization.</p>
        </div>
      </footer>
    </div>
  )
}

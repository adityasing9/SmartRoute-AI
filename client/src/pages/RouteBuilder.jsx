import { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import MapView from '../components/MapView.jsx'
import CityInput from '../components/CityInput.jsx'
import AIChat from '../components/AIChat.jsx'
import { nearestNeighbor } from '../algorithms/nearestNeighbor.js'
import { twoOpt } from '../algorithms/twoOpt.js'
import { geneticAlgorithm } from '../algorithms/geneticAlgorithm.js'
import api from '../services/api.js'
import { Play, Save, Download, Trash2, ChevronDown } from 'lucide-react'

export default function RouteBuilder() {
  const [locations, setLocations] = useState([])
  const [algorithm, setAlgorithm] = useState('nearest-neighbor')
  const [result, setResult] = useState(null)
  const [edges, setEdges] = useState([])
  const [running, setRunning] = useState(false)
  const [saving, setSaving] = useState(false)

  const addCity = useCallback((city) => {
    setLocations(prev => [...prev, city])
  }, [])

  const removeCity = useCallback((index) => {
    setLocations(prev => prev.filter((_, i) => i !== index))
    setResult(null)
    setEdges([])
  }, [])

  const handleMapClick = useCallback(({ lat, lng }) => {
    addCity({ name: `Point (${lat.toFixed(3)}, ${lng.toFixed(3)})`, lat, lng })
  }, [addCity])

  const optimize = () => {
    if (locations.length < 2) return
    setRunning(true)
    setTimeout(() => {
      const start = performance.now()
      let res
      switch (algorithm) {
        case '2-opt':
          res = twoOpt(locations)
          break
        case 'genetic':
          res = geneticAlgorithm(locations)
          break
        default:
          res = nearestNeighbor(locations)
      }
      const time = performance.now() - start

      const orderedLocations = res.path.map(i => locations[i])
      const finalEdges = []
      for (let i = 0; i < res.path.length - 1; i++) finalEdges.push([res.path[i], res.path[i + 1]])
      finalEdges.push([res.path[res.path.length - 1], res.path[0]])

      setResult({
        path: res.path,
        distance: res.distance,
        time: time,
        orderedLocations,
        algorithm: algorithm
      })
      setEdges(finalEdges)
      setRunning(false)
    }, 100)
  }

  const saveRoute = async () => {
    if (!result) return
    setSaving(true)
    try {
      await api.post('/api/save-route', {
        locations,
        optimized_path: result.path,
        algorithm_used: algorithm,
        total_distance: result.distance,
        execution_time: result.time
      })
      alert('Route saved!')
    } catch (err) {
      alert('Failed to save route.')
    }
    setSaving(false)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 flex">
        {/* Left panel */}
        <div className="w-80 border-r border-gray-100 p-6 flex flex-col h-screen overflow-y-auto">
          <h2 className="text-lg font-bold mb-1">Route Builder</h2>
          <p className="text-xs text-gray-400 mb-6">Add cities and optimize your route.</p>

          <CityInput locations={locations} onAddCity={addCity} onRemoveCity={removeCity} />

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Algorithm</label>
            <div className="relative">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
              >
                <option value="nearest-neighbor">Nearest Neighbor</option>
                <option value="2-opt">2-Opt Optimization</option>
                <option value="genetic">Genetic Algorithm</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={optimize}
            disabled={locations.length < 2 || running}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {running ? 'Optimizing...' : 'Optimize Route'}
          </button>

          {locations.length > 0 && (
            <button
              onClick={() => { setLocations([]); setResult(null); setEdges([]) }}
              className="mt-2 w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView locations={locations} edges={edges} onMapClick={handleMapClick} />
        </div>

        {/* Right panel */}
        <div className="w-80 border-l border-gray-100 p-6 h-screen overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Results</h3>

          {result ? (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-400 mb-1">Total Distance</div>
                <div className="text-3xl font-bold">{result.distance.toFixed(1)}<span className="text-sm font-normal text-gray-400 ml-1">km</span></div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-400 mb-1">Execution Time</div>
                <div className="text-xl font-bold">{result.time.toFixed(2)}<span className="text-sm font-normal text-gray-400 ml-1">ms</span></div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-400 mb-1">Algorithm</div>
                <div className="text-sm font-semibold capitalize">{algorithm.replace('-', ' ')}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-2">Optimized Order</div>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {result.orderedLocations.map((loc, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="w-5 h-5 bg-black text-white rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                      <span className="truncate">{loc.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveRoute}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-300 text-sm">Add at least 2 cities and click<br />"Optimize Route" to see results.</div>
            </div>
          )}
        </div>
      </main>
      <AIChat routeContext={result ? { locations, result } : null} />
    </div>
  )
}

import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { nearestNeighbor } from '../algorithms/nearestNeighbor.js'
import { twoOpt } from '../algorithms/twoOpt.js'
import { geneticAlgorithm } from '../algorithms/geneticAlgorithm.js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Play, MapPin } from 'lucide-react'

const SAMPLE = [
  { name: 'New York', lat: 40.7128, lng: -74.006 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
]

export default function CompareAlgorithms() {
  const [results, setResults] = useState(null)
  const [running, setRunning] = useState(false)

  const run = () => {
    setRunning(true)
    setTimeout(() => {
      const algos = [
        { name: 'Nearest Neighbor', fn: nearestNeighbor },
        { name: '2-Opt', fn: twoOpt },
        { name: 'Genetic', fn: (l) => geneticAlgorithm(l, 50, 100) },
      ]
      const data = algos.map(({ name, fn }) => {
        const t0 = performance.now()
        const r = fn(SAMPLE)
        const time = performance.now() - t0
        return { name, distance: +r.distance.toFixed(1), time: +time.toFixed(2) }
      })
      const best = Math.min(...data.map(d => d.distance))
      data.forEach(d => d.efficiency = +((best / d.distance) * 100).toFixed(1))
      setResults(data)
      setRunning(false)
    }, 200)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Compare Algorithms</h1>
              <p className="text-sm text-gray-500 mt-1">Run all algorithms and compare.</p>
            </div>
            <button onClick={run} disabled={running} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
              <Play className="w-4 h-4" />{running ? 'Running...' : 'Run Comparison'}
            </button>
          </div>

          <div className="p-5 bg-gray-50 rounded-2xl mb-8">
            <div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium">Test Cities ({SAMPLE.length})</span></div>
            <div className="flex flex-wrap gap-2">{SAMPLE.map((c, i) => <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs">{c.name}</span>)}</div>
          </div>

          {results && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold">Results</h2></div>
                <table className="w-full">
                  <thead><tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">ALGORITHM</th>
                    <th className="text-right px-6 py-3 text-xs text-gray-400 font-medium">DISTANCE</th>
                    <th className="text-right px-6 py-3 text-xs text-gray-400 font-medium">TIME</th>
                    <th className="text-right px-6 py-3 text-xs text-gray-400 font-medium">EFFICIENCY</th>
                  </tr></thead>
                  <tbody>{results.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{r.name}</td>
                      <td className="px-6 py-4 text-sm text-right font-mono">{r.distance} km</td>
                      <td className="px-6 py-4 text-sm text-right font-mono">{r.time} ms</td>
                      <td className="px-6 py-4 text-right"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${r.efficiency >= 99 ? 'bg-green-50 text-green-700' : r.efficiency >= 90 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{r.efficiency}%</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-100 rounded-2xl">
                  <h3 className="font-semibold mb-4">Distance</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={results}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="distance" fill="#000" radius={[6, 6, 0, 0]} /></BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-2xl">
                  <h3 className="font-semibold mb-4">Time</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={results}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="time" fill="#6366f1" radius={[6, 6, 0, 0]} /></BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import MapView from '../components/MapView.jsx'
import { nearestNeighbor } from '../algorithms/nearestNeighbor.js'
import { twoOpt } from '../algorithms/twoOpt.js'
import { geneticAlgorithm } from '../algorithms/geneticAlgorithm.js'
import { Play, Pause, SkipForward, RotateCcw, ChevronDown } from 'lucide-react'

const SAMPLE_CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.006 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
]

export default function LearningMode() {
  const [algorithm, setAlgorithm] = useState('nearest-neighbor')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [locations] = useState(SAMPLE_CITIES)
  const intervalRef = useRef(null)

  const runAlgorithm = useCallback(() => {
    let result
    switch (algorithm) {
      case '2-opt': result = twoOpt(locations); break
      case 'genetic': result = geneticAlgorithm(locations, 30, 50); break
      default: result = nearestNeighbor(locations)
    }
    setSteps(result.steps)
    setCurrentStep(0)
    setPlaying(false)
  }, [algorithm, locations])

  useEffect(() => { runAlgorithm() }, [runAlgorithm])

  useEffect(() => {
    if (playing && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) { setPlaying(false); return prev }
          return prev + 1
        })
      }, speed)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, speed, steps.length])

  const step = steps[currentStep] || { visited: [], current: -1, edges: [], explanation: '' }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl font-bold">Learning Mode</h1>
              <p className="text-xs text-gray-400 mt-0.5">Watch algorithms solve TSP step by step</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none pr-8 focus:outline-none cursor-pointer"
                >
                  <option value="nearest-neighbor">Nearest Neighbor</option>
                  <option value="2-opt">2-Opt</option>
                  <option value="genetic">Genetic Algorithm</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm appearance-none pr-8 focus:outline-none cursor-pointer"
                >
                  <option value={2000}>0.5x</option>
                  <option value={1000}>1x</option>
                  <option value={500}>2x</option>
                  <option value={200}>5x</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <MapView
              locations={locations}
              edges={step.edges}
              currentNode={step.current}
              animate={playing}
            />
          </div>

          <div className="w-96 border-l border-gray-100 p-6 flex flex-col">
            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => { setCurrentStep(0); setPlaying(false) }}
                className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
                disabled={currentStep >= steps.length - 1}
                className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-black h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Explanation */}
            <div className="p-5 bg-gray-50 rounded-2xl mb-6">
              <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Current Step</div>
              <p className="text-sm leading-relaxed font-medium">{step.explanation}</p>
            </div>

            {/* Visited nodes */}
            <div className="flex-1 overflow-y-auto">
              <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Visited Cities</div>
              <div className="space-y-1">
                {step.visited.map((idx, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all ${
                    idx === step.current ? 'bg-black text-white' : 'bg-gray-50'
                  }`}>
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      idx === step.current ? 'bg-white text-black' : 'bg-gray-200'
                    }`}>{i + 1}</span>
                    <span className="truncate">{locations[idx]?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

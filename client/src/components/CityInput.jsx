import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, X } from 'lucide-react'

export default function CityInput({ onAddCity, locations, onRemoveCity }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef(null)

  const searchCity = async (q) => {
    if (q.length < 2) { setSuggestions([]); return }
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`
      )
      const data = await res.json()
      setSuggestions(data.map(d => ({
        name: d.display_name.split(',').slice(0, 2).join(', '),
        fullName: d.display_name,
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lon)
      })))
    } catch { setSuggestions([]) }
    setLoading(false)
  }

  const handleInput = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => searchCity(val), 400)
  }

  const selectCity = (city) => {
    onAddCity(city)
    setQuery('')
    setSuggestions([])
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleInput}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => selectCity(s)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition-colors border-b border-gray-50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{s.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
        {locations.map((loc, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl group">
            <div className="w-6 h-6 bg-black text-white rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {i + 1}
            </div>
            <span className="text-sm flex-1 truncate">{loc.name || `Point ${i + 1}`}</span>
            <button
              onClick={() => onRemoveCity(i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Or click on the map to add points
      </p>
    </div>
  )
}

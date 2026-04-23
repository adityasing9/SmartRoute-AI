import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function MapView({ locations = [], edges = [], currentNode = -1, onMapClick, animate = false }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const polylinesRef = useRef([])

  useEffect(() => {
    if (!mapRef.current) return
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
      })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CartoDB',
        maxZoom: 19,
      }).addTo(mapInstance.current)

      if (onMapClick) {
        mapInstance.current.on('click', (e) => {
          onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
        })
      }
    }
    return () => {}
  }, [])

  // Update markers
  useEffect(() => {
    if (!mapInstance.current) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    locations.forEach((loc, i) => {
      const isCurrentNode = i === currentNode
      const icon = isCurrentNode
        ? L.divIcon({
            className: 'custom-marker',
            html: `<div style="width:20px;height:20px;background:#000;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 3px #000, 0 2px 8px rgba(0,0,0,0.3);animation:pulse-dot 1s infinite;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })
        : L.divIcon({
            className: 'custom-marker',
            html: `<div style="width:14px;height:14px;background:#000;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          })

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`<b>${loc.name || 'Point ' + (i + 1)}</b><br>Lat: ${loc.lat.toFixed(4)}<br>Lng: ${loc.lng.toFixed(4)}`)
      markersRef.current.push(marker)
    })

    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]))
      mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
    }
  }, [locations, currentNode])

  // Update polylines
  useEffect(() => {
    if (!mapInstance.current) return
    polylinesRef.current.forEach(p => p.remove())
    polylinesRef.current = []

    if (edges.length > 0 && locations.length > 0) {
      edges.forEach(([from, to], idx) => {
        if (locations[from] && locations[to]) {
          const line = L.polyline(
            [[locations[from].lat, locations[from].lng], [locations[to].lat, locations[to].lng]],
            { color: '#000', weight: 2.5, opacity: 0.8, dashArray: animate ? '8 8' : null }
          ).addTo(mapInstance.current)
          polylinesRef.current.push(line)
        }
      })
    }
  }, [edges, locations, animate])

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl border border-gray-100"
      style={{ minHeight: '400px' }}
    />
  )
}

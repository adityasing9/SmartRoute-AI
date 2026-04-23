export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRad(deg) { return deg * Math.PI / 180 }

export function buildDistanceMatrix(locations) {
  const n = locations.length
  const matrix = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = haversine(locations[i].lat, locations[i].lng, locations[j].lat, locations[j].lng)
      matrix[i][j] = d
      matrix[j][i] = d
    }
  }
  return matrix
}

export function totalDistance(path, matrix) {
  let d = 0
  for (let i = 0; i < path.length - 1; i++) d += matrix[path[i]][path[i + 1]]
  d += matrix[path[path.length - 1]][path[0]]
  return d
}

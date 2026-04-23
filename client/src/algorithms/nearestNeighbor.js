import { buildDistanceMatrix, totalDistance } from './haversine.js'

export function nearestNeighbor(locations) {
  const n = locations.length
  if (n < 2) return { path: [0], distance: 0, steps: [] }
  const matrix = buildDistanceMatrix(locations)
  const visited = new Set([0])
  const path = [0]
  const steps = [{ visited: [0], current: 0, edges: [], explanation: `Starting at ${locations[0].name || 'City 0'}` }]

  while (visited.size < n) {
    const current = path[path.length - 1]
    let nearest = -1, minDist = Infinity
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && matrix[current][i] < minDist) {
        minDist = matrix[current][i]
        nearest = i
      }
    }
    visited.add(nearest)
    path.push(nearest)
    const edges = []
    for (let i = 0; i < path.length - 1; i++) edges.push([path[i], path[i + 1]])
    steps.push({
      visited: [...visited],
      current: nearest,
      edges,
      explanation: `Nearest unvisited city: ${locations[nearest].name || 'City ' + nearest} (${minDist.toFixed(1)} km)`
    })
  }

  const edges = []
  for (let i = 0; i < path.length - 1; i++) edges.push([path[i], path[i + 1]])
  edges.push([path[path.length - 1], path[0]])
  steps.push({
    visited: [...visited],
    current: path[0],
    edges,
    explanation: `Return to start. Total: ${totalDistance(path, matrix).toFixed(1)} km`
  })

  return { path, distance: totalDistance(path, matrix), steps }
}

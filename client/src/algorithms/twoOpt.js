import { buildDistanceMatrix, totalDistance } from './haversine.js'

export function twoOpt(locations, initialPath = null) {
  const n = locations.length
  if (n < 2) return { path: [0], distance: 0, steps: [] }
  const matrix = buildDistanceMatrix(locations)
  let path = initialPath ? [...initialPath] : Array.from({ length: n }, (_, i) => i)
  let bestDist = totalDistance(path, matrix)
  const steps = [{
    visited: [...path],
    current: path[0],
    edges: pathToEdges(path),
    explanation: `Initial tour: ${bestDist.toFixed(1)} km`
  }]

  let improved = true
  let iterations = 0
  while (improved && iterations < 100) {
    improved = false
    iterations++
    for (let i = 1; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const newPath = [...path.slice(0, i), ...path.slice(i, j + 1).reverse(), ...path.slice(j + 1)]
        const newDist = totalDistance(newPath, matrix)
        if (newDist < bestDist - 0.01) {
          path = newPath
          bestDist = newDist
          improved = true
          steps.push({
            visited: [...path],
            current: path[i],
            edges: pathToEdges(path),
            explanation: `2-opt swap (${i},${j}): ${bestDist.toFixed(1)} km`
          })
        }
      }
    }
  }

  steps.push({
    visited: [...path],
    current: path[0],
    edges: pathToEdges(path),
    explanation: `2-Opt complete: ${bestDist.toFixed(1)} km (${iterations} iterations)`
  })

  return { path, distance: bestDist, steps }
}

function pathToEdges(path) {
  const edges = []
  for (let i = 0; i < path.length - 1; i++) edges.push([path[i], path[i + 1]])
  edges.push([path[path.length - 1], path[0]])
  return edges
}

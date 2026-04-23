import { buildDistanceMatrix, totalDistance } from './haversine.js'

export function geneticAlgorithm(locations, popSize = 50, generations = 100) {
  const n = locations.length
  if (n < 2) return { path: [0], distance: 0, steps: [] }
  const matrix = buildDistanceMatrix(locations)

  let population = Array.from({ length: popSize }, () => shuffle(n))
  const steps = []
  let bestPath = population[0]
  let bestDist = totalDistance(bestPath, matrix)

  steps.push({
    visited: [...bestPath], current: bestPath[0], edges: pathToEdges(bestPath),
    explanation: `Gen 0: Best = ${bestDist.toFixed(1)} km`
  })

  for (let gen = 0; gen < generations; gen++) {
    const scored = population.map(p => ({ path: p, dist: totalDistance(p, matrix) }))
    scored.sort((a, b) => a.dist - b.dist)

    if (scored[0].dist < bestDist) {
      bestDist = scored[0].dist
      bestPath = scored[0].path
    }

    const newPop = [scored[0].path, scored[1].path]
    while (newPop.length < popSize) {
      const p1 = tournamentSelect(scored)
      const p2 = tournamentSelect(scored)
      let child = orderCrossover(p1, p2, n)
      if (Math.random() < 0.3) child = mutate(child)
      newPop.push(child)
    }
    population = newPop

    if (gen % 10 === 0 || gen === generations - 1) {
      steps.push({
        visited: [...bestPath], current: bestPath[0], edges: pathToEdges(bestPath),
        explanation: `Gen ${gen + 1}: Best = ${bestDist.toFixed(1)} km`
      })
    }
  }

  steps.push({
    visited: [...bestPath], current: bestPath[0], edges: pathToEdges(bestPath),
    explanation: `GA complete: ${bestDist.toFixed(1)} km (${generations} generations)`
  })

  return { path: bestPath, distance: bestDist, steps }
}

function shuffle(n) {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function tournamentSelect(scored, k = 3) {
  let best = scored[Math.floor(Math.random() * scored.length)]
  for (let i = 1; i < k; i++) {
    const candidate = scored[Math.floor(Math.random() * scored.length)]
    if (candidate.dist < best.dist) best = candidate
  }
  return best.path
}

function orderCrossover(p1, p2, n) {
  const start = Math.floor(Math.random() * n)
  const end = start + Math.floor(Math.random() * (n - start))
  const child = Array(n).fill(-1)
  for (let i = start; i <= end; i++) child[i] = p1[i]
  let pos = (end + 1) % n
  for (let i = 0; i < n; i++) {
    const gene = p2[(end + 1 + i) % n]
    if (!child.includes(gene)) { child[pos] = gene; pos = (pos + 1) % n }
  }
  return child
}

function mutate(path) {
  const p = [...path]
  const i = Math.floor(Math.random() * p.length)
  const j = Math.floor(Math.random() * p.length);
  [p[i], p[j]] = [p[j], p[i]]
  return p
}

function pathToEdges(path) {
  const edges = []
  for (let i = 0; i < path.length - 1; i++) edges.push([path[i], path[i + 1]])
  edges.push([path[path.length - 1], path[0]])
  return edges
}

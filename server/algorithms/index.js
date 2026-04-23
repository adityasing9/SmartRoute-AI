export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function buildDistanceMatrix(locations) {
  const n = locations.length
  const m = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const d = haversine(locations[i].lat, locations[i].lng, locations[j].lat, locations[j].lng)
      m[i][j] = d; m[j][i] = d
    }
  return m
}

export function totalDistance(path, matrix) {
  let d = 0
  for (let i = 0; i < path.length - 1; i++) d += matrix[path[i]][path[i + 1]]
  d += matrix[path[path.length - 1]][path[0]]
  return d
}

export function nearestNeighbor(locations) {
  const n = locations.length
  const matrix = buildDistanceMatrix(locations)
  const visited = new Set([0])
  const path = [0]
  while (visited.size < n) {
    const curr = path[path.length - 1]
    let nearest = -1, min = Infinity
    for (let i = 0; i < n; i++) if (!visited.has(i) && matrix[curr][i] < min) { min = matrix[curr][i]; nearest = i }
    visited.add(nearest); path.push(nearest)
  }
  return { path, distance: totalDistance(path, matrix), steps: [] }
}

export function twoOpt(locations) {
  const n = locations.length
  const matrix = buildDistanceMatrix(locations)
  let path = Array.from({ length: n }, (_, i) => i)
  let best = totalDistance(path, matrix)
  let improved = true
  while (improved) {
    improved = false
    for (let i = 1; i < n - 1; i++)
      for (let j = i + 1; j < n; j++) {
        const np = [...path.slice(0, i), ...path.slice(i, j + 1).reverse(), ...path.slice(j + 1)]
        const nd = totalDistance(np, matrix)
        if (nd < best - 0.01) { path = np; best = nd; improved = true }
      }
  }
  return { path, distance: best, steps: [] }
}

export function geneticAlgorithm(locations, popSize = 50, gens = 100) {
  const n = locations.length
  const matrix = buildDistanceMatrix(locations)
  const shuffle = () => { const a = Array.from({ length: n }, (_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
  let pop = Array.from({ length: popSize }, shuffle)
  let bestPath = pop[0], bestDist = totalDistance(bestPath, matrix)
  for (let g = 0; g < gens; g++) {
    const scored = pop.map(p => ({ p, d: totalDistance(p, matrix) })).sort((a, b) => a.d - b.d)
    if (scored[0].d < bestDist) { bestDist = scored[0].d; bestPath = scored[0].p }
    const newPop = [scored[0].p, scored[1].p]
    while (newPop.length < popSize) {
      const p1 = scored[Math.floor(Math.random() * 5)].p
      const p2 = scored[Math.floor(Math.random() * 5)].p
      const s = Math.floor(Math.random() * n), e = s + Math.floor(Math.random() * (n - s))
      const child = Array(n).fill(-1)
      for (let i = s; i <= e; i++) child[i] = p1[i]
      let pos = (e + 1) % n
      for (let i = 0; i < n; i++) { const g2 = p2[(e + 1 + i) % n]; if (!child.includes(g2)) { child[pos] = g2; pos = (pos + 1) % n } }
      if (Math.random() < 0.3) { const a = Math.floor(Math.random() * n), b = Math.floor(Math.random() * n); [child[a], child[b]] = [child[b], child[a]] }
      newPop.push(child)
    }
    pop = newPop
  }
  return { path: bestPath, distance: bestDist, steps: [] }
}

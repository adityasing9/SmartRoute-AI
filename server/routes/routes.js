import { Router } from 'express'
import pool from '../db/connection.js'
import auth from '../middleware/auth.js'
import { nearestNeighbor, twoOpt, geneticAlgorithm } from '../algorithms/index.js'

const router = Router()

// In-memory fallback
const memRoutes = []
let nextRouteId = 1

router.post('/optimize-route', auth, async (req, res) => {
  try {
    const { locations, algorithm = 'nearest-neighbor' } = req.body
    if (!locations || locations.length < 2) return res.status(400).json({ error: 'Need at least 2 locations' })

    const start = performance.now()
    let result
    switch (algorithm) {
      case '2-opt': result = twoOpt(locations); break
      case 'genetic': result = geneticAlgorithm(locations); break
      default: result = nearestNeighbor(locations)
    }
    const execTime = performance.now() - start

    res.json({
      path: result.path,
      distance: result.distance,
      execution_time: execTime,
      algorithm
    })
  } catch (err) {
    console.error('Optimize error:', err)
    res.status(500).json({ error: 'Optimization failed' })
  }
})

router.post('/save-route', auth, async (req, res) => {
  try {
    const { locations, optimized_path, algorithm_used, total_distance, execution_time } = req.body
    let insertId
    try {
      const [result] = await pool.query(
        'INSERT INTO routes (user_id, locations, optimized_path, algorithm_used, total_distance) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, JSON.stringify(locations), JSON.stringify(optimized_path), algorithm_used, total_distance]
      )
      insertId = result.insertId
      await pool.query(
        'INSERT INTO analytics (route_id, execution_time) VALUES (?, ?)',
        [insertId, execution_time]
      )
    } catch (dbErr) {
      console.warn('DB error on save-route, using in-memory fallback')
      insertId = nextRouteId++
      memRoutes.push({
        id: insertId,
        user_id: req.user.id,
        locations: JSON.stringify(locations),
        optimized_path: JSON.stringify(optimized_path),
        algorithm_used,
        total_distance,
        created_at: new Date().toISOString()
      })
    }
    res.status(201).json({ id: insertId, message: 'Route saved' })
  } catch (err) {
    console.error('Save error:', err)
    res.status(500).json({ error: 'Failed to save route' })
  }
})

router.get('/routes', auth, async (req, res) => {
  try {
    let routes
    try {
      const [dbRoutes] = await pool.query(
        'SELECT * FROM routes WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id]
      )
      routes = dbRoutes
    } catch (dbErr) {
      console.warn('DB error on get routes, using in-memory fallback')
      routes = memRoutes.filter(r => r.user_id === req.user.id).reverse()
    }
    res.json({ routes })
  } catch (err) {
    console.error('Fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch routes' })
  }
})

router.delete('/routes/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    try {
      await pool.query('DELETE FROM routes WHERE id = ? AND user_id = ?', [id, req.user.id])
    } catch (dbErr) {
      console.warn('DB error on delete route, using in-memory fallback')
      const index = memRoutes.findIndex(r => r.id === id && r.user_id === req.user.id)
      if (index !== -1) memRoutes.splice(index, 1)
    }
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

export default router

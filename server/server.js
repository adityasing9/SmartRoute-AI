import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import authRoutes from './routes/auth.js'
import routeRoutes from './routes/routes.js'
import aiRoutes from './routes/ai.js'
import pool from './db/connection.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api', routeRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Init DB tables
async function initDB() {
  try {
    const conn = await pool.getConnection()
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
    await conn.query(`CREATE TABLE IF NOT EXISTS routes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) DEFAULT 'Untitled Route',
      locations JSON NOT NULL,
      optimized_path JSON,
      algorithm_used VARCHAR(50),
      total_distance DECIMAL(12,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`)
    await conn.query(`CREATE TABLE IF NOT EXISTS analytics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      route_id INT NOT NULL,
      execution_time DECIMAL(10,4),
      improvement_percentage DECIMAL(6,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
    )`)
    conn.release()
    console.log('✓ Database tables ready')
  } catch (err) {
    console.error('DB init error:', err.message)
    console.log('⚠ Server running without database - some features may not work')
  }
}

app.listen(PORT, async () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
  await initDB()
})

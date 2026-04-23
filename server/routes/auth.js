import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db/connection.js'

const router = Router()

// In-memory fallback
const memUsers = []
let nextUserId = 1

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' })
    if (password.length < 6) return res.status(400).json({ error: 'Password must be 6+ characters' })

    const hash = await bcrypt.hash(password, 10)
    let insertId

    try {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
      if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' })
      const [result] = await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash])
      insertId = result.insertId
    } catch (dbErr) {
      console.warn('DB error on register, using in-memory fallback')
      if (memUsers.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' })
      insertId = nextUserId++
      memUsers.push({ id: insertId, name, email, password_hash: hash })
    }

    const token = jwt.sign({ id: insertId, email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: insertId, name, email } })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    let user

    try {
      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
      if (users.length > 0) user = users[0]
    } catch (dbErr) {
      console.warn('DB error on login, using in-memory fallback')
      user = memUsers.find(u => u.email === email)
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router

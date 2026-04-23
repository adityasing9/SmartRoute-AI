import { Router } from 'express'
import auth from '../middleware/auth.js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

const router = Router()

router.post('/ask', auth, async (req, res) => {
  try {
    const { message, context } = req.body
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Provide intelligent fallback responses without OpenAI
      const reply = getFallbackResponse(message, context)
      return res.json({ reply })
    }

    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey })

    const systemPrompt = `You are a route optimization assistant for SmartRoute AI. You help users understand TSP algorithms, route optimization, and suggest improvements. Be concise and helpful. ${context ? `Current route context: ${JSON.stringify(context)}` : ''}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
    })

    res.json({ reply: completion.choices[0].message.content })
  } catch (err) {
    console.error('AI error:', err)
    res.json({ reply: 'I encountered an error. Please try again.' })
  }
})

function getFallbackResponse(message, context) {
  const msg = message.toLowerCase()
  if (msg.includes('shorter') || msg.includes('why')) {
    return 'The algorithm finds shorter routes by evaluating distances between all city pairs using the Haversine formula and systematically reducing the total tour length. Nearest Neighbor greedily picks the closest unvisited city, while 2-Opt improves by reversing path segments, and Genetic Algorithm evolves a population of solutions.'
  }
  if (msg.includes('improve') || msg.includes('better')) {
    return 'To improve your route: 1) Try the 2-Opt algorithm which refines an initial solution, 2) Use the Genetic Algorithm for potentially better results on larger inputs, 3) Add more intermediate waypoints if practical. The 2-Opt typically gives 15-25% improvement over Nearest Neighbor.'
  }
  if (msg.includes('algorithm') || msg.includes('which')) {
    return 'For quick results: use Nearest Neighbor (fast, decent quality). For better optimization: use 2-Opt (medium speed, good quality). For best results on complex routes: use Genetic Algorithm (slower but often finds superior solutions).'
  }
  return 'I can help explain route decisions, suggest improvements, and answer questions about TSP algorithms. Try asking "Why is this route shorter?" or "Which algorithm should I use?"'
}

export default router

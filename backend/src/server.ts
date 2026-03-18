import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler'

// Import routes
import authRoutes from './routes/auth.routes'
import thoughtsRoutes from './routes/thoughts.routes'
import questionsRoutes from './routes/questions.routes'
import answersRoutes, { studentAnswersRouter } from './routes/answers.routes'
import streakRoutes from './routes/streak.routes'
import adminRoutes from './routes/admin.routes'

const app = express()
const PORT = Number(process.env.PORT) || 5000

// ─── Middleware ─────────────────────────────────────────────────────
app.use(cors({
    origin: [
        // Development URLs
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://localhost:3002', 
        'http://localhost:3003',
        'http://localhost:5000', // Backend itself
        
        // Backend URL (for self-reference)
        'https://students-portal-cxn8.onrender.com',
        
        // Vercel deployment URLs (ACTUAL URLs)
        'https://students-portal-xi.vercel.app',    // Admin frontend
        'https://students-portal-6khh.vercel.app',  // User frontend
        
        // Custom domains (add when ready)
        // 'https://admin.yourdomain.com',
        // 'https://app.yourdomain.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

app.use(express.json())

// ─── Health Check ───────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() })
})

// ─── Routes ─────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/thoughts', thoughtsRoutes)
app.use('/api/questions', questionsRoutes)
app.use('/api/answers', answersRoutes)
app.use('/api/student/answers', studentAnswersRouter)
app.use('/api/student/streak', streakRoutes)
app.use('/api/admin', adminRoutes)

// Convenience aliases (student-user frontend calls these)
app.use('/api/streak', streakRoutes)

// ─── Error Handler ──────────────────────────────────────────────────
app.use(errorHandler)

// ─── Start ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Backend listening on http://localhost:${PORT}`)
    console.log(`📋 Routes:`)
    console.log(`   /api/auth       — Authentication`)
    console.log(`   /api/thoughts   — Thoughts (public GET)`)
    console.log(`   /api/questions  — Questions (public GET)`)
    console.log(`   /api/answers    — Answers (admin)`)
    console.log(`   /api/student/*  — Student endpoints`)
    console.log(`   /api/admin/*    — Admin endpoints`)
    console.log(`   /health         — Health check`)
})

export default app

import express from "express"
import { protect } from "../middlewares/auth.js"
import { generateQuestion, evaluateAnswer } from "../config/gemini.js"
import Interview from "../models/Interview.js"
import User from "../models/User.js"

const router = express.Router()

// @desc    Generate interview question
// @route   POST /api/interview/generate
// @access  Private
router.post("/generate", protect, async (req, res) => {
  try {
    const { domain, difficulty } = req.body

    // Validation
    const validDomains = [
      "JavaScript",
      "React",
      "Node.js",
      "SQL",
      "Data Science",
      "Marketing",
      "Python",
      "System Design",
    ]
    const validDifficulties = ["Easy", "Medium", "Hard"]

    if (!domain || !difficulty) {
      return res.status(400).json({ message: "Domain and difficulty are required" })
    }

    if (!validDomains.includes(domain)) {
      return res.status(400).json({ message: "Invalid domain selected" })
    }

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty selected" })
    }

    // Generate question using Gemini AI
    const question = await generateQuestion(domain, difficulty)

    res.json({
      success: true,
      question,
      domain,
      difficulty,
    })
  } catch (error) {
    console.error("Generate question error:", error)
    res.status(500).json({
      message: "Failed to generate question",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    })
  }
})

// @desc    Submit answer and get evaluation
// @route   POST /api/interview/evaluate
// @access  Private
router.post("/evaluate", protect, async (req, res) => {
  try {
    const { question, userAnswer, domain, difficulty, timeSpent } = req.body

    // Validation
    if (!question || !userAnswer || !domain || !difficulty) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (userAnswer.trim().length < 10) {
      return res.status(400).json({ message: "Answer must be at least 10 characters long" })
    }

    // Evaluate answer using Gemini AI
    const evaluation = await evaluateAnswer(question, userAnswer, domain, difficulty)

    // Save interview record
    const interview = await Interview.create({
      userId: req.user._id,
      domain,
      difficulty,
      question,
      userAnswer: userAnswer.trim(),
      aiFeedback: evaluation.feedback,
      score: evaluation.score,
      timeSpent: timeSpent || 0,
    })

    // Update user stats
    const user = await User.findById(req.user._id)
    user.updateStats(evaluation.score)
    await user.save()

    res.json({
      success: true,
      message: "Answer evaluated successfully",
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        interviewId: interview._id,
      },
      userStats: {
        totalAttempts: user.totalAttempts,
        averageScore: user.averageScore,
      },
    })
  } catch (error) {
    console.error("Evaluate answer error:", error)
    res.status(500).json({
      message: "Failed to evaluate answer",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    })
  }
})

// @desc    Get domains and difficulties
// @route   GET /api/interview/options
// @access  Private
router.get("/options", protect, (req, res) => {
  const domains = ["JavaScript", "React", "Node.js", "SQL", "Data Science", "Marketing", "Python", "System Design"]

  const difficulties = ["Easy", "Medium", "Hard"]

  res.json({
    success: true,
    domains,
    difficulties,
  })
})

export default router

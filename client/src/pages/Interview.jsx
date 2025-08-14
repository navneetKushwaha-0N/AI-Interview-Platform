"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FiClock, FiSend, FiArrowLeft, FiCheckCircle } from "react-icons/fi"
import axios from "axios"
import toast from "react-hot-toast"

const Interview = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { updateUserStats } = useAuth()

  const [question, setQuestion] = useState("")
  const [domain, setDomain] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState(null)

  useEffect(() => {
    // Get question data from navigation state
    if (location.state) {
      setQuestion(location.state.question)
      setDomain(location.state.domain)
      setDifficulty(location.state.difficulty)
      setStartTime(Date.now())
    } else {
      // Redirect to dashboard if no question data
      navigate("/dashboard")
    }
  }, [location.state, navigate])

  useEffect(() => {
    // Timer for tracking time spent
    if (startTime && !feedback) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [startTime, feedback])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before submitting")
      return
    }

    if (answer.trim().length < 10) {
      toast.error("Answer must be at least 10 characters long")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post("/interview/evaluate", {
        question,
        userAnswer: answer.trim(),
        domain,
        difficulty,
        timeSpent,
      })

      if (response.data.success) {
        setFeedback(response.data.evaluation.feedback)
        setScore(response.data.evaluation.score)
        updateUserStats(response.data.userStats)
        toast.success("Answer submitted successfully!")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit answer")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "Hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score) => {
    if (score >= 9) return "Excellent! Outstanding answer!"
    if (score >= 7) return "Great job! Well done!"
    if (score >= 5) return "Good effort! Room for improvement."
    return "Keep practicing! You'll get better."
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
          <span className="text-sm font-medium text-gray-600">{domain}</span>
          {!feedback && (
            <div className="flex items-center text-gray-600">
              <FiClock className="w-4 h-4 mr-1" />
              <span className="font-mono">{formatTime(timeSpent)}</span>
            </div>
          )}
        </div>
      </div>

      {!feedback ? (
        /* Question and Answer Section */
        <div className="space-y-8">
          {/* Question Card */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Question</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{question}</p>
            </div>
          </div>

          {/* Answer Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be detailed and explain your reasoning."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">{answer.length} characters (minimum 10 required)</p>
              <button
                onClick={submitAnswer}
                disabled={isSubmitting || answer.trim().length < 10}
                className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Evaluating...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4 mr-2" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Feedback Section */
        <div className="space-y-8">
          {/* Score Card */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Complete!</h2>
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>{score}/10</div>
            <p className="text-gray-600 mb-4">{getScoreMessage(score)}</p>
            <div className="text-sm text-gray-500">
              Time spent: {formatTime(timeSpent)} | Domain: {domain} | Difficulty: {difficulty}
            </div>
          </div>

          {/* Question Review */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">{question}</p>
            </div>
          </div>

          {/* Your Answer */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Feedback</h3>
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{feedback}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/dashboard")} className="btn-primary px-6 py-3">
              Practice Another Question
            </button>
            <button onClick={() => navigate("/progress")} className="btn-secondary px-6 py-3">
              View Progress
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Interview

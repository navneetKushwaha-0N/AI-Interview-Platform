"use client"

import { FiCheckCircle, FiTrendingUp } from "react-icons/fi"

const FeedbackDisplay = ({ score, feedback, question, answer, domain, difficulty, timeSpent }) => {
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <FiTrendingUp className="w-5 h-5 inline mr-2" />
          AI Feedback
        </h3>
        <div className="prose max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{feedback}</p>
        </div>
      </div>
    </div>
  )
}

export default FeedbackDisplay

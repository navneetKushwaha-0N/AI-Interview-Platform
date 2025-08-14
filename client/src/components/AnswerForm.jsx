"use client"

import { useState } from "react"
import { FiSend } from "react-icons/fi"

const AnswerForm = ({ onSubmit, isSubmitting }) => {
  const [answer, setAnswer] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (answer.trim().length >= 10) {
      onSubmit(answer.trim())
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here... Be detailed and explain your reasoning."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          disabled={isSubmitting}
          required
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">{answer.length} characters (minimum 10 required)</p>
          <button
            type="submit"
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
      </form>
    </div>
  )
}

export default AnswerForm

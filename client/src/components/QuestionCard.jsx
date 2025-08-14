"use client"

const QuestionCard = ({ question, domain, difficulty, onAnswerSubmit, isLoading }) => {
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

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Interview Question</h2>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
          <span className="text-sm font-medium text-gray-600">{domain}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{question}</p>
      </div>
    </div>
  )
}

export default QuestionCard

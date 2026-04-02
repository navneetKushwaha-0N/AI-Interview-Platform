"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FiPlay, FiTrendingUp, FiAward, FiClock, FiChevronDown } from "react-icons/fi"
import axios from "axios"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [domains, setDomains] = useState([])
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentInterviews, setRecentInterviews] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const difficulties = ["Easy", "Medium", "Hard"]

  useEffect(() => {
    fetchOptions()
    fetchRecentInterviews()
  }, [])

  const fetchOptions = async () => {
    try {
      const response = await axios.get("/interview/options")
      if (response.data.success) setDomains(response.data.domains)
    } catch (error) {
      console.error("Error fetching options:", error)
    }
  }

  const fetchRecentInterviews = async () => {
    try {
      const response = await axios.get("/progress?limit=3")
      if (response.data.success) setRecentInterviews(response.data.data.interviews)
    } catch (error) {
      console.error("Error fetching recent interviews:", error)
    }
  }

  const startInterview = async () => {
    if (!selectedDomain || !selectedDifficulty) {
      toast.error("Please select both domain and difficulty")
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.post("/interview/generate", {
        domain: selectedDomain,
        difficulty: selectedDifficulty,
      })
      if (response.data.success) {
        navigate("/interview", {
          state: {
            question: response.data.question,
            domain: selectedDomain,
            difficulty: selectedDifficulty,
          },
        })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate question")
    } finally {
      setIsLoading(false)
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome back, <span className="text-blue-600">{user?.name}</span> 👋
        </h1>
        <p className="mt-2 text-gray-600">Sharpen your interview skills today.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="lg:col-span-2">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                label: "Total Attempts",
                value: user?.totalAttempts || 0,
                icon: <FiTrendingUp className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-100",
              },
              {
                label: "Average Score",
                value: `${user?.averageScore || 0}/10`,
                icon: <FiAward className="w-6 h-6 text-green-600" />,
                bg: "bg-green-100",
              },
              {
                label: "Total Score",
                value: user?.totalScore || 0,
                icon: <FiClock className="w-6 h-6 text-indigo-600" />,
                bg: "bg-indigo-100",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-5 flex items-center"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Start Interview */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Start New Interview</h2>

            <div className="space-y-6">
              {/* Domain */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Select Domain</label>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 flex justify-between items-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                >
                  {selectedDomain || "Choose a domain..."}
                  <FiChevronDown className={`ml-2 transform transition ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
                    >
                      {domains.map((domain) => (
                        <motion.li
                          key={domain}
                          onClick={() => {
                            setSelectedDomain(domain)
                            setDropdownOpen(false)
                          }}
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          className="px-4 py-2 cursor-pointer text-gray-700 hover:text-gray-900"
                        >
                          {domain}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedDifficulty === difficulty
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{difficulty}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {difficulty === "Easy" && "Basic concepts"}
                        {difficulty === "Medium" && "Intermediate"}
                        {difficulty === "Hard" && "Advanced topics"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button */}
              <button
                onClick={startInterview}
                disabled={!selectedDomain || !selectedDifficulty || isLoading}
                className="w-full py-3 text-lg font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 flex items-center justify-center transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Question...
                  </>
                ) : (
                  <>
                    <FiPlay className="w-5 h-5 mr-2" />
                    Start Interview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side — same as before */}
        <div className="space-y-6">
          {/* Recent Interviews */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Interviews</h3>
              <Link to="/progress" className="text-blue-600 hover:underline text-sm">
                View all
              </Link>
            </div>
            {recentInterviews.length > 0 ? (
              <div className="space-y-3">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview._id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{interview.domain}</span>
                      <span className={`font-bold ${getScoreColor(interview.score)}`}>
                        {interview.score}/10
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(
                          interview.difficulty
                        )}`}
                      >
                        {interview.difficulty}
                      </span>
                      <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No interviews yet. Start your first one!
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <Link
              to="/progress"
              className="block p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">View Progress</div>
              <div className="text-sm text-gray-600">
                Check your performance analytics
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

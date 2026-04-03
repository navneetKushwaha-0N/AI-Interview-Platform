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
      const res = await axios.get("/interview/options")
      if (res.data.success) setDomains(res.data.domains)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchRecentInterviews = async () => {
    try {
      const res = await axios.get("/progress?limit=3")
      if (res.data.success) setRecentInterviews(res.data.data.interviews)
    } catch (err) {
      console.error(err)
    }
  }

  const startInterview = async () => {
    if (!selectedDomain || !selectedDifficulty) {
      toast.error("Please select domain and difficulty")
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post("/interview/generate", {
        domain: selectedDomain,
        difficulty: selectedDifficulty,
      })

      if (res.data.success) {
        navigate("/interview", {
          state: {
            question: res.data.question,
            domain: selectedDomain,
            difficulty: selectedDifficulty,
          },
        })
      }
    } catch (err) {
      toast.error("Failed to generate question")
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
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400/20 blur-3xl rounded-full"></div>

      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome back, <span className="text-indigo-600">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Sharpen your interview skills today.
        </p>
      </div>


      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2">

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            {[
              {
                label: "Total Attempts",
                value: user?.totalAttempts || 0,
                icon: <FiTrendingUp className="text-blue-600 w-6 h-6"/>,
                bg: "bg-blue-100",
              },
              {
                label: "Average Score",
                value: `${user?.averageScore || 0}/10`,
                icon: <FiAward className="text-green-600 w-6 h-6"/>,
                bg: "bg-green-100",
              },
              {
                label: "Total Score",
                value: user?.totalScore || 0,
                icon: <FiClock className="text-indigo-600 w-6 h-6"/>,
                bg: "bg-indigo-100",
              },
            ].map((stat, i) => (

              <div
                key={i}
                className="backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition rounded-xl p-5 flex items-center"
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
          <div className="backdrop-blur-xl bg-white/70 border border-white/30 shadow-xl rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Start New Interview
            </h2>

            <div className="space-y-6">

              {/* DOMAIN */}
              <div className="relative">

                <label className="block text-sm font-medium mb-2">
                  Select Domain
                </label>

                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 flex justify-between items-center"
                >
                  {selectedDomain || "Choose a domain"}
                  <FiChevronDown/>
                </button>

                <AnimatePresence>

                  {dropdownOpen && (

                    <motion.ul
                      initial={{opacity:0,y:-10}}
                      animate={{opacity:1,y:0}}
                      exit={{opacity:0,y:-10}}
                      className="absolute mt-2 w-full backdrop-blur-xl bg-white/90 border border-white/30 rounded-lg shadow-xl z-10"
                    >

                      {domains.map(domain => (

                        <li
                          key={domain}
                          onClick={()=>{
                            setSelectedDomain(domain)
                            setDropdownOpen(false)
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {domain}
                        </li>

                      ))}

                    </motion.ul>

                  )}

                </AnimatePresence>

              </div>


              {/* Difficulty */}
              <div>

                <label className="block text-sm font-medium mb-2">
                  Select Difficulty
                </label>

                <div className="grid grid-cols-3 gap-3">

                  {difficulties.map(level => (

                    <button
                      key={level}
                      onClick={()=>setSelectedDifficulty(level)}
                      className={`p-3 rounded-lg border transition hover:scale-105 ${
                        selectedDifficulty === level
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white/50"
                      }`}
                    >

                      <div className="font-medium">
                        {level}
                      </div>

                    </button>

                  ))}

                </div>

              </div>


              {/* Button */}
              <button
                onClick={startInterview}
                disabled={!selectedDomain || !selectedDifficulty || isLoading}
                className="w-full py-3 text-lg font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:scale-[1.02] shadow-lg hover:shadow-indigo-500/40 transition"
              >

                {isLoading ? (
                  "Generating Question..."
                ) : (
                  <>
                    <FiPlay className="inline mr-2"/>
                    Start Interview
                  </>
                )}

              </button>

            </div>

          </div>

        </div>


        {/* RIGHT */}
        <div className="space-y-6">

          {/* Recent Interviews */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/30 shadow-lg rounded-xl p-6">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Recent Interviews
              </h3>

              <Link to="/progress" className="text-blue-600 text-sm">
                View all
              </Link>

            </div>

            {recentInterviews.length > 0 ? (

              <div className="space-y-3">

                {recentInterviews.map(interview => (

                  <div
                    key={interview._id}
                    className="p-3 bg-white/60 rounded-lg hover:bg-white/80 transition"
                  >

                    <div className="flex justify-between mb-2">

                      <span className="font-medium">
                        {interview.domain}
                      </span>

                      <span className={getScoreColor(interview.score)}>
                        {interview.score}/10
                      </span>

                    </div>

                    <div className="flex justify-between text-sm text-gray-600">

                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(interview.difficulty)}`}>
                        {interview.difficulty}
                      </span>

                      <span>
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-gray-500 text-center py-4">
                No interviews yet
              </p>

            )}

          </div>


          {/* Quick Actions */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/30 shadow-lg rounded-xl p-6">

            <h3 className="font-semibold text-lg mb-4">
              Quick Actions
            </h3>

            <Link
              to="/progress"
              className="block p-3 rounded-lg hover:bg-white/70 transition"
            >
              <div className="font-medium">
                View Progress
              </div>

              <div className="text-sm text-gray-600">
                Check your analytics
              </div>

            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
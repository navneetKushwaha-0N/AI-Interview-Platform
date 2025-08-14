"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import {
  FiTrendingUp,
  FiAward,
  FiClock,
  FiTarget,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import axios from "axios"
import toast from "react-hot-toast"

const Progress = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [interviews, setInterviews] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchData()
  }, [currentPage])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [analyticsRes, progressRes, leaderboardRes] = await Promise.all([
        axios.get("/progress/analytics"),
        axios.get(`/progress?page=${currentPage}&limit=10`),
        axios.get("/progress/leaderboard?limit=10"),
      ])

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics)
      }

      if (progressRes.data.success) {
        setInterviews(progressRes.data.data.interviews)
        setPagination(progressRes.data.data.pagination)
      }

      if (leaderboardRes.data.success) {
        setLeaderboard(leaderboardRes.data.leaderboard)
      }
    } catch (error) {
      toast.error("Failed to fetch progress data")
      console.error("Error fetching progress data:", error)
    } finally {
      setLoading(false)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Chart colors
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

  if (loading && !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Dashboard</h1>
        <p className="text-gray-600">Track your interview preparation journey and performance</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", name: "Overview", icon: FiTrendingUp },
              { id: "history", name: "Interview History", icon: FiClock },
              { id: "leaderboard", name: "Leaderboard", icon: FiUsers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && analytics && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FiTarget className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.totalAttempts || 0}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.averageScore || 0}/10</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Best Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.domainStats.length > 0 ? Math.max(...analytics.domainStats.map((d) => d.bestScore)) : 0}
                    /10
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.monthlyProgress.length > 0
                      ? analytics.monthlyProgress[analytics.monthlyProgress.length - 1]?.totalAttempts || 0
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Performance by Domain */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Domain</h3>
              {analytics.domainStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.domainStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="domain" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available. Start practicing to see your progress!
                </div>
              )}
            </div>

            {/* Performance by Difficulty */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Difficulty</h3>
              {analytics.difficultyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.difficultyStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ difficulty, averageScore }) => `${difficulty}: ${averageScore.toFixed(1)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="averageScore"
                    >
                      {analytics.difficultyStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available. Start practicing to see your progress!
                </div>
              )}
            </div>

            {/* Recent Performance Trend */}
            <div className="card lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Performance Trend</h3>
              {analytics.recentTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.recentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="createdAt" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis domain={[0, 10]} />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [value, "Score"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available. Complete more interviews to see your trend!
                </div>
              )}
            </div>

            {/* Monthly Progress */}
            {analytics.monthlyProgress.length > 0 && (
              <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="totalAttempts"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interview History Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Interview History</h3>
              <div className="text-sm text-gray-600">{pagination.totalInterviews} total interviews</div>
            </div>

            {interviews.length > 0 ? (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <div key={interview._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{interview.domain}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(interview.difficulty)}`}>
                          {interview.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-lg font-bold ${getScoreColor(interview.score)}`}>
                          {interview.score}/10
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(interview.createdAt)}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Question:</strong> {interview.question.substring(0, 150)}
                      {interview.question.length > 150 && "..."}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Time spent: {formatTime(interview.timeSpent)}</span>
                      <span>Answer length: {interview.userAnswer.length} characters</span>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <FiChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No interviews completed yet. Start practicing to build your history!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <div className="text-sm text-gray-600">Minimum 5 attempts required</div>
            </div>

            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      entry.isCurrentUser ? "bg-primary-50 border-2 border-primary-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          entry.rank === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : entry.rank === 2
                              ? "bg-gray-100 text-gray-800"
                              : entry.rank === 3
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {entry.name}
                          {entry.isCurrentUser && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{entry.totalAttempts} attempts</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{entry.averageScore}/10</div>
                      <div className="text-sm text-gray-600">avg score</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No leaderboard data available yet. Complete more interviews to see rankings!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Progress



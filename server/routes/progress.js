import express from "express"
import { protect } from "../middlewares/auth.js"
import Interview from "../models/Interview.js"
import User from "../models/User.js"

const router = express.Router()

// @desc    Get user progress/history
// @route   GET /api/progress
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Get user's interview history
    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-userId")

    // Get total count for pagination
    const totalInterviews = await Interview.countDocuments({ userId: req.user._id })

    // Get user stats
    const user = await User.findById(req.user._id).select("-password")

    res.json({
      success: true,
      data: {
        interviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalInterviews / limit),
          totalInterviews,
          hasNext: page < Math.ceil(totalInterviews / limit),
          hasPrev: page > 1,
        },
        userStats: {
          totalAttempts: user.totalAttempts,
          totalScore: user.totalScore,
          averageScore: user.averageScore,
        },
      },
    })
  } catch (error) {
    console.error("Get progress error:", error)
    res.status(500).json({ message: "Failed to fetch progress data" })
  }
})

// @desc    Get progress analytics
// @route   GET /api/progress/analytics
// @access  Private
router.get("/analytics", protect, async (req, res) => {
  try {
    const userId = req.user._id

    // Get performance by domain
    const domainStats = await Interview.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$domain",
          averageScore: { $avg: "$score" },
          totalAttempts: { $sum: 1 },
          bestScore: { $max: "$score" },
        },
      },
      { $sort: { averageScore: -1 } },
    ])

    // Get performance by difficulty
    const difficultyStats = await Interview.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$difficulty",
          averageScore: { $avg: "$score" },
          totalAttempts: { $sum: 1 },
        },
      },
    ])

    // Get recent performance trend (last 10 interviews)
    const recentTrend = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("score createdAt domain difficulty")

    // Get monthly progress
    const monthlyProgress = await Interview.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          averageScore: { $avg: "$score" },
          totalAttempts: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }, // Last 12 months
    ])

    res.json({
      success: true,
      analytics: {
        domainStats: domainStats.map((stat) => ({
          domain: stat._id,
          averageScore: Math.round(stat.averageScore * 100) / 100,
          totalAttempts: stat.totalAttempts,
          bestScore: stat.bestScore,
        })),
        difficultyStats: difficultyStats.map((stat) => ({
          difficulty: stat._id,
          averageScore: Math.round(stat.averageScore * 100) / 100,
          totalAttempts: stat.totalAttempts,
        })),
        recentTrend: recentTrend.reverse(),
        monthlyProgress: monthlyProgress.map((month) => ({
          month: `${month._id.year}-${month._id.month.toString().padStart(2, "0")}`,
          averageScore: Math.round(month.averageScore * 100) / 100,
          totalAttempts: month.totalAttempts,
        })),
      },
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    res.status(500).json({ message: "Failed to fetch analytics data" })
  }
})

// @desc    Get leaderboard
// @route   GET /api/progress/leaderboard
// @access  Private
router.get("/leaderboard", protect, async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 10

    // Get top users by average score (minimum 5 attempts)
    const leaderboard = await User.find({
      totalAttempts: { $gte: 5 },
    })
      .select("name averageScore totalAttempts totalScore")
      .sort({ averageScore: -1, totalAttempts: -1 })
      .limit(limit)

    // Find current user's rank
    const currentUserRank =
      (await User.countDocuments({
        totalAttempts: { $gte: 5 },
        $or: [
          { averageScore: { $gt: req.user.averageScore } },
          {
            averageScore: req.user.averageScore,
            totalAttempts: { $gt: req.user.totalAttempts },
          },
        ],
      })) + 1

    res.json({
      success: true,
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        averageScore: user.averageScore,
        totalAttempts: user.totalAttempts,
        isCurrentUser: user._id.toString() === req.user._id.toString(),
      })),
      currentUserRank: req.user.totalAttempts >= 5 ? currentUserRank : null,
    })
  } catch (error) {
    console.error("Get leaderboard error:", error)
    res.status(500).json({ message: "Failed to fetch leaderboard data" })
  }
})

export default router

import mongoose from "mongoose"

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    domain: {
      type: String,
      required: true,
      enum: ["JavaScript", "React", "Node.js", "SQL", "Data Science", "Marketing", "Python", "System Design"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    question: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    aiFeedback: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
interviewSchema.index({ userId: 1, createdAt: -1 })
interviewSchema.index({ domain: 1, difficulty: 1 })

export default mongoose.model("Interview", interviewSchema)

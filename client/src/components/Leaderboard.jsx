"use client"

import { FiTrophy, FiUsers } from "react-icons/fi"

const Leaderboard = ({ leaderboard, currentUserRank }) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return rank
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiTrophy className="w-5 h-5 mr-2 text-yellow-500" />
          Leaderboard
        </h3>
        <div className="text-sm text-gray-600 flex items-center">
          <FiUsers className="w-4 h-4 mr-1" />
          {leaderboard.length} users
        </div>
      </div>

      {leaderboard.length > 0 ? (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                entry.isCurrentUser ? "bg-primary-50 border-2 border-primary-200" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getRankIcon(entry.rank)}</div>
                <div>
                  <div className="font-medium text-gray-900">
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">You</span>
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

          {currentUserRank && !leaderboard.some((entry) => entry.isCurrentUser) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                Your rank: #{currentUserRank} (Complete more interviews to climb the leaderboard!)
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No leaderboard data available yet. Complete interviews to see rankings!
        </div>
      )}
    </div>
  )
}

export default Leaderboard

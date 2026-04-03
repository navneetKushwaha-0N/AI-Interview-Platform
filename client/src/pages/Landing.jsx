"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  FiArrowRight,
  FiZap,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiCode,
  FiDatabase,
  FiServer,
  FiCloud,
} from "react-icons/fi"
import { motion } from "framer-motion"

const Landing = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: FiZap,
      title: "AI-Powered Questions",
      description:
        "Get tailored interview questions from advanced AI based on your domain and difficulty level.",
    },
    {
      icon: FiTarget,
      title: "Instant Feedback",
      description:
        "Receive clear, detailed AI feedback with scoring and actionable tips.",
    },
    {
      icon: FiTrendingUp,
      title: "Progress Tracking",
      description:
        "Track your improvement with rich analytics and performance charts.",
    },
    {
      icon: FiUsers,
      title: "Competitive Learning",
      description:
        "See how you rank on the leaderboard and stay motivated.",
    },
  ]

  const domains = [
    { icon: FiCode, title: "Frontend", color: "from-pink-500 to-rose-500" },
    { icon: FiServer, title: "Backend", color: "from-indigo-500 to-purple-500" },
    { icon: FiDatabase, title: "Database", color: "from-green-500 to-emerald-500" },
    { icon: FiCloud, title: "Cloud & DevOps", color: "from-blue-500 to-cyan-500" },
  ]

  const handleSelectDomain = (domain) => {
    console.log("Selected domain:", domain)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">

      {/* HERO */}
      <section className="relative py-28">

        {/* Glow background */}
        <div className="absolute top-10 left-20 w-72 h-72 bg-purple-500/30 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-pink-500/30 blur-3xl rounded-full"></div>

        <div className="relative max-w-6xl mx-auto px-6">

          <div className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-14 text-center">

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold mb-6"
            >
              Master Your{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Next Interview
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-700 max-w-2xl mx-auto mb-10"
            >
              AI generated questions, instant feedback and personalized learning paths to make you interview ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-amber-400/40 hover:scale-105 transition flex items-center"
                >
                  Go to Dashboard
                  <FiArrowRight className="ml-2" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-amber-400/40 hover:scale-105 transition flex items-center"
                  >
                    Start Practicing
                    <FiArrowRight className="ml-2" />
                  </Link>

                  <Link
                    to="/login"
                    className="backdrop-blur-lg bg-white/30 border border-white/40 px-8 py-3 rounded-xl hover:bg-white/40 transition"
                  >
                    Login
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Us
            </h2>

            <p className="text-gray-600">
              A modern platform combining AI innovation with proven preparation methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {features.map((feature, index) => (

              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl p-7 shadow-lg hover:shadow-2xl transition"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="text-indigo-600 w-6 h-6" />
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>

            ))}

          </div>
        </div>
      </section>

      {/* DOMAIN SECTION */}
      <section className="py-24 bg-gray-50">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-4">
            Choose Your Domain
          </h2>

          <p className="text-gray-600 mb-14">
            Select a domain to get AI powered interview questions tailored for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

            {domains.map((domain, index) => (

              <motion.div
                key={domain.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectDomain(domain.title)}
                className={`cursor-pointer bg-gradient-to-br ${domain.color} p-[1px] rounded-2xl shadow-xl`}
              >

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 h-full flex flex-col items-center hover:bg-white/90 transition">

                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <domain.icon className="text-gray-800 w-6 h-6" />
                  </div>

                  <h3 className="font-semibold text-lg">
                    {domain.title}
                  </h3>

                </div>

              </motion.div>

            ))}

          </div>
        </div>

      </section>

      {/* CTA */}
      <section className="py-24 relative">

        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-90"></div>

        <div className="relative max-w-4xl mx-auto px-6">

          <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl p-14 text-center shadow-2xl">

            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Ace Your Interview
            </h2>

            <p className="text-gray-200 mb-8">
              Join thousands of developers leveling up with AI powered preparation.
            </p>

            {!user && (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition inline-flex items-center"
              >
                Get Started Free
                <FiArrowRight className="ml-2" />
              </Link>
            )}

          </div>

        </div>

      </section>

    </div>
  )
}

export default Landing
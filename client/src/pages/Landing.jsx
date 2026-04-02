"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FiArrowRight, FiZap, FiTarget, FiTrendingUp, FiUsers, FiCode, FiDatabase, FiServer, FiCloud } from "react-icons/fi"
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
    // Add navigation or domain-specific logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          >
            Master Your <span className="text-amber-300">Next Interview</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-8"
          >
            AI-generated questions, instant feedback, and personalized learning paths to make you interview-ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3 rounded-lg shadow-lg flex items-center justify-center transition-transform hover:scale-105"
              >
                Go to Dashboard
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3 rounded-lg shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                >
                  Start Practicing
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="bg-white/20 backdrop-blur-lg border border-white/40 text-white hover:bg-white/30 px-8 py-3 rounded-lg shadow-md transition-transform hover:scale-105"
                >
                  Login
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A modern platform combining AI innovation with proven preparation methods.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white backdrop-blur-lg border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Domain */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Choose Your Domain
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Select a domain to get AI-powered interview questions tailored just for you.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectDomain(domain.title)}
                className={`cursor-pointer bg-gradient-to-br ${domain.color} p-[1px] rounded-2xl shadow-lg`}
              >
                <div className="bg-white rounded-2xl p-6 flex flex-col items-center h-full hover:bg-white/80 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                    <domain.icon className="w-7 h-7 text-gray-800" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{domain.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 skew-y-3 transform origin-bottom-left" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Ace Your Interview?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-100 mb-8"
          >
            Join thousands of developers leveling up with AI-powered preparation.
          </motion.p>
          {!user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                to="/signup"
                className="bg-amber-400 text-gray-900 hover:bg-amber-500 font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform hover:scale-105 inline-flex items-center"
              >
                Get Started Free
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Landing

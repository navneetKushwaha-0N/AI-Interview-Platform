import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import { motion } from "framer-motion"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      navigate("/dashboard")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">

      {/* Glow Background Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/30 blur-3xl rounded-full"></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-md w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8"
      >

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-300">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email address
            </label>

            <div className="relative">

              <FiMail className="absolute left-3 top-3 text-gray-400" />

              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />

            </div>
          </div>


          {/* Password */}
          <div>

            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>

            <div className="relative">

              <FiLock className="absolute left-3 top-3 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>

            </div>

          </div>


          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-pink-500/40 hover:scale-[1.02] transition-all disabled:opacity-50"
          >

            {isLoading ? (
              <div className="flex items-center justify-center">

                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>

                Signing in...

              </div>
            ) : (
              "Sign In"
            )}

          </button>


          {/* Signup */}
          <p className="text-center text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-pink-400 hover:text-pink-300 font-medium"
            >
              Sign up here
            </Link>
          </p>

        </form>

      </motion.div>

    </div>
  )
}

export default Login
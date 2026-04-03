import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import { motion } from "framer-motion"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    const result = await signup(
      formData.name,
      formData.email,
      formData.password
    )

    if (result.success) {
      navigate("/dashboard")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-black overflow-hidden">

      {/* glow blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/30 blur-3xl rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-md w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-7"
      >

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="text-gray-300 mt-2">
            Start your interview preparation journey
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-300">
              Full name
            </label>

            <div className="relative mt-1">

              <FiUser className="absolute left-3 top-3 text-gray-400"/>

              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />

            </div>

            {errors.name && (
              <p className="text-red-400 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>


          {/* Email */}
          <div>

            <label className="text-sm text-gray-300">
              Email
            </label>

            <div className="relative mt-1">

              <FiMail className="absolute left-3 top-3 text-gray-400"/>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />

            </div>

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}

          </div>


          {/* Password */}
          <div>

            <label className="text-sm text-gray-300">
              Password
            </label>

            <div className="relative mt-1">

              <FiLock className="absolute left-3 top-3 text-gray-400"/>

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff/> : <FiEye/>}
              </button>

            </div>

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}

          </div>


          {/* Confirm Password */}
          <div>

            <label className="text-sm text-gray-300">
              Confirm Password
            </label>

            <div className="relative mt-1">

              <FiLock className="absolute left-3 top-3 text-gray-400"/>

              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <FiEyeOff/> : <FiEye/>}
              </button>

            </div>

            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}

          </div>


          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-pink-500/40 hover:scale-[1.02] transition"
          >

            {isLoading ? (
              <div className="flex items-center justify-center">

                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>

                Creating account...

              </div>
            ) : (
              "Create account"
            )}

          </button>


          {/* Login link */}
          <p className="text-center text-gray-300 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-400 hover:text-pink-300"
            >
              Sign in
            </Link>
          </p>

        </form>

      </motion.div>

    </div>
  )
}

export default Signup
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useState } from "react"
import { FiUser, FiLogOut, FiHome, FiBarChart, FiMenu, FiX } from "react-icons/fi"

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">

      {/* Glass highlight layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:scale-105 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold">AI</span>
            </div>

            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Interview Prep
            </span>
          </Link>


          {/* Mobile Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-white/20 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={22}/> : <FiMenu size={22}/>}
          </button>


          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">

            {user ? (
              <>

                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive("/dashboard")
                      ? "bg-white/30 text-indigo-700 backdrop-blur-lg"
                      : "text-gray-700 hover:bg-white/20"
                  }`}
                >
                  <FiHome/>
                  <span>Dashboard</span>
                </Link>


                {/* Progress */}
                <Link
                  to="/progress"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive("/progress")
                      ? "bg-white/30 text-indigo-700 backdrop-blur-lg"
                      : "text-gray-700 hover:bg-white/20"
                  }`}
                >
                  <FiBarChart/>
                  <span>Progress</span>
                </Link>


                {/* User */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">

                  <div className="flex items-center space-x-2">

                    <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40">
                      <FiUser className="text-white text-sm"/>
                    </div>

                    <span className="text-sm font-medium text-gray-800">
                      {user.name}
                    </span>

                  </div>


                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/20 rounded-lg transition"
                  >
                    <FiLogOut/>
                    <span>Logout</span>
                  </button>

                </div>

              </>
            ) : (

              <div className="flex items-center space-x-3">

                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                >
                  Login
                </Link>


                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-indigo-500/40 hover:scale-105 transition"
                >
                  Sign Up
                </Link>

              </div>

            )}

          </div>
        </div>
      </div>


      {/* Mobile Menu */}
      {isOpen && (

        <div className="lg:hidden backdrop-blur-2xl bg-white/20 border-t border-white/20 px-4 py-3 space-y-2 shadow-lg">

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-white/20"
              >
                Dashboard
              </Link>

              <Link
                to="/progress"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-white/20"
              >
                Progress
              </Link>

              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-white/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-white/20"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>

      )}

    </nav>
  )
}

export default Navbar
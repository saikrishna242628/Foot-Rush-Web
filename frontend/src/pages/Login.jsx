import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/login', { email, password })
      login(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(from)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@footrush.com')
      setPassword('admin123')
    } else {
      setEmail('customer@example.com')
      setPassword('customer123')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 page-enter">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="Foot Rush" className="h-20 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to your Foot Rush account</p>
        </div>

        {/* Demo credentials */}
        <div className="bg-amber-50 border border-amber-200 p-4 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">Demo Accounts:</p>
          <div className="flex gap-2">
            <button
              onClick={() => fillDemo('customer')}
              className="flex-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 px-3 font-semibold transition-colors"
            >
              Customer Login
            </button>
            <button
              onClick={() => fillDemo('admin')}
              className="flex-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 px-3 font-semibold transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-gray-500 hover:text-black underline">Forgot password?</a>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-black font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

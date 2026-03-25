import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiSettings, FiHeart } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const { wishlistItems } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUserDropdown(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-black text-white text-center text-xs py-2 tracking-widest">
        FREE SHIPPING ON ORDERS OVER $100 | USE CODE: FOOTRUSH10 FOR 10% OFF
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.png" alt="Foot Rush" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors ${isActive('/') ? 'border-b-2 border-black' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors ${isActive('/products') ? 'border-b-2 border-black' : ''}`}
            >
              Shop
            </Link>
            {['Running', 'Sneakers', 'Basketball', 'Boots'].map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors text-gray-600"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search + Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 focus-within:border-black transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search shoes..."
                className="text-sm px-3 py-2 outline-none w-40 lg:w-56"
              />
              <button type="submit" className="px-3 py-2 hover:bg-gray-100">
                <FiSearch size={16} />
              </button>
            </form>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 transition-colors">
              <FiHeart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 transition-colors">
              <FiShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <FiPackage size={16} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <FiSettings size={16} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                    >
                      <FiLogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
                <FiUser size={16} /> Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center border border-gray-300">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search shoes..."
                className="text-sm px-3 py-2 outline-none flex-1"
              />
              <button type="submit" className="px-3 py-2">
                <FiSearch size={16} />
              </button>
            </form>

            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Shop All' },
              { to: '/products?category=Running', label: 'Running' },
              { to: '/products?category=Sneakers', label: 'Sneakers' },
              { to: '/products?category=Basketball', label: 'Basketball' },
              { to: '/products?category=Boots', label: 'Boots' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium tracking-wider uppercase py-2 border-b border-gray-100 hover:text-gray-500"
              >
                {label}
              </Link>
            ))}

            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 font-medium py-2">
                <FiLogOut size={16} /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm font-medium py-2">
                Login / Sign Up
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {userDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setUserDropdown(false)} />
      )}
    </nav>
  )
}

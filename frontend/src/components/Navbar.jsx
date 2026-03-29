import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useLanguage } from '../context/LanguageContext'
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiSettings, FiHeart, FiGlobe, FiChevronDown } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const { wishlistItems } = useWishlist()
  const { lang, changeLang, t, languages } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [langDropdown, setLangDropdown] = useState(false)
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
  const currentLang = languages.find(l => l.code === lang)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-black text-white text-center text-xs py-2 tracking-widest">
        FREE SHIPPING ON ORDERS OVER ₹8,400 | USE CODE: FOOTRUSH10 FOR 10% OFF
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">

          {/* Logo — larger */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.png" alt="Foot Rush" className="h-28 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors ${isActive('/') ? 'border-b-2 border-black' : ''}`}>
              {t.home}
            </Link>
            <Link to="/products" className={`text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors ${isActive('/products') ? 'border-b-2 border-black' : ''}`}>
              {t.shop}
            </Link>
            {[
              { label: t.running, cat: 'Running' },
              { label: t.sneakers, cat: 'Sneakers' },
              { label: t.basketball, cat: 'Basketball' },
              { label: t.boots, cat: 'Boots' },
            ].map(({ label, cat }) => (
              <Link key={cat} to={`/products?category=${cat}`}
                className="text-sm font-medium tracking-wider uppercase hover:text-gray-500 transition-colors text-gray-600">
                {label}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 focus-within:border-black transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="text-sm px-3 py-2 outline-none w-32 lg:w-44"
              />
              <button type="submit" className="px-3 py-2 hover:bg-gray-100">
                <FiSearch size={16} />
              </button>
            </form>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => { setLangDropdown(!langDropdown); setUserDropdown(false) }}
                className="flex items-center gap-1 p-2 hover:bg-gray-100 transition-colors text-sm font-medium"
                title="Change language"
              >
                <FiGlobe size={20} />
                <span className="hidden sm:inline text-lg">{currentLang?.flag}</span>
                <FiChevronDown size={12} className={`transition-transform ${langDropdown ? 'rotate-180' : ''}`} />
              </button>

              {langDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-xl z-50">
                  <p className="text-xs font-bold uppercase tracking-widest px-4 py-2 text-gray-400 border-b border-gray-100">
                    Language
                  </p>
                  {languages.map(language => (
                    <button
                      key={language.code}
                      onClick={() => { changeLang(language.code); setLangDropdown(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${lang === language.code ? 'font-bold bg-gray-50' : ''}`}
                    >
                      <span className="text-xl">{language.flag}</span>
                      <span>{language.label}</span>
                      {lang === language.code && <span className="ml-auto w-2 h-2 rounded-full bg-black" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                  onClick={() => { setUserDropdown(!userDropdown); setLangDropdown(false) }}
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
                    <Link to="/orders" onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                      <FiPackage size={16} /> {t.myOrders}
                    </Link>
                    <Link to="/wishlist" onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                      <FiHeart size={16} /> {t.wishlist}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                        <FiSettings size={16} /> {t.adminPanel}
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors w-full text-left text-red-600">
                      <FiLogOut size={16} /> {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-2 text-sm font-medium border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
                <FiUser size={16} /> {t.login}
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="lg:hidden p-2 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-3">
            <form onSubmit={handleSearch} className="flex items-center border border-gray-300">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder} className="text-sm px-3 py-2 outline-none flex-1" />
              <button type="submit" className="px-3 py-2"><FiSearch size={16} /></button>
            </form>
            {[
              { to: '/', label: t.home },
              { to: '/products', label: t.shop },
              { to: '/products?category=Running', label: t.running },
              { to: '/products?category=Sneakers', label: t.sneakers },
              { to: '/products?category=Basketball', label: t.basketball },
              { to: '/products?category=Boots', label: t.boots },
              { to: '/wishlist', label: t.wishlist },
            ].map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium tracking-wider uppercase py-2 border-b border-gray-100 hover:text-gray-500">
                {label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 font-medium py-2">
                <FiLogOut size={16} /> {t.logout}
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm font-medium py-2">
                {t.login} / {t.signup}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Close dropdowns on outside click */}
      {(userDropdown || langDropdown) && (
        <div className="fixed inset-0 z-40" onClick={() => { setUserDropdown(false); setLangDropdown(false) }} />
      )}
    </nav>
  )
}

import { Link } from 'react-router-dom'
import { formatINR } from '../utils/currency'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [selectedSizes, setSelectedSizes] = useState({})

  const handleMoveToCart = async (product) => {
    const sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes
    const size = selectedSizes[product.id] || sizes?.[Math.floor(sizes.length / 2)] || '9'
    const success = await addToCart(product.id, 1, size)
    if (success) removeFromWishlist(product.id)
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center page-enter">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiHeart size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-black uppercase mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8">Save items you love and come back to them anytime.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Browse Products <FiArrowRight />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-1">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
        </div>
        <Link to="/products" className="btn-secondary text-xs py-2 px-4 hidden sm:block">
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(product => {
          const sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : (product.sizes || [])
          return (
            <div key={product.id} className="border border-gray-200 bg-white group">
              {/* Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://via.placeholder.com/400x400/f5f5f5/333?text=Shoe' }}
                  />
                </Link>

                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 tracking-widest uppercase">
                  {product.category}
                </span>

                {/* Remove from wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <FiHeart size={16} className="fill-red-500 text-red-500" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-sm mb-1 hover:text-gray-500 transition-colors truncate">
                    {product.name}
                  </h3>
                </Link>
                <p className="font-black text-lg mb-3">{formatINR(parseFloat(product.price))}</p>

                {/* Size selector */}
                {sizes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Select Size</p>
                    <div className="flex flex-wrap gap-1">
                      {sizes.slice(0, 6).map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                          className={`text-xs px-2 py-1 border transition-all ${
                            selectedSizes[product.id] === size
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 hover:border-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 bg-black text-white py-2 text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
                  >
                    <FiShoppingBag size={13} /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-9 border border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Continue Shopping <FiArrowRight />
        </Link>
      </div>
    </div>
  )
}

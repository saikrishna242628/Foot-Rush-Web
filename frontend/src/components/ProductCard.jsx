import { Link } from 'react-router-dom'
import { FiStar, FiShoppingBag, FiHeart } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatINR } from '../utils/currency'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  const sizes = typeof product.sizes === 'string'
    ? JSON.parse(product.sizes)
    : product.sizes

  const handleQuickAdd = async (e) => {
    e.preventDefault()
    const defaultSize = sizes?.length ? sizes[Math.floor(sizes.length / 2)] : '9'
    await addToCart(product.id, 1, defaultSize)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product)
  }

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="card-hover border border-gray-100 bg-white overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => {
              e.target.onerror = null
              e.target.src = `https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80`
            }}
          />

          {/* Category badge */}
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 tracking-widest uppercase">
            {product.category}
          </span>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center shadow hover:scale-110 transition-transform"
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart
              size={16}
              className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}
            />
          </button>

          {/* Quick add on hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-center text-xs font-bold tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleQuickAdd} className="flex items-center justify-center gap-2 w-full">
              <FiShoppingBag size={14} /> Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'fill-black text-black' : 'text-gray-300'}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-black">{formatINR(product.price)}</span>
            {product.stock < 10 && (
              <span className="text-xs text-red-500 font-medium">Only {product.stock} left</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

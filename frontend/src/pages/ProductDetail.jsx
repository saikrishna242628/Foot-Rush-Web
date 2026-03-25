import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { FiStar, FiShoppingBag, FiHeart, FiTruck, FiArrowLeft, FiRefreshCw, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/products/${id}`)
      .then(async res => {
        setProduct(res.data)
        setSelectedSize('')
        // Fetch related
        const related = await axios.get(`/api/products?category=${res.data.category}`)
        setRelatedProducts(related.data.filter(p => p.id !== res.data.id).slice(0, 4))
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size first')
      return
    }
    setAdding(true)
    await addToCart(product.id, quantity, selectedSize)
    setAdding(false)
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="animate-pulse bg-gray-200 aspect-square" />
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 w-3/4" />
          <div className="h-4 bg-gray-200 w-1/2" />
          <div className="h-6 bg-gray-200 w-1/4" />
          <div className="h-32 bg-gray-200" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Product not found</h2>
      <Link to="/products" className="btn-primary">Back to Shop</Link>
    </div>
  )

  const sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-black">Shop</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-black">{product.category}</Link>
        <span>/</span>
        <span className="text-black font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 overflow-hidden border border-gray-100">
            <img
              src={imgError ? 'https://via.placeholder.com/600x600/f5f5f5/333?text=Shoe' : product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-bold tracking-widest uppercase bg-black text-white px-2 py-1">
              {product.category}
            </span>
            <button className="p-2 hover:bg-gray-100">
              <FiHeart size={20} />
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-4 mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-black text-black' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm font-semibold">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="text-4xl font-black mb-6">${product.price.toFixed(2)}</div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8 text-sm">{product.description}</p>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm tracking-wider uppercase">Select Size</h3>
              <button className="text-xs underline text-gray-500 hover:text-black">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm font-semibold border-2 transition-all ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-bold text-sm tracking-wider uppercase mb-3">Quantity</h3>
            <div className="flex items-center border border-gray-300 w-fit">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          {product.stock < 10 && (
            <p className="text-red-500 text-sm mb-4 font-medium">
              ⚠ Only {product.stock} left in stock!
            </p>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
          >
            <FiShoppingBag size={18} />
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            {[
              { icon: FiTruck, label: 'Free Shipping', sub: 'Over $100' },
              { icon: FiRefreshCw, label: '30-Day Returns', sub: 'Easy process' },
              { icon: FiShield, label: '2yr Warranty', sub: 'Full coverage' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="mx-auto mb-2" />
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-black tracking-tight uppercase mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="group block border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = 'https://via.placeholder.com/300x300/f5f5f5/333?text=Shoe' }}
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <p className="font-black">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

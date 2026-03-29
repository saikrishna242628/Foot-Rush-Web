import { Link, useNavigate } from 'react-router-dom'
import { formatINR } from '../utils/currency'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiTrash2, FiArrowRight, FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi'

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, cartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const shipping = cartTotal >= 100 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center page-enter">
        <FiShoppingBag size={64} className="mx-auto mb-6 text-gray-300" />
        <h2 className="text-2xl font-black mb-4 uppercase">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <h1 className="section-title mb-8">Shopping Cart ({cartItems.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-4 border border-gray-200 p-4">
              <Link to={`/products/${item.product_id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover bg-gray-50 flex-shrink-0"
                  onError={e => { e.target.src = 'https://via.placeholder.com/100x100/f5f5f5/333?text=Shoe' }}
                />
              </Link>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/products/${item.product_id}`} className="font-semibold hover:text-gray-600 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Size: <span className="font-medium text-black">{item.size}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Category: <span className="font-medium text-black">{item.category}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity Control */}
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-lg">{formatINR((item.price * item.quantity))}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">{formatINR(item.price)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/products" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mt-4">
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-black uppercase tracking-wider mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold">{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                  {shipping === 0 ? 'FREE' : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Tax (8%)</span>
                <span className="font-semibold">{formatINR(tax)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="bg-gray-50 border border-gray-200 p-3 text-xs text-center mb-4 text-gray-600">
                Add <span className="font-bold text-black">{formatINR((100 - cartTotal))}</span> more for FREE shipping
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between font-black text-xl">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
                <button className="border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <button
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
              className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'} <FiArrowRight />
            </button>

            {/* Payment icons */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              {['VISA', 'MC', 'AMEX', 'PayPal'].map(card => (
                <span key={card} className="border border-gray-200 px-2 py-1">{card}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

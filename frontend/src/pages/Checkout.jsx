import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiLock, FiCheck } from 'react-icons/fi'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: user?.name || '',
  })

  const shippingCost = cartTotal >= 100 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shippingCost + tax

  const handleShippingChange = (e) => {
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validateShipping = () => {
    const { name, email, address, city, state, zip } = shipping
    if (!name || !email || !address || !city || !state || !zip) {
      toast.error('Please fill all shipping fields')
      return false
    }
    return true
  }

  const validatePayment = () => {
    const { cardNumber, expiry, cvv, nameOnCard } = payment
    if (!cardNumber || !expiry || !cvv || !nameOnCard) {
      toast.error('Please fill all payment fields')
      return false
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Invalid card number')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        })),
        shipping,
        total,
        payment_intent_id: `demo_${Date.now()}`,
      }

      const { data } = await axios.post('/api/orders', orderData)
      setOrderId(data.id)
      setOrderPlaced(true)
      toast.success('Order placed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart')
    return null
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center page-enter">
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck size={36} />
        </div>
        <h1 className="text-3xl font-black uppercase mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">Thank you, <span className="font-semibold text-black">{user?.name}</span>!</p>
        <p className="text-gray-500 mb-6">Your order #{orderId} has been placed successfully.</p>
        <p className="text-sm text-gray-400 mb-8">
          A confirmation email will be sent to <strong>{shipping.email}</strong>
        </p>
        <div className="bg-gray-50 border border-gray-200 p-4 mb-8 text-left">
          <h3 className="font-bold mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Items:</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span><span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-black border-t border-gray-200 pt-2 mt-2">
              <span>Total:</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/orders')} className="btn-primary">View My Orders</button>
          <button onClick={() => navigate('/products')} className="btn-secondary">Continue Shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold border-2 ${i < step ? 'bg-black text-white border-black' : i === step ? 'border-black text-black' : 'border-gray-300 text-gray-400'}`}>
                {i < step ? <FiCheck size={14} /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${i < step ? 'bg-black' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-black uppercase tracking-wider mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Full Name *</label>
                  <input name="name" value={shipping.name} onChange={handleShippingChange}
                    className="input-field" placeholder="John Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Email *</label>
                  <input name="email" value={shipping.email} onChange={handleShippingChange}
                    type="email" className="input-field" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Street Address *</label>
                  <input name="address" value={shipping.address} onChange={handleShippingChange}
                    className="input-field" placeholder="123 Main Street, Apt 4B" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">City *</label>
                  <input name="city" value={shipping.city} onChange={handleShippingChange}
                    className="input-field" placeholder="New York" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">State *</label>
                  <input name="state" value={shipping.state} onChange={handleShippingChange}
                    className="input-field" placeholder="NY" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">ZIP Code *</label>
                  <input name="zip" value={shipping.zip} onChange={handleShippingChange}
                    className="input-field" placeholder="10001" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Country</label>
                  <select name="country" value={shipping.country} onChange={handleShippingChange} className="input-field">
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => validateShipping() && setStep(1)}
                className="btn-primary w-full mt-6"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider mb-6">Payment Details</h2>

              <div className="bg-blue-50 border border-blue-200 p-4 mb-6 flex items-center gap-3">
                <FiLock size={16} className="text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  <strong>Demo Mode:</strong> Use any card numbers for testing. No real payment will be processed.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Name on Card *</label>
                  <input
                    value={payment.nameOnCard}
                    onChange={e => setPayment(p => ({ ...p, nameOnCard: e.target.value }))}
                    className="input-field" placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Card Number *</label>
                  <input
                    value={payment.cardNumber}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val
                      setPayment(p => ({ ...p, cardNumber: formatted }))
                    }}
                    className="input-field font-mono" placeholder="1234 5678 9012 3456" maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Expiry Date *</label>
                    <input
                      value={payment.expiry}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2)
                        setPayment(p => ({ ...p, expiry: val }))
                      }}
                      className="input-field font-mono" placeholder="MM/YY" maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">CVV *</label>
                    <input
                      value={payment.cvv}
                      onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      className="input-field font-mono" placeholder="123" maxLength={4} type="password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(0)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => validatePayment() && setStep(2)} className="btn-primary flex-1">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider mb-6">Review Your Order</h2>

              {/* Shipping summary */}
              <div className="border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Shipping To</h3>
                  <button onClick={() => setStep(0)} className="text-xs underline text-gray-500 hover:text-black">Edit</button>
                </div>
                <p className="text-sm text-gray-600">{shipping.name}</p>
                <p className="text-sm text-gray-600">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                <p className="text-sm text-gray-600">{shipping.email}</p>
              </div>

              {/* Payment summary */}
              <div className="border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Payment</h3>
                  <button onClick={() => setStep(1)} className="text-xs underline text-gray-500 hover:text-black">Edit</button>
                </div>
                <p className="text-sm text-gray-600">Card ending in {payment.cardNumber.slice(-4)}</p>
              </div>

              {/* Items */}
              <div className="border border-gray-200 p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Items ({cartItems.length})</h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover bg-gray-100"
                        onError={e => { e.target.src = 'https://via.placeholder.com/50?text=Shoe' }} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-70"
                >
                  {loading ? 'Placing Order...' : `Place Order · $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 p-6 sticky top-24">
            <h3 className="font-black uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover bg-gray-100"
                      onError={e => { e.target.src = 'https://via.placeholder.com/40?text=Shoe' }} />
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-base border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

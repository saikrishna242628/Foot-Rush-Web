import { useState, useEffect } from 'react'
import { formatINR } from '../utils/currency'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    axios.get('/api/orders')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse border border-gray-200 p-6 mb-4">
          <div className="h-4 bg-gray-200 w-1/4 mb-3" />
          <div className="h-4 bg-gray-200 w-1/2" />
        </div>
      ))}
    </div>
  )

  if (orders.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center page-enter">
      <FiPackage size={64} className="mx-auto mb-6 text-gray-300" />
      <h2 className="text-2xl font-black uppercase mb-4">No Orders Yet</h2>
      <p className="text-gray-500 mb-8">Start shopping to see your orders here.</p>
      <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <h1 className="section-title mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-black text-lg">Order #{order.id}</span>
                    <span className={`text-xs font-bold uppercase px-2 py-1 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-black text-xl">{formatINR(parseFloat(order.total))}</p>
                  </div>
                  {expanded === order.id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </div>
              </div>

              {/* Quick preview of items */}
              {order.items && (
                <div className="flex items-center gap-2 mt-3">
                  {order.items.slice(0, 4).map(item => (
                    <img
                      key={item.id}
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover bg-gray-100 border border-gray-200"
                      onError={e => { e.target.src = 'https://via.placeholder.com/40?text=Shoe' }}
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Details */}
            {expanded === order.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Items */}
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Items Ordered</h3>
                    <div className="space-y-3">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover bg-white border border-gray-200"
                            onError={e => { e.target.src = 'https://via.placeholder.com/56?text=Shoe' }}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                            <p className="text-sm font-bold">{formatINR((item.price * item.quantity))}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Summary */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Shipping Address</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-semibold text-black">{order.shipping_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                        <p>{order.shipping_country}</p>
                        <p className="text-gray-400">{order.shipping_email}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Payment</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>{formatINR(parseFloat(order.total))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className="font-semibold capitalize">{order.payment_status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

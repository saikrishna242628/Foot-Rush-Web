import { useState, useEffect } from 'react'
import { formatINR } from '../utils/currency'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiX, FiCheck } from 'react-icons/fi'

const TABS = ['Dashboard', 'Products', 'Orders']
const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const emptyProduct = {
  name: '', description: '', price: '', category: '', brand: 'Foot Rush',
  stock: '100', image: '', sizes: '["6","7","8","9","10","11","12"]'
}

export default function Admin() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Dashboard')
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [productForm, setProductForm] = useState(emptyProduct)

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    loadData()
  }, [isAdmin])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/products'),
        axios.get('/api/orders/admin/all'),
      ])
      setStats(statsRes.data)
      setProducts(productsRes.data)
      setOrders(ordersRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editProduct) {
        await axios.put(`/api/products/${editProduct.id}`, productForm)
        toast.success('Product updated!')
      } else {
        await axios.post('/api/products', productForm)
        toast.success('Product added!')
      }
      setShowModal(false)
      setEditProduct(null)
      setProductForm(emptyProduct)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await axios.delete(`/api/products/${id}`)
      toast.success('Product deleted!')
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/admin/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      toast.success('Order status updated!')
    } catch (err) {
      toast.error('Failed to update order')
    }
  }

  const openEditModal = (product) => {
    setEditProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      brand: product.brand || 'Foot Rush',
      stock: product.stock.toString(),
      image: product.image || '',
      sizes: typeof product.sizes === 'string' ? product.sizes : JSON.stringify(product.sizes),
    })
    setShowModal(true)
  }

  if (!isAdmin) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Admin Panel</h1>
        <button onClick={loadData} className="btn-secondary text-xs py-2">Refresh Data</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              tab === t ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === 'Dashboard' && (
        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-28" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: FiUsers, label: 'Customers', value: stats?.customers || 0, color: 'bg-blue-50' },
                { icon: FiPackage, label: 'Products', value: stats?.products || 0, color: 'bg-purple-50' },
                { icon: FiShoppingBag, label: 'Orders', value: stats?.orders || 0, color: 'bg-orange-50' },
                { icon: FiDollarSign, label: 'Revenue', value: formatINR(stats?.revenue || 0), color: 'bg-green-50' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className={`${color} border border-gray-200 p-6`}>
                  <Icon size={28} className="mb-3" />
                  <p className="text-3xl font-black">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recent Orders */}
          <div>
            <h2 className="font-black text-lg uppercase tracking-wider mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead>
                  <tr className="bg-black text-white">
                    {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono">#{order.id}</td>
                      <td className="px-4 py-3">{order.customer_name}</td>
                      <td className="px-4 py-3 font-bold">{formatINR(parseFloat(order.total))}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 capitalize ${
                          { pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800',
                            shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800',
                            cancelled: 'bg-red-100 text-red-800' }[order.status] || 'bg-gray-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'Products' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{products.length} products total</p>
            <button
              onClick={() => { setEditProduct(null); setProductForm(emptyProduct); setShowModal(true) }}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800"
            >
              <FiPlus size={16} /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-black text-white">
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover bg-gray-100"
                        onError={e => { e.target.src = 'https://via.placeholder.com/48?text=Shoe' }}
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold max-w-xs">
                      <p className="truncate">{product.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{product.category}</td>
                    <td className="px-4 py-3 font-black">{formatINR(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(product)}
                          className="p-2 hover:bg-gray-100 text-blue-600">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-50 text-red-500">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'Orders' && (
        <div>
          <p className="text-sm text-gray-500 mb-6">{orders.length} orders total</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-black text-white">
                  {['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold">#{order.id}</td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3 text-gray-500">{order.customer_email}</td>
                    <td className="px-4 py-3 font-black">{formatINR(parseFloat(order.total))}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => handleStatusUpdate(order.id, e.target.value)}
                        className="border border-gray-300 text-xs px-2 py-1 focus:outline-none focus:border-black"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-black text-lg uppercase">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Product Name *</label>
                  <input value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                    className="input-field" required placeholder="Air Rush Pro" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Price *</label>
                  <input value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                    className="input-field" type="number" step="0.01" required placeholder="99.99" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Stock</label>
                  <input value={productForm.stock} onChange={e => setProductForm(p => ({ ...p, stock: e.target.value }))}
                    className="input-field" type="number" placeholder="100" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Category</label>
                  <input value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                    className="input-field" placeholder="Sneakers" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Brand</label>
                  <input value={productForm.brand} onChange={e => setProductForm(p => ({ ...p, brand: e.target.value }))}
                    className="input-field" placeholder="Foot Rush" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Image URL</label>
                  <input value={productForm.image} onChange={e => setProductForm(p => ({ ...p, image: e.target.value }))}
                    className="input-field" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Description</label>
                  <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                    className="input-field h-24 resize-none" placeholder="Product description..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Available Sizes (JSON array)</label>
                  <input value={productForm.sizes} onChange={e => setProductForm(p => ({ ...p, sizes: e.target.value }))}
                    className="input-field font-mono text-xs" placeholder='["6","7","8","9","10","11","12"]' />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const { user } = useAuth()

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return }
    try {
      const { data } = await axios.get('/api/cart')
      setCartItems(data)
    } catch (err) {
      console.error('Failed to fetch cart')
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId, quantity, size) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return false
    }
    if (!size) {
      toast.error('Please select a size')
      return false
    }
    setCartLoading(true)
    try {
      const { data } = await axios.post('/api/cart', { product_id: productId, quantity, size })
      setCartItems(data.cart)
      toast.success('Added to cart!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
      return false
    } finally {
      setCartLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(`/api/cart/${itemId}`, { quantity })
      setCartItems(data.cart)
    } catch (err) {
      toast.error('Failed to update cart')
    }
  }

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`/api/cart/${itemId}`)
      setCartItems(prev => prev.filter(item => item.id !== itemId))
      toast.success('Item removed')
    } catch (err) {
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart')
      setCartItems([])
    } catch (err) {
      console.error('Failed to clear cart')
    }
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems, cartLoading, addToCart, updateQuantity,
      removeItem, clearCart, fetchCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

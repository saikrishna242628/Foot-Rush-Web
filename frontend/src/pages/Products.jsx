import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const category = searchParams.get('category') || 'All'
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  useEffect(() => {
    axios.get('/api/products/categories')
      .then(res => setCategories(['All', ...res.data]))
      .catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'All') params.set('category', category)
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    axios.get(`/api/products?${params}`)
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category, search, sort, minPrice, maxPrice])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'All') params.set(key, value)
    else params.delete(key)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasFilters = category !== 'All' || search || minPrice || maxPrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">
          {search ? `Search: "${search}"` : category !== 'All' ? category : 'All Shoes'}
        </h1>
        <p className="text-gray-500 text-sm">{products.length} products found</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-sm tracking-widest uppercase">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-black flex items-center gap-1">
                  <FiX size={12} /> Clear all
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Category</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`w-full text-left text-sm py-2 px-3 transition-colors ${
                      (category === cat || (cat === 'All' && !searchParams.get('category')))
                        ? 'bg-black text-white font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => updateFilter('minPrice', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => updateFilter('maxPrice', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Sort (mobile) */}
            <div className="md:hidden mb-8">
              <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Sort By</h4>
              <select
                value={sort}
                onChange={e => updateFilter('sort', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm"
            >
              <FiFilter size={14} /> {showFilters ? 'Hide' : 'Show'} Filters
            </button>

            <div className="hidden md:flex items-center gap-4 ml-auto">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sort}
                onChange={e => updateFilter('sort', e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {search && (
                <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1">
                  Search: {search}
                  <button onClick={() => updateFilter('search', '')}><FiX size={12} /></button>
                </span>
              )}
              {category !== 'All' && (
                <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1">
                  {category}
                  <button onClick={() => updateFilter('category', 'All')}><FiX size={12} /></button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square mb-3" />
                  <div className="h-4 bg-gray-200 mb-2 w-3/4" />
                  <div className="h-4 bg-gray-200 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">👟</p>
              <h3 className="text-xl font-bold mb-2">No shoes found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

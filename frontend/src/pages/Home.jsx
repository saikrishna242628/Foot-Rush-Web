import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import GradientBlinds from '../components/GradientBlinds'
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi'

const categories = [
  { name: 'Running', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', count: '24 styles' },
  { name: 'Sneakers', image: 'https://images.unsplash.com/photo-1562183241-840b8af0721e?auto=format&fit=crop&w=400&q=80', count: '36 styles' },
  { name: 'Basketball', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=400&q=80', count: '18 styles' },
  { name: 'Boots', image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=400&q=80', count: '12 styles' },
]

const features = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On all orders over $100' },
  { icon: FiShield, title: '2-Year Warranty', desc: 'Full coverage guarantee' },
  { icon: FiRefreshCw, title: '30-Day Returns', desc: 'Hassle-free returns' },
  { icon: FiStar, title: 'Premium Quality', desc: 'Handpicked materials' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/products/featured')
      .then(res => setFeatured(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-enter">
      {/* Hero Section with Gradient Blinds */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '560px' }}>
        {/* Gradient Blinds WebGL Background */}
        <GradientBlinds
          gradientColors={['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#533483', '#7b2d8b', '#1a1a2e', '#000000']}
          angle={-15}
          noise={0.08}
          blindCount={18}
          blindMinWidth={50}
          mouseDampening={0.12}
          spotlightRadius={0.6}
          spotlightSoftness={1.2}
          spotlightOpacity={0.8}
          mirrorGradient={true}
          distortAmount={0.5}
          shineDirection="left"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white text-black text-xs font-bold tracking-widest uppercase px-3 py-1 mb-6">
                New Collection 2024
              </span>
              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
                STEP INTO<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-blue-300">
                  GREATNESS
                </span>
              </h1>
              <p className="text-gray-200 text-lg mb-8 leading-relaxed max-w-md">
                Premium shoes crafted for every lifestyle. From track to street, find your perfect pair at Foot Rush.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="bg-white text-black px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                  Shop Now <FiArrowRight />
                </Link>
                <Link to="/products?category=Running" className="border-2 border-white text-white px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-colors">
                  New Arrivals
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img
                src="/logo.png"
                alt="Foot Rush"
                className="w-72 h-72 object-contain filter invert drop-shadow-2xl"
                style={{ filter: 'invert(1) drop-shadow(0 0 40px rgba(150,100,255,0.5))' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Browse By</p>
            <h2 className="section-title">Categories</h2>
          </div>
          <Link to="/products" className="text-sm font-medium underline underline-offset-4 hover:text-gray-500 flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden aspect-[3/4]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-black text-xl tracking-tight">{cat.name}</p>
                <p className="text-sm text-gray-300">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Top Picks</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link to="/products" className="text-sm font-medium underline underline-offset-4 hover:text-gray-500 flex items-center gap-1">
            Shop All <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square mb-3" />
                <div className="h-4 bg-gray-200 mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Story Banner */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <img src="/logo.png" alt="Foot Rush" className="h-24 w-auto mx-auto mb-8 filter invert" />
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Built For Champions
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            At Foot Rush, we believe every step tells a story. Our shoes are designed with precision,
            crafted with care, and built to take you further than you ever imagined.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-gray-100 transition-colors">
            Explore Collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">What Our Customers Say</p>
          <h2 className="section-title">Reviews</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Marcus J.', rating: 5, review: 'Best running shoes I\'ve ever owned. My times improved and my feet feel amazing after long runs.' },
            { name: 'Sarah K.', rating: 5, review: 'The quality is unmatched. Got compliments everywhere I went. Will definitely order again!' },
            { name: 'David R.', rating: 5, review: 'Fast shipping, perfect fit, and the customer service was outstanding. A++' },
          ].map((testimonial, i) => (
            <div key={i} className="border border-gray-200 p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <FiStar key={j} size={14} className="fill-black text-black" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{testimonial.review}"</p>
              <p className="font-bold text-sm">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

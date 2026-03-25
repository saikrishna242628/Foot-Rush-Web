import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src="/logo.png" alt="Foot Rush" className="h-16 w-auto mb-4 invert" />
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Premium shoe care for every step. Quality craftsmanship meets modern style at Foot Rush.
            </p>
            <div className="flex gap-4 mt-6">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: 'All Shoes', to: '/products' },
                { label: 'Running', to: '/products?category=Running' },
                { label: 'Sneakers', to: '/products?category=Sneakers' },
                { label: 'Basketball', to: '/products?category=Basketball' },
                { label: 'Boots', to: '/products?category=Boots' },
                { label: 'Formal', to: '/products?category=Formal' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press', 'Sustainability', 'Affiliates'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FiMapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>123 Shoe Street, Fashion District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiPhone size={16} />
                <a href="tel:+18001234567" className="hover:text-white">+1 (800) 123-4567</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMail size={16} />
                <a href="mailto:hello@footrush.com" className="hover:text-white">hello@footrush.com</a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Get exclusive deals</p>
              <form className="flex" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-900 border border-gray-700 px-3 py-2 text-sm outline-none focus:border-white text-white placeholder-gray-500"
                />
                <button type="submit" className="bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Foot Rush Shoecare. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Returns & Refunds'].map(item => (
              <a key={item} href="#" className="text-gray-500 text-xs hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>Payments:</span>
            {['VISA', 'MC', 'AMEX', 'PayPal'].map(card => (
              <span key={card} className="border border-gray-700 px-2 py-1 text-xs">{card}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

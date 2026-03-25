require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, dbGet } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Foot Rush API is running!', timestamp: new Date().toISOString() });
});

// Admin stats
app.get('/api/admin/stats', require('./middleware/auth').adminMiddleware, async (req, res) => {
  try {
    const { dbAll } = require('./db');
    const [users, products, orders, revenue] = await Promise.all([
      dbAll('SELECT COUNT(*) as count FROM users WHERE role = ?', ['customer']),
      dbAll('SELECT COUNT(*) as count FROM products'),
      dbAll('SELECT COUNT(*) as count FROM orders'),
      dbAll('SELECT SUM(total) as total FROM orders WHERE payment_status = ?', ['paid'])
    ]);

    res.json({
      customers: users[0].count,
      products: products[0].count,
      orders: orders[0].count,
      revenue: revenue[0].total || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDB();
    console.log('✅ Database initialized');

    // Auto-seed if empty
    const productCount = await dbGet('SELECT COUNT(*) as count FROM products');
    if (productCount.count === 0) {
      console.log('📦 Seeding database with initial data...');
      require('child_process').execSync('node seed.js', {
        cwd: __dirname,
        stdio: 'inherit'
      });
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Foot Rush Server running on http://localhost:${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
      console.log(`\nDefault Login Credentials:`);
      console.log(`  Admin:    admin@footrush.com / admin123`);
      console.log(`  Customer: customer@example.com / customer123\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

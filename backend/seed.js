require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDB, dbRun, dbGet } = require('./db');

const products = [
  {
    name: 'Air Rush Pro',
    description: 'Lightweight performance running shoes with advanced cushioning technology. Perfect for long-distance runners seeking comfort and speed.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    category: 'Running',
    brand: 'Foot Rush',
    stock: 50,
    sizes: '["6","7","7.5","8","8.5","9","9.5","10","10.5","11","12"]',
    rating: 4.8,
    reviews: 124
  },
  {
    name: 'Street King Sneaker',
    description: 'Classic urban sneakers with premium leather upper and rubber sole. A timeless style for everyday wear.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1600185365926-3a2979f4d7e4?w=600&q=80',
    category: 'Sneakers',
    brand: 'Foot Rush',
    stock: 75,
    sizes: '["6","7","8","9","10","11","12"]',
    rating: 4.6,
    reviews: 89
  },
  {
    name: 'Hoop Legend Hi-Top',
    description: 'High-top basketball shoes with ankle support and responsive cushioning for the court.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    category: 'Basketball',
    brand: 'Foot Rush',
    stock: 40,
    sizes: '["7","8","9","10","11","12","13"]',
    rating: 4.9,
    reviews: 201
  },
  {
    name: 'Urban Slide Classic',
    description: 'Comfortable slip-on slides perfect for casual wear, beach days, and post-workout relaxation.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
    category: 'Slides',
    brand: 'Foot Rush',
    stock: 100,
    sizes: '["6","7","8","9","10","11","12"]',
    rating: 4.3,
    reviews: 56
  },
  {
    name: 'Trail Blazer Boot',
    description: 'Rugged waterproof hiking boots built for tough terrains. Durable, grippy, and stylish.',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80',
    category: 'Boots',
    brand: 'Foot Rush',
    stock: 30,
    sizes: '["7","8","9","10","11","12"]',
    rating: 4.7,
    reviews: 78
  },
  {
    name: 'Cloud Walker Comfort',
    description: 'Ultra-comfortable walking shoes with memory foam insoles and breathable mesh upper.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1539185261023-f7f5188ce498?w=600&q=80',
    category: 'Casual',
    brand: 'Foot Rush',
    stock: 60,
    sizes: '["6","7","8","9","10","11","12"]',
    rating: 4.5,
    reviews: 143
  },
  {
    name: 'Sprint Elite Racing',
    description: 'Professional track racing shoes with carbon fiber plate and minimal weight design.',
    price: 219.99,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    category: 'Running',
    brand: 'Foot Rush',
    stock: 20,
    sizes: '["7","7.5","8","8.5","9","9.5","10","10.5","11"]',
    rating: 4.9,
    reviews: 67
  },
  {
    name: 'Retro Vibe Low',
    description: 'Vintage-inspired low-top sneakers with a modern twist. Classic colorways for a nostalgic look.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
    category: 'Sneakers',
    brand: 'Foot Rush',
    stock: 85,
    sizes: '["6","7","8","9","10","11","12"]',
    rating: 4.4,
    reviews: 112
  },
  {
    name: 'Power Lift Training',
    description: 'Stable training shoes designed for weightlifting and cross-training with flat, firm soles.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1584735175315-9d5df23be5f1?w=600&q=80',
    category: 'Training',
    brand: 'Foot Rush',
    stock: 45,
    sizes: '["7","8","9","10","11","12"]',
    rating: 4.6,
    reviews: 94
  },
  {
    name: 'Luxe Dress Oxford',
    description: 'Elegant leather Oxford shoes for formal occasions. Handcrafted with premium full-grain leather.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80',
    category: 'Formal',
    brand: 'Foot Rush',
    stock: 25,
    sizes: '["7","8","9","10","11","12"]',
    rating: 4.8,
    reviews: 45
  },
  {
    name: 'Kids Zoom Runner',
    description: 'Fun and durable running shoes for active kids. Velcro straps for easy on-off.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=600&q=80',
    category: 'Kids',
    brand: 'Foot Rush',
    stock: 70,
    sizes: '["1","2","3","4","5","6"]',
    rating: 4.7,
    reviews: 88
  },
  {
    name: 'Women\'s Aura Flex',
    description: 'Flexible and stylish women\'s athletic shoes with arch support and cushioned footbed.',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    category: 'Women',
    brand: 'Foot Rush',
    stock: 55,
    sizes: '["5","6","7","8","9","10"]',
    rating: 4.6,
    reviews: 167
  }
];

const seedDB = async () => {
  try {
    await initDB();
    console.log('Database initialized.');

    // Check if products already seeded
    const existingProducts = await new Promise((resolve, reject) => {
      const { db } = require('./db');
      db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingProducts.count === 0) {
      console.log('Seeding products...');
      for (const product of products) {
        await dbRun(
          `INSERT INTO products (name, description, price, image, category, brand, stock, sizes, rating, reviews)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [product.name, product.description, product.price, product.image,
           product.category, product.brand, product.stock, product.sizes,
           product.rating, product.reviews]
        );
      }
      console.log(`Seeded ${products.length} products.`);
    } else {
      console.log('Products already seeded, skipping...');
    }

    // Check if admin user exists
    const adminExists = await dbGet('SELECT id FROM users WHERE email = ?', ['admin@footrush.com']);
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await dbRun(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@footrush.com', hashedPassword, 'admin']
      );
      console.log('Admin user created: admin@footrush.com / admin123');
    }

    // Create demo customer
    const customerExists = await dbGet('SELECT id FROM users WHERE email = ?', ['customer@example.com']);
    if (!customerExists) {
      const hashedPassword = await bcrypt.hash('customer123', 10);
      await dbRun(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Demo Customer', 'customer@example.com', hashedPassword, 'customer']
      );
      console.log('Demo customer created: customer@example.com / customer123');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('Default accounts:');
    console.log('  Admin: admin@footrush.com / admin123');
    console.log('  Customer: customer@example.com / customer123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();

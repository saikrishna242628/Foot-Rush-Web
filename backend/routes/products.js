const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');
const { adminMiddleware } = require('../middleware/auth');

// Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (sort === 'price_asc') sql += ' ORDER BY price ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY price DESC';
    else if (sort === 'rating') sql += ' ORDER BY rating DESC';
    else if (sort === 'newest') sql += ' ORDER BY created_at DESC';
    else sql += ' ORDER BY id ASC';

    const products = await dbAll(sql, params);
    res.json(products);
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get featured products (top rated)
router.get('/featured', async (req, res) => {
  try {
    const products = await dbAll(
      'SELECT * FROM products ORDER BY rating DESC, reviews DESC LIMIT 8'
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbAll('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(categories.map(c => c.category));
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create product (admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, category, brand, stock, sizes } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const result = await dbRun(
      `INSERT INTO products (name, description, price, image, category, brand, stock, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, parseFloat(price), image, category, brand,
       parseInt(stock) || 100, sizes || '["6","7","8","9","10","11","12"]']
    );

    const product = await dbGet('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update product (admin only)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, category, brand, stock, sizes } = req.body;

    await dbRun(
      `UPDATE products SET name=?, description=?, price=?, image=?, category=?,
       brand=?, stock=?, sizes=? WHERE id=?`,
      [name, description, parseFloat(price), image, category, brand,
       parseInt(stock), sizes, req.params.id]
    );

    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await dbRun('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;

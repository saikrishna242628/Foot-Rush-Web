const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');
const { authMiddleware } = require('../middleware/auth');

// Get cart items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await dbAll(
      `SELECT c.id, c.quantity, c.size, p.id as product_id, p.name, p.price, p.image, p.category, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add to cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id, quantity = 1, size } = req.body;

    if (!product_id || !size) {
      return res.status(400).json({ message: 'Product ID and size are required.' });
    }

    const product = await dbGet('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if item already in cart
    const existing = await dbGet(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ?',
      [req.user.id, product_id, size]
    );

    if (existing) {
      await dbRun(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND size = ?',
        [quantity, req.user.id, product_id, size]
      );
    } else {
      await dbRun(
        'INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
        [req.user.id, product_id, quantity, size]
      );
    }

    // Return updated cart
    const items = await dbAll(
      `SELECT c.id, c.quantity, c.size, p.id as product_id, p.name, p.price, p.image, p.category
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    res.json({ message: 'Added to cart!', cart: items });
  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update cart item quantity
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      await dbRun('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    } else {
      await dbRun(
        'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, req.params.id, req.user.id]
      );
    }

    const items = await dbAll(
      `SELECT c.id, c.quantity, c.size, p.id as product_id, p.name, p.price, p.image, p.category
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    res.json({ message: 'Cart updated!', cart: items });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Remove cart item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await dbRun('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await dbRun('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;

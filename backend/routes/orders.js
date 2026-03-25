const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get user orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await dbAll(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Fetch items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const items = await dbAll(
        `SELECT oi.*, p.name, p.image FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      return { ...order, items };
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error('Orders error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await dbGet(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const items = await dbAll(
      `SELECT oi.*, p.name, p.image FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create order (called after successful payment)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shipping, total, payment_intent_id } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order.' });
    }

    // Create order
    const result = await dbRun(
      `INSERT INTO orders (user_id, total, status, payment_intent_id, payment_status,
        shipping_name, shipping_email, shipping_address, shipping_city,
        shipping_state, shipping_zip, shipping_country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, total, 'processing',
        payment_intent_id || null, payment_intent_id ? 'paid' : 'demo',
        shipping.name, shipping.email, shipping.address, shipping.city,
        shipping.state, shipping.zip, shipping.country || 'US'
      ]
    );

    const orderId = result.lastID;

    // Insert order items
    for (const item of items) {
      await dbRun(
        'INSERT INTO order_items (order_id, product_id, quantity, size, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.size, item.price]
      );

      // Reduce stock
      await dbRun(
        'UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear user cart
    await dbRun('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [orderId]);
    const orderItems = await dbAll(
      `SELECT oi.*, p.name, p.image FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.status(201).json({ ...order, items: orderItems });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Admin: Get all orders
router.get('/admin/all', adminMiddleware, async (req, res) => {
  try {
    const orders = await dbAll(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Admin: Update order status
router.put('/admin/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await dbRun('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;

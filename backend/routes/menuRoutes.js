const express = require('express');
const pool = require('../config/db');
const { getMenuByRestaurantId } = require('../controllers/menuController');

const router = express.Router();

// Fetch menu for a specific restaurant
router.get('/', async (req, res) => {
  const restaurantId = req.query.restaurant_id;
  if (!restaurantId) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }

  try {
    const result = await pool.query('SELECT * FROM menus WHERE restaurant_id = $1', [restaurantId]);
    const menu = result.rows;

    if (menu.length === 0) {
      return res.status(404).json({ message: 'Menu not found for this restaurant' });
    }

    res.json({ menu });
  } catch (err) {
    console.error('Error fetching menu:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new menu item
router.post('/', async (req, res) => {
  const { restaurant_id, name, description, price } = req.body;

  if (!restaurant_id) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO menus (restaurant_id, name, description, price, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [restaurant_id, name, description, price]
    );

    res.status(201).json({ menuItem: result.rows[0] });
  } catch (err) {
    console.error('Error adding menu item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update menu item
router.put('/', async (req, res) => {
  const { id, restaurant_id, name, description, price } = req.body;

  if (!id || !restaurant_id) {
    return res.status(400).json({ message: 'Menu item ID and restaurant ID are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE menus SET name = $1, description = $2, price = $3, updated_at = NOW() WHERE id = $4 AND restaurant_id = $5 RETURNING *',
      [name, description, price, id, restaurant_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ menuItem: result.rows[0] });
  } catch (err) {
    console.error('Error updating menu item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete menu item
router.delete('/', async (req, res) => {
  const { id, restaurant_id } = req.query;

  if (!id || !restaurant_id) {
    return res.status(400).json({ message: 'Menu item ID and restaurant ID are required' });
  }

  try {
    const result = await pool.query('DELETE FROM menus WHERE id = $1 AND restaurant_id = $2 RETURNING *', [id, restaurant_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully', deletedItem: result.rows[0] });
  } catch (err) {
    console.error('Error deleting menu item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
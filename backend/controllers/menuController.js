const pool = require('../config/db');

const getMenuByRestaurantId = async (req, res) => {
  const restaurantId = req.query.restaurant_id;
  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required" });
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
};

module.exports = {
  getMenuByRestaurantId
};

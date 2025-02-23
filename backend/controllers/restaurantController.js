const pool = require('../config/db');

const getRestaurants = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    const restaurant = result.rows[0];

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    console.error('Error fetching restaurant details:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById
};

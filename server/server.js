app.post('/api/host/menu', async (req, res) => {
  try {
    // Destructure the data from the request body
    const { host_id, restaurant_id, name, description, price } = req.body;
    
    // Check if all fields are provided
    if (!host_id || !restaurant_id || !name || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert the menu item into the database
    const result = await pool.query(
      'INSERT INTO menus (restaurant_id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurant_id, name, description, price]
    );

    // Return the created menu item in the response
    res.json({ menuItem: result.rows[0] });
  } catch (error) {
    // If there's an error, send a server error response
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Server error while adding menu item' });
  }
});
app.put('/api/host/menu', async (req, res) => {
  try {
    // Destructure the data from the request body
    const { id, restaurant_id, name, description, price } = req.body;

    // Check if all fields are provided
    if (!id || !restaurant_id || !name || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Update the menu item in the database
    const result = await pool.query(
      'UPDATE menus SET name = $1, description = $2, price = $3 WHERE id = $4 AND restaurant_id = $5 RETURNING *',
      [name, description, price, id, restaurant_id]
    );

    // If no rows were updated, return an error
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Return the updated menu item in the response
    res.json({ menuItem: result.rows[0] });
  } catch (error) {
    // If there's an error, send a server error response
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Server error while updating menu item' });
  }
});

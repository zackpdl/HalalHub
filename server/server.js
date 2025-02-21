// ... existing imports and setup ...

// Update the menu item creation endpoint
app.post('/api/host/menu', async (req, res) => {
  try {
    const { host_id, restaurant_id, name, description, price } = req.body;
    
    const result = await pool.query(
      'INSERT INTO menus (restaurant_id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurant_id, name, description, price]
    );

    res.json({ menuItem: result.rows[0] });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update the menu item update endpoint
app.put('/api/host/menu', async (req, res) => {
  try {
    const { id, restaurant_id, name, description, price } = req.body;
    
    const result = await pool.query(
      'UPDATE menus SET name = $1, description = $2, price = $3 WHERE id = $4 AND restaurant_id = $5 RETURNING *',
      [name, description, price, id, restaurant_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ menuItem: result.rows[0] });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: error.message });
  }
});


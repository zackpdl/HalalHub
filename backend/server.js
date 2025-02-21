const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Update CORS configuration to allow PUT method
app.use(cors({
  origin: 'http://localhost:5173', // Update to match your Vite frontend URL
  methods: ['GET', 'POST', 'PUT'], // Add PUT to allowed methods
  credentials: true
}));

app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the HalalHub API');
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');  // Check database connection
    res.status(200).send('Database connection is healthy');
  } catch (err) {
    console.error('Database connection error:', err.message);
    res.status(500).send('Database connection failed');
  }
});

// Fetch restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fetch specific restaurant details (removed authentication)
app.get('/api/restaurants/:id', async (req, res) => {
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
});

// User signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).send('Server Error');
  }
});

// User signin
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }
    res.status(200).json({ message: 'Signin successful', user });
  } catch (err) {
    console.error('Signin error:', err.message);
    res.status(500).send('Server Error');
  }
});

// Host signin (no token required)
app.post('/api/host/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Get host with restaurant information
    const result = await pool.query(`
      SELECT h.*, r.id as restaurant_id, r.restaurant_name, r.address, r.city, 
             r.cuisine, r.opening_hours, r.closing_hours, r.halal_cert_type, 
             r.halal_cert_number, r.halal_cert_expiry
      FROM hosts h
      LEFT JOIN restaurants r ON r.host_id = h.id
      WHERE h.email = $1
    `, [email]);

    const host = result.rows[0];

    if (!host || !(await bcrypt.compare(password, host.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Restructure the response data
    const responseData = {
      host: {
        id: host.id,
        email: host.email,
        phone: host.phone,
        restaurantId: host.restaurant_id,
        restaurant: {
          id: host.restaurant_id,
          name: host.restaurant_name,
          address: host.address,
          city: host.city,
          cuisine: host.cuisine,
          opening_hours: host.opening_hours,
          closing_hours: host.closing_hours,
          halal_cert_type: host.halal_cert_type,
          halal_cert_number: host.halal_cert_number,
          halal_cert_expiry: host.halal_cert_expiry
        }
      }
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Signin error:', err.message);
    res.status(500).send('Server Error');
  }
});

// Host and Restaurant registration
app.post('/api/host/register', async (req, res) => {
  const { email, password, phone, restaurantName, address, city, cuisine, openingHours, closingHours, certType, certNumber, certExpiry } = req.body;

  const client = await pool.connect(); // PostgreSQL connection

  try {
    await client.query('BEGIN'); // Start transaction

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into hosts table
    const hostQuery = `INSERT INTO hosts (email, password, phone) VALUES ($1, $2, $3) RETURNING id`;
    const hostResult = await client.query(hostQuery, [email, hashedPassword, phone]);
    const hostId = hostResult.rows[0].id;

    // Insert into restaurants table
    const restaurantQuery = `INSERT INTO restaurants (restaurant_name, address, city, cuisine, opening_hours, closing_hours, halal_cert_type, halal_cert_number, halal_cert_expiry, host_id)
                             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`;
    const restaurantResult = await client.query(restaurantQuery, [
      restaurantName, address, city, cuisine, openingHours, closingHours, certType, certNumber, certExpiry, hostId
    ]);

    await client.query('COMMIT'); // Commit transaction
    res.status(201).json({ message: 'Registration successful', hostId, restaurantId: restaurantResult.rows[0].id });

  } catch (err) {
    await client.query('ROLLBACK'); // Rollback in case of error
    console.error('Registration error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Fetch restaurant details (no authentication required)
app.get('/api/host/restaurant-details', async (req, res) => {
  try {
    const hostId = req.query.hostId;
    const result = await pool.query(`
      SELECT 
        restaurant_name, 
        address, 
        city, 
        halal_cert_type, 
        halal_cert_number, 
        halal_cert_expiry 
      FROM restaurants 
      WHERE host_id = $1`, [hostId]);
    const restaurant = result.rows[0];

    if (restaurant) {
      const expiryDate = new Date(restaurant.halal_cert_expiry);
      const currentDate = new Date();
      const isCertifiedActive = expiryDate >= currentDate;

      res.json({
        name: restaurant.restaurant_name,
        location: `${restaurant.address}, ${restaurant.city}`,
        halal_certification: restaurant.halal_cert_type,
        halal_cert_number: restaurant.halal_cert_number,
        cert_expiry: restaurant.halal_cert_expiry,
        certification_status: isCertifiedActive ? 'Active' : 'Expired'
      });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    console.error('Error fetching restaurant details:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch reviews for a restaurant
app.get('/api/host/reviews', async (req, res) => {
  try {
    const hostId = parseInt(req.query.hostId, 10); // Convert hostId to an integer

    if (isNaN(hostId)) {
      return res.status(400).json({ message: "Invalid host ID" });
    }

    const result = await pool.query(`
      SELECT r.* 
      FROM reviews r
      JOIN restaurants rest ON r.restaurant_id = rest.id
      WHERE rest.host_id = $1
    `, [hostId]); // No "::uuid" needed

    res.json({ reviews: result.rows });
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// File upload route
app.post('/api/host/upload-image', upload.single('image'), (req, res) => {
  try {
    res.status(200).json({ message: 'Image uploaded successfully', filename: req.file.filename });
  } catch (err) {
    console.error('File upload error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Fetch menu for a specific restaurant (using restaurant_id)
app.get('/api/host/menu', async (req, res) => {
  const restaurantId = req.query.restaurant_id; // Get the restaurantId from query parameters
  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required" });
  }

  try {
    // Assuming the column name is correct
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

// Update menu item endpoint
app.put('/api/host/menu', async (req, res) => {
  const { id, host_id, restaurant_id, name, description, price } = req.body;
  
  if (!id || !restaurant_id || !host_id) {
    return res.status(400).json({ message: "Menu item ID, restaurant ID, and host ID are required" });
  }

  try {
    // First verify the restaurant belongs to the host
    const restaurantCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND host_id = $2',
      [restaurant_id, host_id]
    );

    if (restaurantCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to modify this menu' });
    }

    // Then update the menu item without availability
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

// Add new menu item
// Update the POST endpoint for adding menu items
app.post('/api/host/menu', async (req, res) => {
  const { host_id, restaurant_id, name, description, price } = req.body;
  
  console.log('Received request body:', req.body);

  if (!restaurant_id || !host_id) {
    return res.status(400).json({ message: "Restaurant ID and host ID are required" });
  }

  try {
    // Verify the restaurant belongs to the host
    const restaurantCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1 AND host_id = $2',
      [restaurant_id, host_id]
    );

    if (restaurantCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to modify this menu' });
    }

    // Insert the new menu item without availability
    const result = await pool.query(
      `INSERT INTO menus (
        restaurant_id, 
        name, 
        description, 
        price, 
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4::numeric, NOW(), NOW()) RETURNING *`,
      [restaurant_id, name, description, price]
    );

    console.log('Created menu item:', result.rows[0]);
    res.status(201).json({ menuItem: result.rows[0] });
  } catch (err) {
    console.error('Detailed error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      details: err.message,
      hint: err.hint
    });
  }
});


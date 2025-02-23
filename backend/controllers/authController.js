const bcrypt = require('bcrypt');
const pool = require('../config/db');

const signup = async (req, res) => {
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
};

const signin = async (req, res) => {
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
};

module.exports = {
  signup,
  signin
};

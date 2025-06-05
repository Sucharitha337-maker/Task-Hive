const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Register (Create user)
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, role, password } = req.body;

  try {
    // Check if email already exists
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    await pool.query(
      `INSERT INTO users (first_name, last_name, email, role, password)
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, role, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`
      }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, first_name, last_name FROM users');
    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

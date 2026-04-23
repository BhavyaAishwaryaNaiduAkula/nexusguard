const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../users.json');

// Helper to read/write users (mock DB)
const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// @route   POST api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let users = getUsers();
    let user = users.find(u => u.email === email);

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = { id: Date.now().toString(), name, email, password: hashedPassword };
    users.push(user);
    saveUsers(users);

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'nexus_secret_key', 
      { expiresIn: '24h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`[AUTH] Login attempt for: ${email}`);

  try {
    let users = getUsers();
    let user = users.find(u => u.email === email);

    if (!user) {
      console.warn(`[AUTH] Login failed: User not found (${email})`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[AUTH] Login failed: Incorrect password (${email})`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'nexus_secret_key', 
      { expiresIn: '24h' }, 
      (err, token) => {
        if (err) throw err;
        console.log(`[AUTH] Login successful: ${email}`);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error(`[AUTH] Server Error: ${err.message}`);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;

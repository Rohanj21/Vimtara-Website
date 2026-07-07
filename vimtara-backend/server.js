const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors()); // Allows your React app to talk to this API
app.use(express.json()); // Allows Express to read JSON data

const JWT_SECRET = 'your_super_secret_jwt_key_here'; // In production, move this to your .env file

// --- ROUTES ---

// 1. Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server and Database are running smoothly!' });
});

// 2. User Registration (Run this once via Postman to create your first Admin/User)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, companyName, role } = req.body;

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save to PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        companyName,
        role: role || 'USER', // Defaults to USER if not specified
      },
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed. Email might already exist.' });
  }
});

// 3. User Login (This replaces your frontend mock login)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in PostgreSQL
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Verify Password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, company: user.companyName },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { name: user.name, email: user.email, company: user.companyName, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
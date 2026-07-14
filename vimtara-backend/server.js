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
      user: { id: user.id, name: user.name, email: user.email, company: user.companyName, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- ADMIN ROUTES (Account Management) ---

// Get all provisioned users
app.get('/api/users', async (req, res) => {
  try {
    // Fetches all users but excludes their password hashes for security
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, companyName: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch directory' });
  }
});

// Update a user's role or details
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role },
      select: { id: true, name: true, email: true, role: true, companyName: true }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user account' });
  }
});

// Delete a user account
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Account successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// --- ANALYTICS & DATA SEEDING ROUTES ---

// 1. Data Seeding Route (Run this ONCE via browser or Postman to populate Postgres)
app.post('/api/seed-analytics', async (req, res) => {
  try {
    // Grab the first admin user to attach the mock data to
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminUser) return res.status(400).json({ error: 'No admin user found. Create one first.' });

    const statuses = ['FILED', 'PENDING', 'ACTION_REQUIRED'];
    const types = ['GST GSTR-3B', 'MCA AOC-4', 'EPFO Return', 'TDS Return'];
    
    // Generate 50 random filings over the last 6 months
    const mockFilings = Array.from({ length: 50 }).map(() => {
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * 6));
      
      return {
        title: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        dueDate: pastDate,
        userId: adminUser.id
      };
    });

    await prisma.filing.createMany({ data: mockFilings });
    res.json({ message: 'Successfully seeded 50 statutory filings into PostgreSQL!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed data' });
  }
});

// 2. Fetch Aggregated Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const { filter } = req.query; // 'all', '6m', '3m'
    
    // Fetch all filings (In a real app, you would filter by date based on the query)
    const filings = await prisma.filing.findMany();

    // 1. Aggregate for Pie Chart (Status Distribution)
    const statusCounts = filings.reduce((acc, filing) => {
      acc[filing.status] = (acc[filing.status] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.keys(statusCounts).map(key => ({
      name: key.replace('_', ' '),
      value: statusCounts[key]
    }));

    // 2. Aggregate for Bar Chart (Monthly Volume)
    const monthlyVolume = filings.reduce((acc, filing) => {
      const month = new Date(filing.dueDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const barData = Object.keys(monthlyVolume).map(month => ({
      month,
      volume: monthlyVolume[month]
    }));

    res.json({ barData, pieData, totalFilings: filings.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// --- CHAT, TOKEN, & ASSISTANT ROUTES ---

// 1. Get user data (including tokens)
app.get('/api/users/:id/tokens', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { plan: true, dailyTokens: true } });
    res.json(user);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch tokens' }); }
});

// 2. Fetch User's Threads
app.get('/api/threads/:userId', async (req, res) => {
  try {
    const threads = await prisma.thread.findMany({
      where: { userId: req.params.userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(threads);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch threads' }); }
});

// 3. Create a New Thread
app.post('/api/threads', async (req, res) => {
  try {
    const { title, service, userId } = req.body;
    const thread = await prisma.thread.create({
      data: { title, service, userId },
      include: { messages: true }
    });
    res.json(thread);
  } catch (error) { res.status(500).json({ error: 'Failed to create thread' }); }
});

// 4. Send Message (Updated to bypass tokens for Assistants/Admins)
app.post('/api/messages', async (req, res) => {
  try {
    const { threadId, senderId, content, hasAttachment, attachmentName, attachmentSize, tokenCost } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: senderId } });
    
    // Only deduct tokens if the sender is a standard USER
    if (user.role === 'USER') {
      if (user.dailyTokens < tokenCost) {
        return res.status(403).json({ error: 'Insufficient tokens. Please upgrade your plan.' });
      }
      
      const [newMessage, updatedUser] = await prisma.$transaction([
        prisma.message.create({ data: { threadId, senderId, content, hasAttachment, attachmentName, attachmentSize } }),
        prisma.user.update({ where: { id: senderId }, data: { dailyTokens: { decrement: tokenCost } } })
      ]);
      return res.json({ message: newMessage, tokensLeft: updatedUser.dailyTokens });
    } else {
      // Admin or Assistant sends a message (Free of charge)
      const newMessage = await prisma.message.create({
        data: { threadId, senderId, content, hasAttachment, attachmentName, attachmentSize }
      });
      return res.json({ message: newMessage, tokensLeft: null });
    }
  } catch (error) { res.status(500).json({ error: 'Failed to send message' }); }
});

// 5. Fetch ALL Threads for Admin Oversight
app.get('/api/admin/threads', async (req, res) => {
  try {
    const threads = await prisma.thread.findMany({
      include: { 
        messages: { orderBy: { createdAt: 'asc' } },
        user: { select: { companyName: true, name: true } } // Includes the client's details
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(threads);
  } catch (error) { 
    res.status(500).json({ error: 'Failed to fetch all threads' }); 
  }
});

// 6. Fetch Assistant Dashboard Data
app.get('/api/assistant/dashboard', async (req, res) => {
  try {
    // Fetch all threads with client info
    const threads = await prisma.thread.findMany({
      include: { 
        messages: { orderBy: { createdAt: 'asc' } },
        user: { select: { name: true, companyName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Fetch all clients (Users)
    const clients = await prisma.user.findMany({
      where: { role: 'USER' },
      select: { id: true, name: true, companyName: true, plan: true, createdAt: true }
    });

    res.json({ threads, clients });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch assistant data' }); }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
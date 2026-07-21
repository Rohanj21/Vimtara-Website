const axios = require('axios'); 
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const JWT_SECRET = 'your_super_secret_jwt_key_here'; 

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server and Database are running smoothly!' });
});

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, companyName, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: { email, passwordHash, name, companyName, role: role || 'USER' },
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed. Email might already exist.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

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

// --- USER & TOKEN ROUTES ---
app.get('/api/users/:id/tokens', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { plan: true, dailyTokens: true } });
    res.json(user);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch tokens' }); }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, companyName: true, createdAt: true } });
    res.json(users);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch directory' }); }
});

// --- THREAD ROUTES ---
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

// FIXED: Now saves 'mode' parameter ('AI' or 'HUMAN')
app.post('/api/threads', async (req, res) => {
  try {
    const { title, service, userId, mode } = req.body;
    const thread = await prisma.thread.create({
      data: { title, service, userId, mode: mode || 'HUMAN' },
      include: { messages: true }
    });
    res.json(thread);
  } catch (error) { 
    console.error("Create thread error:", error);
    res.status(500).json({ error: 'Failed to create thread' }); 
  }
});

app.delete('/api/threads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.message.deleteMany({ where: { threadId: id } });
    await prisma.thread.delete({ where: { id } });
    res.json({ success: true, message: 'Thread deleted successfully' });
  } catch (error) { 
    res.status(500).json({ error: 'Failed to delete thread' }); 
  }
});

// --- MESSAGE & RAG AI EXECUTION ROUTE ---
app.post('/api/messages', async (req, res) => {
  try {
    const { threadId, senderId, content, hasAttachment, attachmentName, attachmentSize, attachmentData, attachmentTag, tokenCost } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: senderId } });
    const thread = await prisma.thread.findUnique({ where: { id: threadId } });

    let tokenReduction = user.role === 'USER' ? tokenCost : 0;
    if (user.role === 'USER' && user.dailyTokens < tokenCost) {
      return res.status(403).json({ error: 'Insufficient tokens.' });
    }

    const [userMessage, updatedUser] = await prisma.$transaction([
      prisma.message.create({ 
        data: { threadId, senderId, content: content || '', hasAttachment, attachmentName, attachmentSize, attachmentData, attachmentTag } 
      }),
      prisma.user.update({ where: { id: senderId }, data: { dailyTokens: { decrement: tokenReduction } } })
    ]);

    // 2. NEW: Automated RAG Execution Trigger
    if (thread && thread.mode === 'AI' && user.role === 'USER') {
      try {
        // FIX: Ensure the SYSTEM_AI user exists in the database to prevent Foreign Key crashes
        let aiUser = await prisma.user.findUnique({ where: { id: 'SYSTEM_AI' } });
        if (!aiUser) {
          await prisma.user.create({
            data: { id: 'SYSTEM_AI', name: 'Vimtara System AI', email: 'ai@vimtara.com', passwordHash: 'ai_secure', companyName: 'Vimtara Core', role: 'ASSISTANT' }
          });
        }

        const ragResponse = await axios.post('http://localhost:8000/api/ai/query', { 
          prompt: content || "Analyzed attached compliance file." 
        });
        const aiAnswer = ragResponse.data.response;

        const aiMessage = await prisma.message.create({
          data: { threadId, senderId: 'SYSTEM_AI', content: aiAnswer, hasAttachment: false }
        });

        return res.json({ message: userMessage, aiReply: aiMessage, tokensLeft: updatedUser.dailyTokens });
      } catch (ragError) {
        console.error("RAG AI engine connection notice:", ragError.message);
        const fallbackAnswer = `[Vimtara Statutory AI]: Query received regarding ${thread.service || 'Compliance'}. Our knowledge base is currently analyzing this.`;
        
        const fallbackMessage = await prisma.message.create({
          data: { threadId, senderId: 'SYSTEM_AI', content: fallbackAnswer, hasAttachment: false }
        });
        return res.json({ message: userMessage, aiReply: fallbackMessage, tokensLeft: updatedUser.dailyTokens });
      }
    }

    res.json({ message: userMessage, tokensLeft: updatedUser.dailyTokens });
  } catch (error) { 
    console.error("Message error:", error);
    res.status(500).json({ error: 'System processing error.' }); 
  }
});

// --- ADMIN & ASSISTANT DASHBOARD ROUTES ---
app.get('/api/admin/threads', async (req, res) => {
  try {
    const threads = await prisma.thread.findMany({
      include: { 
        messages: { orderBy: { createdAt: 'asc' } },
        user: { select: { companyName: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(threads);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch threads' }); }
});

app.get('/api/assistant/dashboard', async (req, res) => {
  try {
    const threads = await prisma.thread.findMany({
      include: { 
        messages: { orderBy: { createdAt: 'asc' } },
        user: { select: { name: true, companyName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const clients = await prisma.user.findMany({
      where: { role: 'USER' },
      select: { id: true, name: true, companyName: true, plan: true, createdAt: true }
    });

    res.json({ threads, clients });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch assistant data' }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
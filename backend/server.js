import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readDB, writeDB } from './db/dbHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'envlp_super_secret_key_2026';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsers with limits for base64 image data (signatures)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Helper to generate simple unique keys
function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
}

// Global logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─────────────────────────────────────────────
// AUTH MIDDLEWARE
// ─────────────────────────────────────────────
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Token diperlukan.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Token tidak valid atau sudah kadaluarsa.' });
  }
}

// ─────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password minimal 6 karakter.' });

    const db = await readDB();
    if (!db.users) db.users = [];

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing)
      return res.status(409).json({ error: 'Email sudah terdaftar. Silakan login.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: generateId(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    await writeDB(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mendaftarkan akun.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });

    const db = await readDB();
    if (!db.users) db.users = [];

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user)
      return res.status(401).json({ error: 'Email tidak ditemukan.' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(401).json({ error: 'Password salah.' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal login.' });
  }
});

// GET /api/auth/me  — verify current token & return profile
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const db = await readDB();
    const user = (db.users || []).find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });
    res.json({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
  } catch {
    res.status(500).json({ error: 'Gagal mengambil profil.' });
  }
});



// 1. Get invitations belonging to the authenticated user
app.get('/api/invitations', verifyToken, async (req, res) => {
  try {
    const db = await readDB();
    const mine = db.invitations.filter(inv => inv.userId === req.user.id);
    res.json(mine);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve invitations.' });
  }
});

// 2. Get details of a single invitation
app.get('/api/invitations/:id', async (req, res) => {
  try {
    const db = await readDB();
    const invitation = db.invitations.find(inv => inv.id === req.params.id);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found.' });
    }
    res.json(invitation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve invitation.' });
  }
});

// 3. Create a new invitation (requires auth — stamped with userId)
app.post('/api/invitations', verifyToken, async (req, res) => {
  try {
    const { hostName, eventType, theme, title, musicUrl, details, status } = req.body;
    
    if (!hostName || !eventType || !theme || !title) {
      return res.status(400).json({ error: 'Required fields are missing.' });
    }
    
    const db = await readDB();
    const newInvitation = {
      id: generateId(),
      userId: req.user.id,          // ← ownership stamp
      hostName,
      eventType,
      theme,
      title,
      musicUrl: musicUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      details: details || {},
      status: status || 'free',
      createdAt: new Date().toISOString()
    };
    
    db.invitations.push(newInvitation);
    await writeDB(db);
    
    res.status(201).json(newInvitation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invitation.' });
  }
});

// 4. Update an existing invitation
app.put('/api/invitations/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.invitations.findIndex(inv => inv.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Invitation not found.' });
    }
    
    const updated = {
      ...db.invitations[index],
      ...req.body,
      id: req.params.id // Prevent ID tampering
    };
    
    db.invitations[index] = updated;
    await writeDB(db);
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invitation.' });
  }
});

// 5. Get RSVPs for an invitation
app.get('/api/invitations/:id/rsvps', async (req, res) => {
  try {
    const db = await readDB();
    const rsvps = db.rsvps.filter(r => r.invitationId === req.params.id);
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve RSVPs.' });
  }
});

// 6. Submit a guest RSVP
app.post('/api/invitations/:id/rsvps', async (req, res) => {
  try {
    const { guestName, status, guestCount } = req.body;
    if (!guestName || !status) {
      return res.status(400).json({ error: 'Guest name and RSVP status are required.' });
    }
    
    const db = await readDB();
    
    // Check if RSVP for this guest already exists for this invitation, update if so, otherwise create new
    const existingIndex = db.rsvps.findIndex(
      r => r.invitationId === req.params.id && r.guestName.toLowerCase() === guestName.toLowerCase()
    );
    
    const rsvpData = {
      id: existingIndex !== -1 ? db.rsvps[existingIndex].id : generateId(),
      invitationId: req.params.id,
      guestName,
      status,
      guestCount: Number(guestCount) || 1,
      timestamp: new Date().toISOString()
    };
    
    if (existingIndex !== -1) {
      db.rsvps[existingIndex] = rsvpData;
    } else {
      db.rsvps.push(rsvpData);
    }
    
    await writeDB(db);
    res.status(200).json(rsvpData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit RSVP.' });
  }
});

// 7. Get wishes for an invitation
app.get('/api/invitations/:id/wishes', async (req, res) => {
  try {
    const db = await readDB();
    const wishes = db.wishes.filter(w => w.invitationId === req.params.id);
    res.json(wishes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve wishes.' });
  }
});

// 8. Submit a guest wish
app.post('/api/invitations/:id/wishes', async (req, res) => {
  try {
    const { guestName, message, emoji, signature } = req.body;
    if (!guestName || !message) {
      return res.status(400).json({ error: 'Guest name and message are required.' });
    }
    
    const db = await readDB();
    const newWish = {
      id: generateId(),
      invitationId: req.params.id,
      guestName,
      message,
      emoji: emoji || '',
      signature: signature || '',
      timestamp: new Date().toISOString()
    };
    
    db.wishes.push(newWish);
    await writeDB(db);
    res.status(201).json(newWish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit wish.' });
  }
});

app.listen(PORT, () => {
  console.log(`E-nvelope backend server running locally on http://localhost:${PORT}`);
});

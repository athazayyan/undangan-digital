import express from 'express';
import cors from 'cors';
import { readDB, writeDB } from './db/dbHelper.js';

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

// 1. Get all invitations
app.get('/api/invitations', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.invitations);
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

// 3. Create a new invitation
app.post('/api/invitations', async (req, res) => {
  try {
    const { hostName, eventType, theme, title, musicUrl, details, status } = req.body;
    
    if (!hostName || !eventType || !theme || !title) {
      return res.status(400).json({ error: 'Required fields are missing.' });
    }
    
    const db = await readDB();
    const newInvitation = {
      id: generateId(),
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

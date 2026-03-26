// Vercel Serverless Function: GET /api/admin/leads
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// --- Mongoose Setup ---
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('Connected to MongoDB');
}

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// JWT Authentication helper
function authenticateToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify JWT
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Access denied. Invalid or missing token.' });
  }

  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 }); // Newest first
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

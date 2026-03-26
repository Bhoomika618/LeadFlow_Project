// Vercel Serverless Function: DELETE /api/admin/deleteLead
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// --- Mongoose Setup ---
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// JWT Authentication helper
function authenticateToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify JWT (Must be an Admin)
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Access denied. Invalid or missing token.' });
  }

  const { id } = req.query; // Get lead ID from URL (e.g., /api/admin/deleteLead?id=123)

  if (!id) {
    return res.status(400).json({ error: 'Lead ID is required' });
  }

  try {
    await connectDB();
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
}

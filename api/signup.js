// Vercel Serverless Function: POST /api/signup
// This replaces the Express route that was in server/index.js

const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// --- Mongoose Setup ---
// Cache the connection to avoid reconnecting on every invocation
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('Connected to MongoDB');
}

// Define the Lead schema inline (since we can't easily import from server/models in serverless)
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

// Use existing model if already compiled, otherwise create it
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// Configure Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    await connectDB();

    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(409).json({ error: 'This email is already on the waitlist.' });
    }

    const newLead = new Lead({ name, email });
    await newLead.save();

    // Send confirmation email (fire and forget)
    const mailOptions = {
      from: `"LeadFlow Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to the LeadFlow Waitlist! 🎉',
      html: `
        <h2>Hi ${name},</h2>
        <p>You're officially on the list! We're thrilled to have you join the LeadFlow beta program.</p>
        <p>We will notify you the moment your account is ready.</p>
        <p>Best regards,<br/>The LeadFlow Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'Successfully joined the waitlist!', lead: newLead });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

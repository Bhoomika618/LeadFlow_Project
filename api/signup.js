// Vercel Serverless Function: POST /api/signup
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// --- Mongoose Setup ---
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Define the Lead schema
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    transporter.sendMail(mailOptions).catch((err) => {
      console.error('Error sending email:', err);
    });

    res.status(201).json({ message: 'Successfully joined the waitlist!', lead: newLead });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

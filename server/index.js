require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 5000;

/*
 * INTERVIEW PREP (Q32): What is Middleware in Express?
 * Middleware functions are functions that have access to the request object (req), the response object (res), 
 * and the next middleware function in the application’s request-response cycle.
 * They can execute any code, make changes to the request and the response objects, end the request-response cycle, 
 * or call the next middleware function in the stack.
 * 
 * Example below:
 * `cors()` allows our frontend (running on a different port) to communicate with this backend.
 * `express.json()` parses incoming requests with JSON payloads and is based on body-parser.
 */
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Configure Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Standard configuration for Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
 * INTERVIEW PREP (Q43): What are REST principles?
 * REST (Representational State Transfer) is an architectural style for designing networked applications.
 * Key principles include:
 * 1. Client-Server architecture (separating UI concerns from data storage concerns).
 * 2. Statelessness (each request from client to server must contain all information needed to understand and process it).
 * 3. Cacheability (responses must implicitly or explicitly define themselves as cacheable or not).
 * 4. Uniform Interface (using standard HTTP methods like GET, POST, PUT, DELETE logically).
 * 
 * INTERVIEW PREP (Q42): What are CRUD operations?
 * CRUD stands for Create, Read, Update, and Delete. These are the four basic functions models must be able to do.
 * In a REST context, they map to HTTP verbs:
 * - Create -> POST
 * - Read -> GET
 * - Update -> PUT / PATCH
 * - Delete -> DELETE
 * 
 * Example below: A RESTful POST endpoint performing a 'Create' operation.
 */
const signupLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 waitlist requests per window
  message: { error: 'Too many signup requests from this IP. Please try again after 5 minutes.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.post('/api/signup', signupLimiter, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    // 1. Create the lead in the database (CRUD: Create)
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(409).json({ error: 'This email is already on the waitlist.' });
    }

    const newLead = new Lead({ name, email });
    await newLead.save();

    // 2. Send the confirmation email workflow
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

    // We don't await the email so the response is fast.
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });

    // 3. Respond with a success status
    res.status(201).json({ message: 'Successfully joined the waitlist!', lead: newLead });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// --- ADMIN PROTECTED ROUTES ---
// Admin Login Route
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Admin JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Admin Fetch Leads Route (Protected + Read Operation)
app.get('/api/admin/leads', authenticateToken, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }); // Newest first
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// --- DEPLOYMENT PREPARATION ---
const path = require('path');
const staticPath = path.join(__dirname, '../dist');
app.use(express.static(staticPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

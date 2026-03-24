# LeadFlow - Full-Stack SaaS Landing Page

A complete, responsive, and highly interactive Full-Stack SaaS Landing Page built specifically for lead capture and management.

## 🚀 Features
- **Waitlist Capture Form:** Seamlessly captures names and emails directly into a cloud database.
- **Automated Email Verifications:** Uses Nodemailer to automatically send a branded "Welcome to the Waitlist" email to every new lead upon successful signup.
- **Admin Command Center:** A secure, JWT-authenticated dashboard located at `/admin` to view, manage, and track all captured leads in real-time.
- **Security Checkpoints:** Built-in rate limiting (3 requests per 5 minutes per IP) to prevent bot spam and database exhaustion.
- **"Wow" UX Factors:** Animated components using Framer Motion, instant visual form validation, Dark/Light mode toggling, and clean toast notifications.

## 🛠️ Tech Stack
- **Frontend Setup:** React.js, Vite, Tailwind CSS, Framer Motion, React Router DOM, React Hot Toast.
- **Backend Setup:** Node.js, Express.js, Mongoose, Nodemailer, JSON Web Tokens (JWT), Express Rate Limit.
- **Database:** MongoDB Atlas (Cloud Database).

## 💻 Running the Project Locally

### Prerequisites
Make sure you have Node.js installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/leadflow.git
cd leadflow
```

### 2. Install Dependencies
You need to install dependencies for both the frontend and the backend.
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3. Setup Environment Variables
Create a `.env` file inside the `server` directory and add the following keys. 
*(Note: Never push your actual `.env` file to GitHub!)*
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_16_character_app_password
JWT_SECRET=any_secret_string
ADMIN_PASSWORD=your_dashboard_password
```

### 4. Start the Application
You will need two terminal windows to run both servers locally.

**Terminal 1 (Backend):**
```bash
cd server
node index.js
```
*Should output: "Server is running on port 5000" and "Connected to MongoDB"*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Should output the localhost Vite link (e.g., http://localhost:5173)*

## 🌐 Project Structure
- `/src`: Contains all React frontend code (`App.jsx`, `AdminDashboard.jsx`, routing logic).
- `/server/index.js`: Contains all the Express backend logic, database connection string, Nodemailer setup, and API routes.
- `/server/models/Lead.js`: The Mongoose schema defining how lead data is stored in MongoDB.

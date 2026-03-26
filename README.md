# LeadFlow 🚀
### A Full-Stack SaaS Lead Management Platform

**LeadFlow** is a modern, responsive web application designed to capture and manage business leads efficiently. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and deployed as a **Serverless** application on Vercel.

---

## 🔗 Live Demo
Check out the live application here:  
👉 **[https://lead-flow-project-drab.vercel.app/](https://lead-flow-project-drab.vercel.app/)**

---

## ✨ Features
- **🚀 High-Conversion Landing Page:** Animated with Framer Motion for a premium user experience.
- **🛡️ Secure Signup:** Lead capture modal with real-time email validation and IP-based rate limiting.
- **✉️ Automated Emails:** Instant welcome emails via Nodemailer when a user joins the waitlist.
- **🔒 Admin Dashboard:** A private, JWT-authenticated dashboard to view and manage leads.
- **🗑️ Lead Management:** Full CRUD capabilities for admins (view and delete leads).
- **☁️ Serverless Architecture:** Scalable backend running on Vercel Serverless Functions.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Framer Motion, Vite
- **Backend:** Node.js, Express, Vercel Serverless Functions
- **Database:** MongoDB Atlas (NoSQL)
- **Security:** JSON Web Tokens (JWT), Express-Rate-Limit
- **Communication:** Nodemailer (SMTP/Gmail)

---

## 🚀 How to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Bhoomika618/LeadFlow_Project.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file (see below).
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables
To run this project, you will need to add the following variables to your environment:
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `ADMIN_PASSWORD`

---

### **Developed by Bhoomika** &bull; **Internship Project for Elevate Lab** 🎓

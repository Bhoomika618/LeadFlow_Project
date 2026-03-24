import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, BarChart3, Users, Zap, X, Sun, Moon, Loader2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function SignUpModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Live validation
  const isValidEmail = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome aboard! Check your inbox.");
        setName("");
        setEmail("");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
              Secure Your Spot
            </h3>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Join the Waitlist to get early access and exclusive updates on LeadFlow.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-50 ${
                      email && isValidEmail
                        ? "border-green-500 focus:border-green-500"
                        : "border-slate-200 dark:border-slate-700 focus:border-brand-500"
                    }`}
                  />
                  {email && isValidEmail && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:active:scale-100"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="p-8 bg-white dark:bg-slate-800 border border-slate-100/80 dark:border-slate-700 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-3xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-500 group"
    >
      <div className="flex items-center justify-center w-14 h-14 mb-8 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500" />
        <Icon className="w-7 h-7 relative z-10" />
      </div>
      <h3 className="mb-4 text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
        {title}
      </h3>
      <p className="leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
        {description}
      </p>
    </motion.div>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = 'light';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-brand-200 selection:text-brand-900 transition-colors duration-300 overflow-x-hidden">
      <Toaster position="bottom-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />
      
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:animate-float">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              LeadFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/60 dark:from-brand-900/20 via-slate-50 dark:via-slate-950 to-slate-50 dark:to-slate-950 transition-colors duration-300"></div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30 border border-brand-200/50 dark:border-brand-800/50 rounded-full hover:scale-105 transition-transform cursor-default"
          >
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-brand-500"></span>
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-brand-600"></span>
            </span>
            LeadFlow Beta Waitlist Open
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05]"
          >
            Stop losing leads. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-cyan-500 animate-pulse-slow inline-block">
              Start driving revenue.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-14 text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium"
          >
            The intelligent lead management system built for ambitious teams.
            Capture, track, and convert sales prospects without the spreadsheets.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row max-w-xl mx-auto gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
          >
            <div className="relative flex-1 group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="email"
                placeholder="Enter your work email"
                required
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 font-bold text-lg text-white bg-slate-900 dark:bg-brand-600 rounded-2xl hover:bg-brand-600 dark:hover:bg-brand-500 hover:-translate-y-1 active:scale-95 transition-all duration-300 whitespace-nowrap shadow-xl shadow-slate-900/20 dark:shadow-brand-500/20 w-full sm:w-auto"
            >
              Join Waitlist
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-sm text-slate-500 dark:text-slate-500 font-bold tracking-wide uppercase"
          >
            🎉 Join 2,000+ early adopters. No credit card required.
          </motion.p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-32 px-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-brand-100/50 dark:bg-brand-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              The spreadsheet era is over
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Managing leads across fragmented tools and clunky spreadsheets is
              causing you to bleed revenue. LeadFlow centralizes your pipeline effortlessly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard
              icon={Users}
              title="Automated Capture"
              description="Automatically capture leads from your website, forms, and social channels into one unified inbox."
              index={1}
            />
            <FeatureCard
              icon={BarChart3}
              title="Actionable Analytics"
              description="Gain deep insights into your sales pipeline, conversion rates, and team performance in real-time."
              index={2}
            />
            <FeatureCard
              icon={CheckCircle}
              title="Smart Follow-ups"
              description="Never miss a prospect. Set automated reminders and cadences to keep your pipeline moving forward."
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-75">
          <Zap className="w-5 h-5 text-slate-400" />
          <span className="text-lg font-bold text-slate-400 tracking-tight">
            LeadFlow
          </span>
        </div>
        <p className="text-slate-500">
          © {new Date().getFullYear()} LeadFlow. All rights reserved.
        </p>
      </footer>

      {/* The Sign Up Modal */}
      <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

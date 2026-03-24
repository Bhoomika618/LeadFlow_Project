import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Users, LogOut, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchLeads(token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        toast.success('Access Granted');
        fetchLeads(data.token);
      } else {
        toast.error(data.error || 'Invalid Password');
      }
    } catch (err) {
      toast.error('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async (token) => {
    setFetching(true);
    try {
      const response = await fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else if (response.status === 401 || response.status === 403) {
        handleLogout();
        toast.error('Session expired. Please log in again.');
      }
    } catch (err) {
      toast.error('Failed to fetch leads');
    } finally {
      setFetching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setLeads([]);
    toast.success('Logged out securely');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <Toaster position="bottom-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-brand-900/30 rounded-xl">
              <Shield className="w-8 h-8 text-brand-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Enter Vault Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all flex justify-center items-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unlock Vault'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pt-20">
      <Toaster position="bottom-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-500" />
              LeadFlow Command Center
            </h1>
            <p className="text-slate-400 mt-2">Managing {leads.length} captured leads in the pipeline.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {fetching ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800 text-sm uppercase tracking-wider text-slate-400">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <motion.tr 
                      key={lead._id || idx}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="p-4 font-medium text-white">{lead.name}</td>
                      <td className="p-4 text-slate-400">{lead.email}</td>
                      <td className="p-4 text-slate-500">{new Date(lead.createdAt || Date.now()).toLocaleDateString()} at {new Date(lead.createdAt || Date.now()).toLocaleTimeString()}</td>
                    </motion.tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-slate-500">No leads captured yet. Your pipeline is empty.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

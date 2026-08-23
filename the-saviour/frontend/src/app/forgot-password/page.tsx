"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Mail, ArrowRight, Loader2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSpamPopup, setShowSpamPopup] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
      setShowSpamPopup(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-warning/10 mb-4 shadow-[var(--shadow-glow)]">
            <ShieldCheck className="h-8 w-8 text-warning" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-secondary text-sm">Enter your officer email to receive reset instructions.</p>
        </div>

        <div className="glass p-8 rounded-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
          {!submitted ? (
            <form onSubmit={handleReset} className="space-y-5">
              {error && (
                <div className="text-danger text-sm font-medium bg-danger/10 p-3 rounded-md">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-warning focus:border-transparent transition-all"
                    placeholder="admin@saviour.ai"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-warning text-white py-2.5 rounded-lg font-medium shadow-sm hover:bg-warning/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
                {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="h-12 w-12 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Check your email</h3>
              <p className="text-secondary text-sm mb-6">We have sent password recovery instructions to {email}</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-primary hover:underline text-sm font-medium"
              >
                Try another email
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-secondary">
            Remembered your password? <Link href="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Attractive Spam Warning Popup */}
      <AnimatePresence>
        {showSpamPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-slate-100"
            >
              <button 
                onClick={() => setShowSpamPopup(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 rounded-full p-1.5 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex flex-col items-center text-center mt-2">
                <motion.div 
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="h-20 w-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-5 border-[6px] border-amber-100/50 shadow-inner"
                >
                  <AlertTriangle className="h-10 w-10" />
                </motion.div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Check Spam!</h3>
                
                <p className="text-sm text-slate-600 mb-8 leading-relaxed font-medium">
                  We've sent a password reset link to your email. Sometimes these emails get lost. Please check your <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded">Spam</strong> or <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded">Promotions</strong> folder if you don't see it in your inbox!
                </p>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSpamPopup(false)}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 text-sm uppercase tracking-wide cursor-pointer"
                >
                  Got it, I will check!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

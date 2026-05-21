"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, CheckCircle2, Volume2, VolumeX, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSystem } from "@/components/saviour/SystemProvider";
import { auth, googleProvider, db } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function UnifiedAuthPage() {
  const router = useRouter();
  const { setOfficerInfo, playNotify, audioEnabled, setAudioEnabled } = useSystem();
  
  // Tab control: default is "login" for /login page route
  const [authMode, setAuthMode] = useState<"register" | "login">("login");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Registration specific states
  const [registerStep, setRegisterStep] = useState<"form" | "verification_sent" | "verified">("form");
  const [showResendOnLogin, setShowResendOnLogin] = useState(false);
  const [showSpamPopup, setShowSpamPopup] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowResendOnLogin(false); // Hide the resend button if the user starts changing details
  };

  const saveUserToFirestore = async (uid: string, email: string | null, name: string | null) => {
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      name,
      role: "officer",
      createdAt: new Date().toISOString(),
    });
  };

  // ----------------------------------------
  // REGISTER LOGIC (Firebase Native Email Verification)
  // ----------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Set the display name
      await updateProfile(user, { displayName: formData.fullname });

      // 3. Send official Google/Firebase email verification
      await sendEmailVerification(user);

      // 4. Save user details in Firestore
      await saveUserToFirestore(user.uid, user.email, formData.fullname);

      // 5. Move to verification pending step (Keep signed in for easy resend)
      setRegisterStep("verification_sent");
      setShowSpamPopup(true);
    } catch (err: any) {
      console.error("Registration Error:", err);
      let friendlyMsg = err.message || "An unexpected error occurred during registration.";
      if (err.code === "auth/email-already-in-use") {
        friendlyMsg = "This email is already registered. Please switch to the 'Sign In' tab.";
      } else if (err.code === "auth/weak-password") {
        friendlyMsg = "Password is too weak. Please use at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMsg = "Invalid email format. Please check your email address.";
      }
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setError("Success: A fresh verification link has been dispatched to your Gmail.");
      } else {
        setError("Session expired. Please switch to the 'Sign In' tab, type your credentials, and click Resend if prompted.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification link.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToSignIn = async () => {
    await auth.signOut();
    setRegisterStep("form");
    setAuthMode("login");
    setError("");
  };

  // ----------------------------------------
  // LOGIN LOGIC (Standard Credentials Authentication with Verification Guard)
  // ----------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowResendOnLogin(false);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        setShowResendOnLogin(true);
        await auth.signOut();
        throw new Error("Your email address is not verified yet. Please check your Gmail inbox.");
      }

      // Fetch user role
      let role: "main_officer" | "sub_officer" = "sub_officer";
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        role = (userDoc.data().role as "main_officer" | "sub_officer") || "sub_officer";
      } else {
        await saveUserToFirestore(user.uid, user.email, user.displayName || "Unknown Officer");
      }

      const officerId = user.email ? user.email.split('@')[0].toUpperCase() : "OFFICER";
      
      setOfficerInfo(role, officerId);
      playNotify();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login Error:", err);
      let friendlyMsg = err.message || "Authentication failed. Check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        friendlyMsg = "Invalid email or passphrase. Please try again.";
      }
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendFromLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCredential.user);
      await auth.signOut();
      setShowResendOnLogin(false);
      setError("Success: A fresh verification link has been dispatched to your Gmail.");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification link.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // GOOGLE SINGLE SIGN-ON (Google Accounts are Pre-Verified by Google)
  // ----------------------------------------
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to database
      let role: "main_officer" | "sub_officer" = "sub_officer";
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await saveUserToFirestore(user.uid, user.email, user.displayName);
      } else {
        role = (userDoc.data().role as "main_officer" | "sub_officer") || "sub_officer";
      }

      if (authMode === "register") {
        // If registering via Google, force manual sign-in to be secure and consistent
        await auth.signOut();
        setRegisterStep("verified");
      } else {
        // If logging in, redirect immediately
        const officerId = user.email ? user.email.split('@')[0].toUpperCase() : "OFFICER";
        setOfficerInfo(role, officerId);
        playNotify();
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Failed to complete Google Authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 bg-[#f3f2f1] relative">
      
      {/* Audio Control Toggle */}
      <button 
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="fixed bottom-8 right-8 bg-white border border-slate-200 p-3 rounded-full shadow-lg text-slate-800 hover:bg-slate-50 transition-all z-50 cursor-pointer active:scale-95"
        title={audioEnabled ? "Mute System Sounds" : "Enable System Sounds"}
      >
        {audioEnabled ? <Volume2 className="h-5 w-5 text-slate-700" /> : <VolumeX className="h-5 w-5 text-slate-700" />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e6f4ea] text-[#00703c] rounded-full text-xs font-semibold mb-4 border border-[#00703c]/20 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-[#00703c]" />
            AI Powered Wildlife Protection
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-[#0b0c0c] whitespace-nowrap">
            {registerStep === "verified" ? "Verified" : "Command Portal"}
          </h1>
          <p className="text-slate-600 text-sm font-medium">
            {registerStep === "verified" 
              ? "Your Gmail address has been successfully verified."
              : "Access the Saviour AI Forest Surveillance and Command Mesh."
            }
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-md p-8 rounded-2xl animate-fade-in text-slate-800">
          
          {/* Tab Switcher (Visible unless verified/OTP phase of registration is active) */}
          {registerStep === "form" && (
            <div className="flex border border-slate-200 mb-6 bg-slate-100 p-1.5 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  authMode === "register"
                    ? "bg-[#00703c] text-white shadow-sm border border-transparent"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  authMode === "login"
                    ? "bg-[#00703c] text-white shadow-sm border border-transparent"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
            </div>
          )}

          {error && (
            <div className={`mb-6 p-3 rounded-lg flex flex-col gap-2 text-sm border ${
              error.startsWith("Success") 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <div className="flex items-center gap-3">
                {error.startsWith("Success") ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                )}
                <span>{error}</span>
              </div>
              {showResendOnLogin && authMode === "login" && (
                <button
                  type="button"
                  onClick={handleResendFromLogin}
                  disabled={loading}
                  className="mt-1 self-start text-xs font-bold text-[#00703c] hover:underline flex items-center gap-1 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  Resend Verification Email
                </button>
              )}
            </div>
          )}

          {/* REGISTER TAB: Step 1 (Registration form) */}
          {authMode === "register" && registerStep === "form" && (
            <>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      type="text" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00703c]/20 focus:border-[#00703c] transition-all placeholder:text-slate-400 text-sm font-medium"
                      placeholder="Officer Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00703c]/20 focus:border-[#00703c] transition-all placeholder:text-slate-400 text-sm font-medium"
                      placeholder="officer@saviour.ai"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      type="password" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00703c]/20 focus:border-[#00703c] transition-all placeholder:text-slate-400 text-sm font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#00703c] text-white py-2.5 rounded-lg font-bold hover:bg-[#005a30] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4 shadow-sm active:scale-[0.98] cursor-pointer tracking-wider text-sm border border-[#00703c]"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Gmail"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-center space-x-2">
                <span className="h-px w-full bg-slate-200"></span>
                <span className="text-xs text-slate-400 uppercase font-semibold">Or</span>
                <span className="h-px w-full bg-slate-200"></span>
              </div>

              <button 
                type="button"
                onClick={() => handleGoogleAuth()}
                disabled={loading}
                className="w-full mt-4 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {/* REGISTER TAB: Step 2 (Verification sent screen) */}
          {authMode === "register" && registerStep === "verification_sent" && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#00703c] mb-2 shadow-sm border border-emerald-100/50 animate-pulse">
                <Mail className="h-8 w-8 text-[#00703c]" />
              </div>
              <h2 className="text-lg font-bold text-[#0b0c0c]">Verify Your Gmail</h2>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-left leading-relaxed space-y-2">
                <p>We have dispatched an official Google verification link to your inbox:</p>
                <p className="font-bold text-[#0b0c0c] text-center bg-white p-2.5 rounded-lg border border-slate-200 select-all">{formData.email}</p>
                <p className="text-slate-500 font-medium">Please check your inbox (and spam folder) and click the link to verify your email. Once done, you can sign in to access the system.</p>
              </div>

              <button 
                onClick={handleProceedToSignIn}
                className="w-full bg-[#00703c] text-white py-2.5 rounded-lg font-bold hover:bg-[#005a30] transition-all flex items-center justify-center gap-2 mt-4 shadow-sm active:scale-[0.98] text-sm cursor-pointer border border-[#00703c]"
              >
                Proceed to Sign In <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={resendVerification}
                  disabled={loading}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all active:scale-[0.97] cursor-pointer"
                >
                  {loading ? "Resending..." : "Resend Link"}
                </button>
                <button
                  type="button"
                  onClick={() => { setRegisterStep("form"); setError(""); }}
                  className="flex-1 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.97] cursor-pointer"
                >
                  Back / Edit Email
                </button>
              </div>
            </div>
          )}

          {/* REGISTER TAB: Step 3 (Verified page prompting manual Sign In switch) */}
          {authMode === "register" && registerStep === "verified" && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#00703c] mb-2 shadow-sm border border-emerald-100/50 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-lg font-bold text-[#0b0c0c]">Registration Complete!</h2>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-left leading-relaxed space-y-2">
                <p className="font-semibold text-slate-800">🔒 Security Notice:</p>
                <p>Your Gmail address has been successfully verified, and your officer account is active on The Saviour network.</p>
                <p>To ensure secure credentials authentication, direct entry is restricted. Please sign in manually below.</p>
              </div>

              <button 
                onClick={() => {
                  setRegisterStep("form");
                  setAuthMode("login");
                  setError("");
                }}
                className="w-full bg-[#00703c] text-white py-3 rounded-lg font-bold hover:bg-[#005a30] transition-all flex items-center justify-center gap-2 mt-6 shadow-md active:scale-[0.98] text-sm cursor-pointer border border-[#00703c]"
              >
                Proceed to Sign In <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* LOGIN TAB FORM */}
          {authMode === "login" && (
            <>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700">Officer Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00703c]/20 focus:border-[#00703c] transition-all placeholder:text-slate-400 text-sm font-medium"
                      placeholder="officer@saviour.ai"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Passphrase</label>
                    <Link href="/forgot-password" className="text-xs text-[#00703c] hover:text-[#005a30] hover:underline font-semibold">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      type="password" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00703c]/20 focus:border-[#00703c] transition-all placeholder:text-slate-400 text-sm font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#00703c] text-white py-2.5 rounded-lg font-bold hover:bg-[#005a30] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4 shadow-sm active:scale-[0.98] cursor-pointer tracking-wider text-sm border border-[#00703c]"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In to Command Center"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-center space-x-2">
                <span className="h-px w-full bg-slate-200"></span>
                <span className="text-xs text-slate-400 uppercase font-semibold">Or</span>
                <span className="h-px w-full bg-slate-200"></span>
              </div>

              <button 
                type="button"
                onClick={() => handleGoogleAuth()}
                disabled={loading}
                className="w-full mt-4 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign In with Google
              </button>
            </>
          )}

        </div>

        {/* Back Link */}
        <div className="mt-6 text-center animate-fade-in">
          <Link href="/" className="text-xs font-semibold text-[#00703c] hover:text-[#005a30] flex items-center justify-center gap-1.5 transition-all">
            &larr; Return to Landing Page
          </Link>
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
                  We've sent a verification link to your email. Sometimes these emails get lost. Please check your <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded">Spam</strong> or <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded">Promotions</strong> folder if you don't see it in your inbox!
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

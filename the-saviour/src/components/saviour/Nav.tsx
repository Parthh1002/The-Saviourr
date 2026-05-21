"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2 backdrop-blur-xl bg-background/80 border-b border-border shadow-sm" : "py-4"
        }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 flex items-center justify-between">
        {/* Left: Logo */}
        <a href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <BrandLogo />
        </a>

        {/* Center: Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-mono font-bold uppercase tracking-[0.15em] text-slate-500">
          <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
          <a href="#methodology" className="hover:text-emerald-700 transition-colors">Method</a>
          <a href="#analytics" className="hover:text-emerald-700 transition-colors">Analytics</a>
          <a href="#officer" className="hover:text-emerald-700 transition-colors">Officer</a>
        </div>

        {/* Right: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="/signup"
            className="flex items-center justify-center px-4 py-1.5 rounded-md bg-emerald-800 text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
          >
            Register
          </a>
          <a
            href="/login"
            className="flex items-center justify-center px-4 py-1.5 rounded-md border border-slate-200 text-slate-600 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
          >
            Officer Login
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu (Overlay) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-4 font-mono font-bold uppercase text-sm tracking-widest text-slate-600">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#methodology" onClick={() => setMobileMenuOpen(false)}>Method</a>
            <a href="#analytics" onClick={() => setMobileMenuOpen(false)}>Analytics</a>
            <a href="#officer" onClick={() => setMobileMenuOpen(false)}>Officer</a>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-3">
              <a href="/signup" className="w-full py-3 bg-emerald-800 text-white text-center rounded-lg">Register</a>
              <a href="/login" className="w-full py-3 border border-slate-200 text-center rounded-lg">Officer Login</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

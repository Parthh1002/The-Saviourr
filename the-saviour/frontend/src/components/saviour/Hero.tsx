"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-emerald-400/10 blur-3xl rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 pt-24 md:pt-28 pb-8">
        {/* Live badge */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#00703c] font-bold opacity-0 animate-[fade-in_1s_ease_0.2s_forwards]">
          <span className="w-2 h-2 rounded-full bg-[#00703c] animate-pulse" />
          Live Surveillance • Active
          <span className="w-2 h-2 rounded-full bg-[#00703c] animate-pulse" />
        </div>
        <h1
          className="
            font-display
            text-3xl
            sm:text-5xl
            md:text-6xl
            lg:text-[5.5rem]
            font-bold
            leading-[1.15]
            tracking-tight
            text-center
            bg-[linear-gradient(90deg,_#02122e_0%,_#0b1f4d_25%,_#00703c_50%,_#0b1f4d_75%,_#02122e_100%)]
            bg-[length:175%_175%]
            bg-clip-text
            text-transparent
            opacity-0
            animate-[wildlifeGradient_6s_ease_infinite,fade-in_1.2s_var(--ease-out-expo)_0.75s_forwards]
            break-words
            px-2
          "
        >
          Protecting Wildlife
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1s_forwards]">
          Real-Time Anti-Poaching Surveillance System. Watching every leaf,
          every footprint — so the wild stays wild.
        </p>

        {/* CTA buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1.3s_forwards] z-20 w-full sm:w-auto">
          <a 
            href="/login" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#00703c] text-white text-sm font-semibold shadow-[0_0_30px_rgba(0,112,60,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer block text-center"
          >
            Explore System
          </a>
          <a 
            href="https://youtu.be/bVBt6yWTc9w?si=XWB662e8_695ixK1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-300 block text-center cursor-pointer"
          >
            ▶ Watch Overview
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-10 sm:mt-14 grid grid-cols-3 gap-4 sm:gap-12 opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1.6s_forwards]">
          {[
            { v: "98.4%", l: "Detection accuracy" },
            { v: "<200ms", l: "Alert latency" },
            { v: "24/7", l: "Forest surveillance" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-xl sm:text-2xl md:text-3xl text-[#00703c] font-bold">
                {s.v}
              </div>
              <div className="mt-1 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest text-slate-400">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border border-slate-300 flex items-start justify-center pt-2 relative overflow-hidden">
          <span className="w-1 h-2 rounded-full bg-emerald-500 animate-scroll-hint" />
        </div>
        <ChevronDown className="w-3 h-3 animate-bounce" />
      </div>
    </section>
  );
}
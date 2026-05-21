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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-emerald-400/10 blur-3xl rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-12">
        {/* Live badge */}
        <div className="mb-8 flex items-center gap-3 text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#00703c] font-bold opacity-0 animate-[fade-in_1s_ease_0.2s_forwards]">
          <span className="w-2 h-2 rounded-full bg-[#00703c] animate-pulse" />
          Live Surveillance • Active
          <span className="w-2 h-2 rounded-full bg-[#00703c] animate-pulse" />
        </div>
        <h1
          className="
            font-display
            text-4xl
            sm:text-6xl
            md:text-7xl
            lg:text-[6rem]
            font-bold
            leading-[1.2]
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
        <p className="mt-8 max-w-2xl text-base md:text-xl text-slate-500 leading-relaxed opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1s_forwards]">
          Real-Time Anti-Poaching Surveillance System. Watching every leaf,
          every footprint — so the wild stays wild.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1.3s_forwards] z-20">
          <a 
            href="/login" 
            className="px-8 py-4 rounded-full bg-[#00703c] text-white font-semibold shadow-[0_0_40px_rgba(0,112,60,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer block text-center"
          >
            Explore System
          </a>
          <a 
            href="https://youtu.be/bVBt6yWTc9w?si=XWB662e8_695ixK1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-300 block text-center cursor-pointer"
          >
            ▶ Watch Overview
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16 opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1.6s_forwards]">
          {[
            { v: "98.4%", l: "Detection accuracy" },
            { v: "<200ms", l: "Alert latency" },
            { v: "24/7", l: "Forest surveillance" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-2xl md:text-3xl text-[#00703c] font-bold">
                {s.v}
              </div>
              <div className="mt-1 text-[10px] md:text-xs uppercase tracking-widest text-slate-400">
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
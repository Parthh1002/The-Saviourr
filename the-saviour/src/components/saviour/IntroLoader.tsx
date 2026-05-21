"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const messages = [
  "INITIALIZING_AI_CORE...",
  "SYNCING_SATELLITE_FEED...",
  "ESTABLISHING_SECURE_UPLINK...",
  "SCANNING_WILDLIFE_HABITATS...",
  "CALIBRATING_THREAT_DETECTION...",
  "ACTIVATING_NEURAL_NETWORK...",
  "LOADING_SURVEILLANCE_MODULES...",
  "THE_SAVIOUR_ONLINE."
];

export const IntroLoader = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 800);

    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 2000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        scale: 1.2, 
        filter: "blur(40px)", 
        opacity: 0,
        transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
      }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.1)_0%,_black_70%)]" />
      </div>

      {/* Moving Scanline */}
      <motion.div 
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-emerald-500/30 blur-[1px] shadow-[0_0_15px_rgba(16,185,129,0.5)] pointer-events-none z-10"
      />

      {/* Logo Container */}
      <div className="relative flex flex-col items-center z-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-emerald-500/90 font-display text-3xl md:text-5xl font-black tracking-[0.4em] mb-3 uppercase"
        >
          The
        </motion.span>
        
        <div className="relative">
          {/* Deep Blur Glow */}
          <div className="absolute inset-0 blur-[60px] bg-emerald-500/20 rounded-full" />
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: glitch ? [0, -2, 2, -1, 0] : 0
            }}
            transition={{ duration: 0.5 }}
            className={`text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-emerald-500 relative z-10 animate-intro-color-flow`}
            style={{
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 40%, #10b981 100%)',
              backgroundSize: '100% 200%'
            }}
          >
            SAVIOUR
          </motion.h1>

          {/* Glitch Overlay (Occasionally visible) */}
          {glitch && (
            <div className="absolute inset-0 text-7xl md:text-9xl font-black tracking-tighter text-emerald-500/30 mix-blend-screen translate-x-1">
              SAVIOUR
            </div>
          )}
        </div>
      </div>

      {/* AI Boot Sequence */}
      <div className="mt-12 h-8 flex items-center gap-3 font-mono text-sm md:text-lg tracking-[0.15em] text-emerald-500/70 z-20 font-bold">
        <Terminal size={18} className="animate-pulse" />
        <AnimatePresence mode="wait">
          <motion.span
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {messages[currentMessageIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-24 z-20"
      >
        <p className="italic text-2xl md:text-4xl font-display tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-100 animate-shimmer-text opacity-90 text-center px-4 leading-relaxed">
          "Saving what's left. Protecting what's right."
        </p>
      </motion.div>

      {/* Loading Bar at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5 z-30">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5.5, ease: "easeInOut" }}
          className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
        />
      </div>

    </motion.div>
  );
};

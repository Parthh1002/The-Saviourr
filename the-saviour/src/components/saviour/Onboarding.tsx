"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Plane, 
  Brain, 
  Thermometer, 
  Target, 
  Bell, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  Terminal,
  Activity,
  Globe,
  Radar
} from "lucide-react";

// --- Types & Data ---
type Step = {
  id: number;
  title: string;
  description: string;
  icon: any;
  phoneContent: "drone" | "ai" | "thermal" | "tracking" | "alert";
};

const STEPS: Step[] = [
  {
    id: 1,
    title: "Drone Monitoring",
    description: "Autonomous drone swarms patrol the canopy 24/7, using obstacle avoidance to navigate dense forests.",
    icon: Plane,
    phoneContent: "drone"
  },
  {
    id: 2,
    title: "AI Threat Detection",
    description: "Neural networks analyze multi-class entities in real-time, instantly flagging poachers from wildlife.",
    icon: Brain,
    phoneContent: "ai"
  },
  {
    id: 3,
    title: "Thermal Vision",
    description: "Advanced infrared imaging pierces through darkness and foliage, leaving no heat signature unnoticed.",
    icon: Thermometer,
    phoneContent: "thermal"
  },
  {
    id: 4,
    title: "Wildlife Tracking",
    description: "Non-invasive tracking algorithms build behavioral maps to protect endangered species in their habitat.",
    icon: Target,
    phoneContent: "tracking"
  },
  {
    id: 5,
    title: "Real-Time Alerts",
    description: "Mission-critical alerts reach the nearest ranger units within seconds of a verified threat detection.",
    icon: Bell,
    phoneContent: "alert"
  }
];

// --- Sub-components ---

const BackgroundElements = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
    {/* Radar Rings */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {[400, 700, 1000].map((size, i) => (
        <motion.div
          key={size}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0, 0.05, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
          className="absolute border border-emerald-500/20 rounded-full"
          style={{ width: size, height: size, left: -size/2, top: -size/2 }}
        />
      ))}
    </div>

    {/* Floating Particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ 
          y: [-20, 20, -20], 
          x: [-10, 10, -10],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
        className="absolute w-1 h-1 bg-emerald-500 rounded-full"
        style={{ 
          top: `${Math.random() * 100}%`, 
          left: `${Math.random() * 100}%` 
        }}
      />
    ))}
  </div>
);

const PhoneSimulation = ({ content }: { content: Step["phoneContent"] }) => {
  return (
    <div className="relative w-full h-full bg-[#05070a] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
      {/* HUD Header */}
      <div className="p-4 flex justify-between items-center border-b border-white/10 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400/80 bg-black/40 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          SATELLITE_LINK: OPTIMAL
        </div>
        <div className="flex items-center gap-3">
          <span>LAT: 26.3_N</span>
          <span className="opacity-40">|</span>
          <span>LNG: 93.2_E</span>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col gap-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0"
          >
            {/* Video Background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-full object-cover opacity-60 ${content === 'thermal' ? 'hue-rotate-[140deg] saturate-[3] brightness-125' : ''}`}
            >
              <source 
                src={
                  content === "drone" ? "/videos/Drone.mp4" :
                  content === "ai" ? "/videos/Human with gun.mp4" :
                  content === "thermal" ? "/videos/tiger.mp4" :
                  content === "tracking" ? "/videos/deer.mp4" :
                  "/videos/vehicle.mp4"
                } 
                type="video/mp4" 
              />
            </video>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
            
            {/* HUD Overlays based on content */}
            <div className="absolute inset-0 p-4 font-mono z-10 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <div className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    LIVE_FEED_01
                  </div>
                  <div className="text-[10px] text-white/60">
                    FPS: 60.0
                  </div>
                </div>
                
                {content === "ai" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl backdrop-blur-sm"
                  >
                    <div className="text-[9px] text-red-400 font-bold uppercase mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Threat Detected
                    </div>
                    <div className="text-[11px] text-white font-bold">Class: Human (Armed)</div>
                    <div className="text-[9px] text-white/60">Confidence: 98.4%</div>
                  </motion.div>
                )}

                {content === "thermal" && (
                  <div className="mt-4 space-y-2">
                    <div className="text-[8px] text-orange-400 uppercase tracking-widest">Thermal_Signature_Found</div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-1 w-6 bg-orange-500/40 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ width: ["0%", "100%", "0%"] }} 
                            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                            className="h-full bg-orange-500" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {/* Target Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-emerald-400" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-4 bg-emerald-400" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-emerald-400" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-px bg-emerald-400" />
                  <div className="w-4 h-4 border border-emerald-400 rounded-full" />
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-[8px] text-slate-400 uppercase">Processing_Load</div>
                    <div className="text-[8px] text-emerald-400">12%</div>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["20%", "45%", "30%"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* HUD Footer */}
        <div className="mt-auto p-4 pt-0 grid grid-cols-2 gap-2 z-20">
          <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-3 font-mono text-[7px] text-slate-400 uppercase leading-tight">
            <span className="text-white/40 block mb-1">System_Stats</span>
            Uptime: 142:12:05
            <br />
            Nodes: 1,244 Active
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md p-3 font-mono text-[7px] text-emerald-400 uppercase leading-tight">
            <span className="text-emerald-400/40 block mb-1">Network_Status</span>
            Encrypted: AES-256
            <br />
            Latency: 14ms
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"startup" | "tutorial">("startup");
  const [currentStep, setCurrentStep] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const fullBootLines = [
    "> INITIATING_SYSTEM_BOOT...",
    "> LOADING_NEURAL_WEIGHTS... [DONE]",
    "> CONNECTING_SATELLITE_MESH... [OK]",
    "> SYNCHRONIZING_FIELD_NODES...",
    "> GLOBAL_SURVEILLANCE_ACTIVE",
    "> AUTHENTICATING_MISSION_PROTOCOL...",
    "> ACCESS_GRANTED: THE_SAVIOUR_COMMAND_v10.0"
  ];

  useEffect(() => {
    if (phase === "startup") {
      let i = 0;
      const interval = setInterval(() => {
        setBootLines(prev => [...prev, fullBootLines[i]]);
        i++;
        if (i === fullBootLines.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("tutorial"), 1000);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white text-slate-900 font-display select-none overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "startup" ? (
          <motion.div
            key="startup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 bg-[#05070a] flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full font-mono text-emerald-500 text-sm space-y-2">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="w-8 h-8 animate-pulse" />
                <span className="text-xl font-bold tracking-tighter">THE SAVIOUR</span>
              </div>
              {bootLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2"
                >
                  <span className="opacity-50 tracking-tighter">0{i+1}</span>
                  <span>{line}</span>
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-5 bg-emerald-500 inline-block align-middle ml-1"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tutorial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-full flex flex-col"
          >
            <BackgroundElements />

            {/* Header HUD */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-800 rounded-lg text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Command Center <span className="text-emerald-600">Active</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Global Coverage
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Live Stream: OK
                </div>
              </div>
              <button 
                onClick={onComplete}
                className="px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-mono uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Skip Mission
              </button>
            </header>

            {/* Main Tutorial Area */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-8 md:p-20 gap-16 md:gap-24">
              
              {/* Left: Content Card */}
              <div className="w-full max-w-xl">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 font-bold">
                      <div className="w-8 h-px bg-emerald-600/30" />
                      Chapter 10 — The Onboarding
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-none">
                      Protecting <br /> <span className="relative">Wildlife
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className="absolute -bottom-2 left-0 h-1.5 bg-emerald-600/10 rounded-full" 
                        />
                      </span>
                    </h1>
                    <p className="text-slate-500 font-mono text-sm tracking-wide max-w-md">
                      Every signal matters. Every movement is tracked. <br />
                      <span className="text-emerald-800 font-bold underline underline-offset-4 decoration-emerald-200">Protecting life through intelligence.</span>
                    </p>
                  </div>

                  {/* Tutorial Card (Glass) */}
                  <div className="relative p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] uppercase font-bold tracking-widest mb-6">
                        <Terminal className="w-3 h-3" />
                        Module 0{currentStep + 1}
                      </div>

                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
                          {React.createElement(STEPS[currentStep].icon, { className: "w-8 h-8" })}
                        </div>
                        <div className="space-y-4">
                          <h2 className="text-3xl font-bold text-slate-900">{STEPS[currentStep].title}</h2>
                          <p className="text-slate-500 leading-relaxed max-w-sm">
                            {STEPS[currentStep].description}
                          </p>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="mt-12 flex items-center gap-4">
                        <button 
                          onClick={handlePrev}
                          disabled={currentStep === 0}
                          className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        
                        <button 
                          onClick={handleNext}
                          className="flex-1 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center gap-3 group overflow-hidden relative"
                        >
                          <span className="relative z-10 font-bold uppercase tracking-widest text-[11px]">
                            {currentStep === STEPS.length - 1 ? "Initialize Surveillance" : "Next Module"}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                          <motion.div 
                            className="absolute inset-0 bg-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity" 
                          />
                        </button>

                        <div className="font-mono text-[11px] text-slate-400 px-4">
                          0{currentStep + 1} / 05
                        </div>
                      </div>
                    </div>

                    {/* Progress dots */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-px px-px">
                      {STEPS.map((_, i) => (
                        <div key={i} className="flex-1 bg-slate-100">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: i === currentStep ? '100%' : i < currentStep ? '100%' : 0 }}
                            className="h-full bg-emerald-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right: Phone Simulation */}
              <div className="hidden lg:block relative group">
                {/* Spotlight effect behind phone */}
                <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full scale-150 animate-pulse" />
                
                <div className="relative w-[340px] h-[680px] p-4 bg-[#111] rounded-[3.5rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] border-[8px] border-slate-200">
                  {/* Dynamic Island */}
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50 border border-white/10" />
                  
                  <PhoneSimulation content={STEPS[currentStep].phoneContent} />
                  
                  {/* Side Buttons */}
                  <div className="absolute -left-[10px] top-32 w-1 h-12 bg-slate-200 rounded-l-md" />
                  <div className="absolute -left-[10px] top-48 w-1 h-20 bg-slate-200 rounded-l-md" />
                  <div className="absolute -right-[10px] top-36 w-1 h-24 bg-slate-200 rounded-r-md" />
                </div>

                {/* Floating Indicators */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-12 -right-20 glass-premium p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[160px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Radar className="w-3 h-3 text-emerald-600" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Scanning</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-emerald-600" 
                    />
                  </div>
                </motion.div>
              </div>

            </div>

            {/* Corner HUD Details */}
            <div className="absolute bottom-8 left-8 flex items-center gap-6 font-mono text-[9px] uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                System v10.0.1
              </div>
              <div>Buffer: 124ms</div>
            </div>
            
            <div className="absolute bottom-8 right-8 flex items-center gap-4 font-mono text-[9px] uppercase tracking-widest text-slate-400 text-right">
              <div>Protected Forest Region: <span className="text-emerald-700 font-bold">KAZIRANGA_EAST</span></div>
              <Globe className="w-4 h-4 text-emerald-800" />
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

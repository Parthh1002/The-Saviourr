"use client";

import React, { useState } from "react";
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

export function Chapter10() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <section id="chapter10" className="relative py-32 md:py-44 px-6 bg-white overflow-hidden border-t border-slate-100">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500/5 rounded-full" />
      
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-24 space-y-6">
          <div className="flex items-center justify-center gap-4 text-sm md:text-base font-mono uppercase tracking-[0.4em] text-slate-400">
            <div className="w-12 h-px bg-slate-200" />
            Chapter 10 — The Onboarding
            <div className="w-12 h-px bg-slate-200" />
          </div>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-none">
            Protecting <br /> <span className="relative inline-block">Wildlife
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -bottom-2 left-0 h-2 bg-emerald-600/10 rounded-full" 
              />
            </span>
          </h2>
          <div className="max-w-xl mx-auto space-y-2">
            <p className="text-slate-500 font-mono text-xs md:text-sm tracking-widest uppercase">
              Every signal matters. Every movement is tracked.
            </p>
            <p className="text-emerald-800 font-bold underline underline-offset-8 decoration-emerald-200 text-sm md:text-base cursor-default hover:text-emerald-600 transition-colors">
              Protecting life through intelligence.
            </p>
          </div>
        </div>

        {/* Interactive Content Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Info Card */}
          <div className="space-y-8 order-2 lg:order-1">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] uppercase font-bold tracking-[0.2em] mb-10">
                  <Terminal className="w-3 h-3" />
                  Module 0{currentStep + 1}
                </div>

                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-2xl shadow-emerald-900/20">
                    {React.createElement(STEPS[currentStep].icon, { className: "w-10 h-10" })}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{STEPS[currentStep].title}</h3>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                      {STEPS[currentStep].description}
                    </p>
                  </div>
                </div>

                {/* Progress & Controls */}
                <div className="mt-16 flex items-center gap-6">
                  <div className="flex gap-4">
                    <button 
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={handleNext}
                      disabled={currentStep === STEPS.length - 1}
                      className="px-10 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center gap-4 group transition-all hover:bg-emerald-800"
                    >
                      <span className="font-bold uppercase tracking-widest text-[11px]">Next Module</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 ml-auto">
                    0{currentStep + 1} / 05
                  </div>
                </div>
              </div>

              {/* Progress Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 flex gap-1 px-1">
                {STEPS.map((_, i) => (
                  <div key={i} className="flex-1 bg-slate-50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: i <= currentStep ? '100%' : 0 }}
                      className="h-full bg-emerald-600"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Phone Simulation */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
            
            <div className="relative w-[320px] h-[640px] md:w-[350px] md:h-[700px] p-4 bg-[#111] rounded-[4rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] border-[10px] border-slate-200 transition-transform hover:scale-105 duration-700">
              {/* Dynamic Island */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-50 border border-white/5" />
              
              <PhoneSimulation content={STEPS[currentStep].phoneContent} />
              
              {/* Floating Mission Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Surveillance</div>
                    <div className="text-xs font-bold text-slate-900">MISSION_ACTIVE</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

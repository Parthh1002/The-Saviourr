"use client";
import { motion } from "framer-motion";
import { Maximize2, Shield, Radio, Activity } from "lucide-react";

export function VideoFrame() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-neon/20 bg-neon/5 text-neon text-[10px] font-mono uppercase tracking-[0.3em] mb-4">
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                Live Command Interface
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Surveillance <span className="text-shimmer">Intelligence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Real-time edge processing across the entire forest mesh. Watching every movement with AI-driven precision.
            </p>
        </div>

        {/* Cinematic Frame Container */}
        <div className="relative group">
          
          {/* Animated Border Light */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-neon/50 via-white/5 to-neon/50 rounded-[2rem] opacity-30 blur-[2px] group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          {/* Main Glass Frame */}
          <div className="relative rounded-[1.8rem] overflow-hidden border border-white/10 glass shadow-[0_0_80px_rgba(16,185,129,0.05)] aspect-video">
            
            {/* Background Video */}
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-80"
              style={{ filter: 'brightness(0.8) contrast(1.1)' }}
            >
              <source src="/videos/Drone.mp4" type="video/mp4" />
            </video>

            {/* AI HUD OVERLAYS */}
            <div className="absolute inset-0 pointer-events-none p-6 md:p-10 flex flex-col justify-between">
              
              {/* Top Row HUD */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-neon bg-black/40 backdrop-blur-md px-3 py-1 rounded-sm border border-neon/30">
                        <Radio className="w-3 h-3 animate-pulse" />
                        LIVE AI SURVEILLANCE // NODE-04A
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-white/60 bg-black/40 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
                        LAT: 12.93° N // LON: 77.61° E
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end gap-1 text-right">
                        <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Network Status</span>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-neon shadow-[0_0_5px_rgba(16,185,129,1)]' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl p-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/10 transition-colors pointer-events-auto cursor-pointer">
                        <Maximize2 className="w-5 h-5" />
                    </div>
                </div>
              </div>

              {/* Center Target Box */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-40">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-neon/30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-neon/30" />
              </div>

              {/* Bottom Row HUD */}
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-neon" />
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Active Protection</p>
                            <p className="text-sm font-bold text-white uppercase tracking-tighter">Anti-Poaching System Online</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-mono text-white/40 mb-1">FPS</span>
                        <span className="text-neon font-bold text-sm">60</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-mono text-white/40 mb-1">DATA</span>
                        <span className="text-neon font-bold text-sm">4.2 GB/s</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-mono text-white/40 mb-1">LATENCY</span>
                        <span className="text-neon font-bold text-sm">12ms</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Scan Line Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="w-full h-[2px] bg-neon shadow-[0_0_20px_rgba(16,185,129,1)] animate-scan" />
            </div>

          </div>

          {/* Decorative Corner Holograms */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-neon/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neon/5 rounded-full blur-[60px] pointer-events-none" />
          
        </div>

        {/* Bottom Labels */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 font-mono text-[10px] text-white/30 uppercase tracking-[0.4em]">
            <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> Realtime Forest Monitoring</span>
            <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> Encrypted Transmission</span>
            <span className="flex items-center gap-2"><Radio className="w-3 h-3" /> Satellite Mesh Active</span>
        </div>

      </div>
    </section>
  );
}

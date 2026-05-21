"use client";
import { motion } from "framer-motion";
import { useReveal } from "@/hooks/use-reveal";
import { AlertTriangle, MessageSquare, Mail, MapPin, Shield } from "lucide-react";

export function Alerts() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-background" />
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[140px] -z-10 opacity-20"
        style={{ background: "rgba(16, 185, 129, 0.15)" }}
      />

      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-4 text-xl font-mono uppercase tracking-[0.3em] text-emerald-600/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-blink" />
            Chapter 06 — Alert System
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            When seconds matter, <br />
            <span className="text-emerald-600">everyone gets notified.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
            The instant a verified threat is detected, alerts fan out across every
            channel — push notifications, SMS, email, and dispatch radio. Nearest
            rangers see the live feed before they arrive.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            {[
              { icon: MessageSquare, l: "SMS Dispatch" },
              { icon: Mail, l: "Email Alerts" },
              { icon: MapPin, l: "Geo-Routing" },
              { icon: AlertTriangle, l: "Radio Override" },
            ].map(({ icon: Icon, l }) => (
              <div key={l} className="glass rounded-xl p-4 flex items-center gap-3">
                <Icon className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />
                <span className="text-xs font-mono uppercase tracking-wider">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={ref} className="reveal relative h-[650px] flex items-center justify-center">
          {/* iPhone 17 Pro Mockup - Enhanced to match image */}
          <div className="relative w-[320px] h-[640px] bg-[#08090a] rounded-[4rem] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-[1px] border-white/5 overflow-hidden group">
            {/* Bezels */}
            <div className="absolute inset-0 bg-[#08090a] rounded-[3.8rem] border-[6px] border-[#151719]" />
            
            {/* Dynamic Island */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50 border border-white/10" />

            <div className="relative w-full h-full bg-[#08090a] rounded-[3.5rem] overflow-hidden p-6">
              {/* Status bar */}
              <div className="flex justify-between items-center px-4 pt-2 mb-12">
                <span className="text-[11px] font-bold text-white">09:41</span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-4 h-2 border border-white/30 rounded-sm" />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <NotifCard
                  delay="0s"
                  title="Poacher detected"
                  body="Node A-14 · 2 humans · weapon flagged · 1.4km NE"
                />
                <NotifCard
                  delay="0.4s"
                  title="Rhino in zone"
                  body="Same vector · ETA 6 min · dispatching team Bravo"
                />
                <NotifCard
                  delay="0.8s"
                  title="Live feed available"
                  body="Tap to view 1080p IR stream from Node A-14"
                />
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Screen Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>

          {/* Decorative rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-emerald-500/5" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-emerald-500/10 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function NotifCard({
  delay,
  title,
  body,
}: {
  delay: string;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: parseFloat(delay), duration: 0.6 }}
      className="bg-[#1c1e26]/80 backdrop-blur-xl rounded-[2rem] p-5 border border-white/5 shadow-2xl relative overflow-hidden group"
    >
      <div className="flex flex-col gap-2 relative z-10">
        {/* Header: SAVIOUR AI + now */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600/20 flex items-center justify-center border border-emerald-500/20">
              <Shield className="w-5 h-5 text-emerald-500" strokeWidth={2} />
            </div>
            <span className="text-[13px] font-bold text-white tracking-tight">SAVIOUR AI</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500">now</span>
        </div>
        
        {/* Content */}
        <div className="pl-0">
          <div className="text-[13px] font-bold text-white mb-0.5">{title}</div>
          <p className="text-[12px] text-slate-400 leading-snug font-medium">{body}</p>
        </div>
      </div>
      
      {/* Subtle light sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
    </motion.div>
  );
}

"use client";
import { useReveal } from "@/hooks/use-reveal";
import { ShieldCheck, UserPlus, Mail, ArrowRight } from "lucide-react";

export function RegistrationCTA() {
  const ref = useReveal<HTMLDivElement>();
  
  return (
    <section id="register-cta" className="relative py-24 px-6 overflow-hidden bg-background/50 border-y border-border/50">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-accent/80 mb-6">
            <span className="w-12 h-px bg-accent/40" />
            Join the Mission
          </div>
          <h2 className="font-display text-4xl font-semibold tracking-tight leading-tight mb-6">
            Help protect wildlife with <br />
            <span className="text-shimmer">AI-powered surveillance.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Register as a forest officer or researcher to gain access to our advanced detection network, real-time alerts, and data analytics tools.
          </p>
        </div>

        <div ref={ref} className="reveal w-full max-w-sm">
          <div className="glass p-8 rounded-3xl border-accent/20 hover:border-accent/40 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="w-6 h-6 text-accent" />
              <div className="font-display text-lg font-semibold">Register Account</div>
            </div>
            
            <p className="text-sm text-secondary mb-8">
              Fill out the registration form to join the Saviour network and start receiving alerts from your assigned sector.
            </p>

            <a
              href="/signup"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-accent text-white font-medium tracking-wide hover:scale-[1.02] transition-transform group shadow-[var(--shadow-glow-blue)]"
            >
              Sign Up Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

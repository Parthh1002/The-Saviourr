"use client";
import { useReveal } from "@/hooks/use-reveal";
import { ArrowRight } from "lucide-react";

export function Impact() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="impact" className="relative py-40 md:py-56 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-forest/40 to-background" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full -z-10"
        style={{
          background: "radial-gradient(circle, rgba(11, 102, 35, 0.18) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="reveal mx-auto max-w-5xl text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-neon mb-8">
          ⸺ Final Word ⸺
        </div>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05]">
          Protecting wildlife today <br />
          is <span className="text-shimmer">preserving tomorrow.</span>
        </h2>
        <p className="mt-10 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          The Saviour isn't just a system. It's a promise — that the wild
          places of the earth will outlive us, watched over by intelligence
          that never sleeps.
        </p>
      </div>
    </section>
  );
}

export function Enter() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="enter" className="relative py-32 md:py-44 px-6">
      <div ref={ref} className="reveal mx-auto max-w-4xl text-center">
        <h3 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
          Ready to step inside?
        </h3>
        <p className="mt-4 text-muted-foreground">
          Enter the live platform — explore reserves, view detections, manage rangers.
        </p>
        <a
          href="/login"
          className="mt-10 inline-flex items-center gap-3 px-8 py-5 rounded-full bg-neon text-primary-foreground font-medium tracking-wide hover:scale-105 transition-transform group"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          Enter The Platform
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <footer className="mt-32 pt-10 border-t border-border max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        <div>© The Saviour · Anti-Poaching Intelligence</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon animate-pulse-glow" />
          All systems operational
        </div>
      </footer>
    </section>
  );
}

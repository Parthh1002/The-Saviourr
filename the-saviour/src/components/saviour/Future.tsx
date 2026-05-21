"use client";
import { useReveal } from "@/hooks/use-reveal";
import { Plane, Moon, Waves, Globe2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const future: { icon: LucideIcon; t: string; d: string }[] = [
  { icon: Plane, t: "Drone Surveillance", d: "Autonomous patrol drones with onboard inference for live aerial coverage." },
  { icon: Moon, t: "Night Vision & Thermal", d: "Hybrid thermal + IR imaging for 24-hour visibility under any conditions." },
  { icon: Waves, t: "Multi-Sensor Detection", d: "Acoustic, motion, and seismic sensors fused with vision for 360° awareness." },
  { icon: Globe2, t: "Continental Deployment", d: "Federated learning across reserves — every node makes the network smarter." },
];

export function Future() {
  return (
    <section className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          {future.map((f, i) => (
            <Card key={f.t} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Header() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal max-w-3xl">
      <div className="flex items-center gap-4 text-xl font-mono uppercase tracking-[0.3em] text-neon/70 mb-6">
        <span className="w-12 h-px bg-neon/40" />
        Chapter 09 — Future Scope
      </div>
      <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
        What comes <span className="text-shimmer">next.</span>
      </h2>
    </div>
  );
}

function Card({ icon: Icon, t, d, index }: { icon: LucideIcon; t: string; d: string; index: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal group relative glass rounded-3xl p-8 md:p-10 overflow-hidden hover:border-neon/40 transition-all duration-700"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
        style={{ background: "rgba(11, 102, 35, 0.25)" }}
      />
      <div className="relative z-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon/50 mb-6">
          Future · 0{index + 1}
        </div>
        <Icon className="w-10 h-10 text-neon mb-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.2} />
        <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3">{t}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{d}</p>
      </div>
    </div>
  );
}

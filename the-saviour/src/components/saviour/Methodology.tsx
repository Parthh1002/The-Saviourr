"use client";
import { useReveal } from "@/hooks/use-reveal";
import { Database, Filter, Brain, Crosshair, GitBranch, Siren } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: { icon: LucideIcon; label: string; sub: string }[] = [
  { icon: Database, label: "Data Collection", sub: "Camera traps + drone capture stream raw footage to edge nodes." },
  { icon: Filter, label: "Preprocessing", sub: "Frames are denoised, normalised, and tagged with geo-temporal metadata." },
  { icon: Brain, label: "Model Training", sub: "YOLOv8 fine-tuned on 1.2M labelled wildlife and human samples." },
  { icon: Crosshair, label: "Detection", sub: "Real-time inference at the edge, multi-class with bounding boxes." },
  { icon: GitBranch, label: "Decision Logic", sub: "Behavioural rules separate threats from passing wildlife." },
  { icon: Siren, label: "Alert System", sub: "Verified threats fan out to rangers via push, SMS, and dispatch." },
];

export function Methodology() {
  return (
    <section id="methodology" className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-forest/30 to-background" />
      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="mt-20 relative">
          {/* Vertical connector line */}
          <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-[3px] md:-translate-x-1/2 hover:scale-105 transition-transform origin-top">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/80 to-transparent" />
          </div>

          <div className="space-y-16 md:space-y-24">
            {steps.map((s, i) => (
              <Step key={s.label} step={s} index={i} />
            ))}
          </div>
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
        Chapter 04 — Methodology
      </div>
      <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
        From signal to <span className="text-shimmer">action</span>, <br />
        in six precise steps.
      </h2>
    </div>
  );
}

function Step({ step, index }: { step: { icon: LucideIcon; label: string; sub: string }; index: number }) {
  const ref = useReveal<HTMLDivElement>();
  const Icon = step.icon;
  const isLeft = index % 2 === 0;
  return (
    <div
      ref={ref}
      className="reveal relative grid md:grid-cols-2 gap-6 items-center"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Node dot */}
      <div className="absolute left-7 md:left-1/2 top-7 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10 group cursor-pointer">
        <div className="w-5 h-5 rounded-full bg-primary shadow-[0_0_15px_rgba(11,102,35,0.8)] group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(11,102,35,1)] transition-all" />
      </div>

      {/* Card */}
      <div className={`md:${isLeft ? "col-start-1" : "col-start-2"} pl-20 md:pl-0 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:col-start-2"}`}>
        <div className={`inline-flex items-center gap-3 ${isLeft ? "md:flex-row-reverse" : ""}`}>
          <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
            <Icon className="w-6 h-6 text-neon" strokeWidth={1.5} />
          </div>
          <div className="font-mono text-lg uppercase tracking-[0.3em] text-neon/60">
            Step 0{index + 1}
          </div>
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-semibold mt-4">{step.label}</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md md:inline-block">
          {step.sub}
        </p>
      </div>
    </div>
  );
}

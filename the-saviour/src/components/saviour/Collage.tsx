"use client";
const natureWatching = "/assets/nature-watching.png";
import { useReveal } from "@/hooks/use-reveal";

export function Collage() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative py-20 md:py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/40 to-background" />
      <div ref={ref} className="reveal mx-auto max-w-7xl">
        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-neon/80 mb-8 justify-center">
          <span className="w-12 h-px bg-neon/40" />
          Nature, Now Visible
          <span className="w-12 h-px bg-neon/40" />
        </div>
        <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
          <img
            src={natureWatching}
            alt="AI-detected wildlife and human intrusions across forest camera traps"
            className="w-full h-auto block"
          />
        </div>
        <p className="mt-8 text-center max-w-2xl mx-auto text-muted-foreground leading-relaxed">
          Every frame, every species, every intruder — labeled, scored, and
          surfaced in real time. With the power of AI,{" "}
          <span className="text-foreground font-medium">nature is watching</span>.
        </p>
      </div>
    </section>
  );
}

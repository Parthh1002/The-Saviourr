import { Eye, UserX, Activity, Bell, Radar } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import type { LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Eye, title: "Wildlife Detection", desc: "Identifies and classifies 40+ species in real-time using YOLOv8 vision models." },
  { icon: UserX, title: "Human Intrusion", desc: "Distinguishes poachers from rangers with multi-frame behavioural analysis." },
  { icon: Activity, title: "Real-Time Monitoring", desc: "Continuous edge inference across 225+ camera traps with sub-second latency." },
  { icon: Bell, title: "Automated Alerts", desc: "Instant SMS, push, and dispatch alerts to the closest ranger units." },
  { icon: Radar, title: "Surveillance Mesh", desc: "Self-healing network of nodes covering thousands of square kilometres." },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-forest/20 to-background" />

      <div className="mx-auto max-w-7xl">
        <Header />
        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={f.title} {...f} delay={i * 100} index={i} />
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
      <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-neon/70 mb-6">
        <span className="w-12 h-px bg-neon/40" />
        Chapter 02 — Capabilities
      </div>
      <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
        Five layers of defense, <br />
        <span className="text-shimmer">working as one.</span>
      </h2>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  delay,
  index,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  delay: number;
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal group relative glass rounded-2xl p-7 hover:-translate-y-2 transition-all duration-500"
      style={{
        transitionDelay: `${delay}ms`,
        transform: `translateY(${(index % 2) * 20}px)`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), oklch(0.85 0.22 145 / 0.15), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center mb-5 group-hover:bg-neon/20 group-hover:shadow-[0_0_30px_oklch(0.85_0.24_145/0.4)] transition-all">
          <Icon className="w-5 h-5 text-neon" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-neon/50">
          0{index + 1} / 05
        </div>
      </div>
    </div>
  );
}

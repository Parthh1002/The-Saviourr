import { useEffect, useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { Particles } from "./Particles";
import heroForest from "@/assets/hero-forest.jpg";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden grain">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 -z-10"
        style={{ transform: `translateY(${scrollY * 0.4}px) scale(1.1)` }}
      >
        <img
          src={heroForest}
          alt="Misty forest at dawn"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
      </div>

      <Particles count={40} />

      {/* Scan line effect */}
      <div className="absolute inset-0 -z-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-neon/10 to-transparent animate-scan" />
      </div>

      {/* Top label */}
      <div
        className="absolute top-32 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.4em] text-neon/80"
        style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
      >
        <span className="w-2 h-2 rounded-full bg-neon animate-pulse-glow" />
        Live Surveillance · Active
        <span className="w-2 h-2 rounded-full bg-neon animate-pulse-glow" />
      </div>

      {/* Main content */}
      <div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: Math.max(0, 1 - scrollY / 600),
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      >
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-bold leading-[0.95] tracking-tight max-w-6xl">
          <span className="block opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_0.2s_forwards]">
            Protecting Wildlife
          </span>
          <span className="block text-shimmer opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_0.6s_forwards]">
            with AI Intelligence
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1s_forwards]">
          Real-Time Anti-Poaching Surveillance System. Watching every leaf,
          every footprint — so the wild stays wild.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1.3s_forwards]">
          <a
            href="#story"
            className="group relative px-8 py-4 rounded-full bg-neon text-primary-foreground font-medium tracking-wide hover:scale-105 transition-transform"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <span className="relative z-10">Explore System</span>
            <span className="absolute inset-0 rounded-full bg-neon blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-0" />
          </a>
          <a
            href="#story"
            className="group flex items-center gap-3 px-7 py-4 rounded-full border border-border glass hover:border-neon/50 transition-all"
          >
            <span className="w-8 h-8 rounded-full bg-neon/15 flex items-center justify-center group-hover:bg-neon/25 transition-colors">
              <Play className="w-3 h-3 fill-neon text-neon ml-0.5" />
            </span>
            <span className="text-sm tracking-wide">Watch Overview</span>
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16 opacity-0 animate-[fade-in_1.2s_var(--ease-out-expo)_1.6s_forwards]">
          {[
            { v: "98.4%", l: "Detection accuracy" },
            { v: "<200ms", l: "Alert latency" },
            { v: "24/7", l: "Forest surveillance" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-2xl md:text-3xl text-neon font-semibold">{s.v}</div>
              <div className="mt-1 text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-6 h-10 rounded-full border border-border flex items-start justify-center pt-2 relative overflow-hidden">
          <span className="w-1 h-2 rounded-full bg-neon animate-scroll-hint" />
        </div>
        <ChevronDown className="w-3 h-3 animate-bounce" />
      </div>
    </section>
  );
}

"use client";
import { useReveal } from "@/hooks/use-reveal";
const detectionFeed = "/assets/detection-feed.jpg";

export function Detection() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="mx-auto max-w-7xl grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 text-xl font-mono uppercase tracking-[0.3em] text-neon/70 mb-6">
            <span className="w-12 h-px bg-neon/40" />
            Chapter 05 — Vision Engine
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            What the AI <br /><span className="text-shimmer">actually sees.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Multi-class detection with confidence scoring runs on every frame.
            Bounding boxes, species labels, and threat classification — drawn
            in under 200 milliseconds at the edge.
          </p>

          <ul className="mt-8 space-y-3 text-sm font-mono">
            {[
              { c: "neon", t: "Animal Identified · Rhino · 98.2%" },
              { c: "alert", t: "Human Detected · Threat Level 3" },
              { c: "neon", t: "Tracking Active · 2 entities" },
            ].map((row) => (
              <li key={row.t} className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-sm animate-blink"
                  style={{ background: row.c === "alert" ? "var(--alert)" : "var(--neon)" }}
                />
                <span className="text-foreground/90">{row.t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div ref={ref} className="reveal lg:col-span-3 relative">
          <div className="relative rounded-2xl overflow-hidden border border-neon/30 neon-border">
            <img
              src={detectionFeed}
              alt="AI detection feed"
              loading="lazy"
              className="w-full aspect-[16/10] object-cover"
            />

            {/* HUD overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Bounding box overlay */}
              <div className="absolute left-[24%] top-[22%] w-[55%] h-[68%] border-2 border-alert rounded-sm">
                <span className="absolute -top-7 left-0 font-mono text-[10px] uppercase tracking-widest bg-alert text-background px-2 py-0.5 rounded-sm">
                  Rhino · 98.2%
                </span>
                {/* Corner brackets */}
                {["top-left", "top-right", "bottom-left", "bottom-right"].map((p) => (
                  <span
                    key={p}
                    className={`absolute w-3 h-3 border-neon ${
                      p === "top-left" ? "-top-1 -left-1 border-l-2 border-t-2" :
                      p === "top-right" ? "-top-1 -right-1 border-r-2 border-t-2" :
                      p === "bottom-left" ? "-bottom-1 -left-1 border-l-2 border-b-2" :
                      "-bottom-1 -right-1 border-r-2 border-b-2"
                    }`}
                  />
                ))}
              </div>

              {/* HUD top bar */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-neon">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-alert animate-blink" />
                  <span>REC · NODE-A14</span>
                </div>
                <span>03:42:17 UTC</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-neon/80">
                <span>LAT 12.93° N · LON 77.61° E</span>
                <span>YOLOv8 · v3.2.1</span>
              </div>

              {/* Scan line */}
              <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-neon/15 to-transparent animate-scan" />
            </div>
          </div>

          {/* Below feed metadata */}
          <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="glass rounded-lg p-3"><div className="text-neon">FPS 30</div>1080p · IR</div>
            <div className="glass rounded-lg p-3"><div className="text-neon">Latency 142ms</div>Edge inference</div>
            <div className="glass rounded-lg p-3"><div className="text-alert">Alert Sent</div>2 rangers · 1.4 km</div>
          </div>
        </div>
      </div>
    </section>
  );
}

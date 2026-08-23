import { useReveal } from "@/hooks/use-reveal";
import { Database, TrendingUp, Map, AlertOctagon } from "lucide-react";

const kpis = [
  { icon: Database, label: "Records logged", value: "4.7M", sub: "All-time detections" },
  { icon: TrendingUp, label: "Accuracy (30d)", value: "98.4%", sub: "Avg. model confidence" },
  { icon: AlertOctagon, label: "Threats stopped", value: "1,284", sub: "Verified interventions" },
  { icon: Map, label: "Reserves online", value: "37", sub: "Across 4 countries" },
];

const bars = [
  { l: "Mon", v: 62 }, { l: "Tue", v: 78 }, { l: "Wed", v: 54 }, { l: "Thu", v: 88 },
  { l: "Fri", v: 71 }, { l: "Sat", v: 95 }, { l: "Sun", v: 66 },
];

const species = [
  { n: "Elephant", p: 28 },
  { n: "Rhino", p: 22 },
  { n: "Tiger", p: 18 },
  { n: "Leopard", p: 14 },
  { n: "Deer", p: 12 },
  { n: "Other", p: 6 },
];

export function Analytics() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="analytics" className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/40 to-background" />
      <div className="mx-auto max-w-7xl">
        <div ref={ref} className="reveal max-w-3xl">
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-neon/80 mb-6">
            <span className="w-12 h-px bg-neon/40" />
            Chapter 09 — Database Analytics
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            Every detection, <br />
            <span className="text-shimmer">measured and remembered.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            A live analytics layer aggregates every frame, alert, and dispatch
            into a queryable database — giving conservation leaders the data to
            see patterns, prove impact, and plan ahead.
          </p>
        </div>

        {/* KPIs */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="glass rounded-2xl p-6">
              <Icon className="w-5 h-5 text-neon mb-4" strokeWidth={1.5} />
              <div className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{value}</div>
              <div className="mt-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
              <div className="mt-3 text-xs text-muted-foreground">{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-8 grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 glass rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-display text-lg font-semibold">Detections this week</div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                  Cross-reserve · Live
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neon">+18% WoW</span>
            </div>
            <div className="flex items-end gap-3 md:gap-4 h-48">
              {bars.map((b, i) => (
                <div key={b.l} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-neon to-accent opacity-90 hover:opacity-100 transition-opacity"
                    style={{
                      height: `${b.v}%`,
                      animation: `fade-in 0.8s var(--ease-out-expo) ${i * 80}ms backwards`,
                    }}
                  />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {b.l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 glass rounded-2xl p-6 md:p-8">
            <div className="font-display text-lg font-semibold">Species distribution</div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1 mb-6">
              Last 30 days
            </div>
            <div className="space-y-4">
              {species.map((s) => (
                <div key={s.n}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium">{s.n}</span>
                    <span className="font-mono text-muted-foreground">{s.p}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon to-accent rounded-full"
                      style={{ width: `${s.p * 3}%`, maxWidth: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live table */}
        <div className="mt-4 glass rounded-2xl p-6 md:p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="font-display text-lg font-semibold">Recent detection log</div>
            <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neon">
              <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-glow" />
              Streaming
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="py-3 pr-4">Time</th>
                  <th className="py-3 pr-4">Node</th>
                  <th className="py-3 pr-4">Species / Class</th>
                  <th className="py-3 pr-4">Confidence</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {[
                  { t: "03:42:17", n: "A-14", c: "Rhino", p: "98.2%", s: "Verified", crit: false },
                  { t: "03:39:51", n: "B-07", c: "Human · armed", p: "94.6%", s: "Dispatched", crit: true },
                  { t: "03:36:08", n: "A-22", c: "Elephant", p: "97.1%", s: "Logged", crit: false },
                  { t: "03:31:24", n: "C-03", c: "Logging truck", p: "91.4%", s: "Escalated", crit: true },
                  { t: "03:28:02", n: "A-09", c: "Tiger", p: "99.0%", s: "Logged", crit: false },
                ].map((r) => (
                  <tr key={r.t} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4 text-muted-foreground">{r.t}</td>
                    <td className="py-3 pr-4">{r.n}</td>
                    <td className="py-3 pr-4">{r.c}</td>
                    <td className="py-3 pr-4 text-neon">{r.p}</td>
                    <td className="py-3">
                      <span
                        className="px-2 py-1 rounded text-[10px] uppercase tracking-widest"
                        style={{
                          background: r.crit ? "oklch(0.58 0.24 28 / 0.12)" : "oklch(0.5 0.2 150 / 0.12)",
                          color: r.crit ? "var(--alert)" : "var(--neon)",
                        }}
                      >
                        {r.s}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

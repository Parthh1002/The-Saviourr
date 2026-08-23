import { useReveal } from "@/hooks/use-reveal";
import { AlertTriangle, MessageSquare, Mail, MapPin } from "lucide-react";

export function Alerts() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-forest/20 to-background" />
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[140px] -z-10"
        style={{ background: "oklch(0.65 0.24 25 / 0.15)" }}
      />

      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-alert/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-alert animate-blink" />
            Chapter 06 — Alert System
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            When seconds matter, <br />
            <span style={{ color: "var(--alert)" }}>everyone gets notified.</span>
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
                <Icon className="w-4 h-4 text-neon" strokeWidth={1.5} />
                <span className="text-xs font-mono uppercase tracking-wider">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={ref} className="reveal relative h-[560px]">
          {/* Phone mockup */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[280px] h-[560px] rounded-[3rem] glass border border-border p-3 shadow-2xl"
            style={{ background: "linear-gradient(160deg, oklch(0.98 0.01 150), oklch(0.94 0.02 150))" }}>
            <div className="w-full h-full rounded-[2.5rem] bg-background/80 overflow-hidden relative p-5">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-background" />

              <div className="mt-8 text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">03:42 UTC</div>
                <div className="mt-1 text-xs text-muted-foreground">Saviour · Field Ops</div>
              </div>

              <div className="mt-8 space-y-3">
                <NotifCard
                  delay="0s"
                  level="critical"
                  title="Poacher detected"
                  body="Node A-14 · 2 humans · weapon flagged · 1.4km NE"
                />
                <NotifCard
                  delay="0.4s"
                  level="warning"
                  title="Rhino in zone"
                  body="Same vector · ETA 6 min · dispatching team Bravo"
                />
                <NotifCard
                  delay="0.8s"
                  level="info"
                  title="Live feed available"
                  body="Tap to view 1080p IR stream from Node A-14"
                />
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-foreground/20" />
            </div>
          </div>

          {/* Floating ring + ping */}
          <div className="absolute left-1/2 top-32 -translate-x-1/2 w-[420px] h-[420px] rounded-full border border-alert/20" />
          <div className="absolute left-1/2 top-32 -translate-x-1/2 w-[420px] h-[420px] rounded-full border-2 border-alert/40 animate-ping" style={{ animationDuration: "3s" }} />
        </div>
      </div>
    </section>
  );
}

function NotifCard({
  delay,
  level,
  title,
  body,
}: {
  delay: string;
  level: "critical" | "warning" | "info";
  title: string;
  body: string;
}) {
  const dot = level === "critical" ? "var(--alert)" : level === "warning" ? "oklch(0.78 0.2 80)" : "var(--neon)";
  return (
    <div
      className="glass rounded-xl p-3 opacity-0 animate-[fade-in_0.6s_var(--ease-out-expo)_forwards]"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-1 w-2 h-2 rounded-full animate-blink shrink-0" style={{ background: dot }} />
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold truncate">{title}</span>
            <span className="text-[9px] font-mono text-muted-foreground shrink-0">now</span>
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">{body}</p>
        </div>
      </div>
    </div>
  );
}

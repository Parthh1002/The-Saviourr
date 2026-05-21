"use client";
import { useReveal } from "@/hooks/use-reveal";
import { ShieldCheck, Fingerprint, KeyRound, Lock, ArrowRight } from "lucide-react";

export function OfficerLogin() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="officer" className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-4 text-xl font-mono uppercase tracking-[0.3em] text-neon/80 mb-6">
            <span className="w-12 h-px bg-neon/40" />
            Chapter 08 — Officer Access
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            A secure portal for <br />
            <span className="text-shimmer">forest officers.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
            Authorized rangers and forest officers sign in to a protected
            command console — view live detections, dispatch teams, and act
            on alerts from any device, anywhere in the field.
          </p>

          <ul className="mt-8 space-y-4 max-w-md">
            {[
              { icon: Fingerprint, t: "Biometric / 2FA verification" },
              { icon: ShieldCheck, t: "Role-based access — Ranger · Officer · Admin" },
              { icon: KeyRound, t: "Encrypted session tokens · auto-expire" },
              { icon: Lock, t: "Audit log for every dispatch & override" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-neon" strokeWidth={1.5} />
                </span>
                <span className="text-sm text-foreground/90 pt-1.5">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div ref={ref} className="reveal">
          <div className="relative glass rounded-3xl p-8 md:p-10 max-w-md mx-auto">
            <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-neon text-primary-foreground text-[10px] font-mono uppercase tracking-widest">
              Restricted
            </div>
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-6 h-6 text-neon" />
              <div>
                <div className="font-display text-lg font-semibold">Officer Login</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Secure Portal · v3.2
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Field label="Officer ID" placeholder="OFC-00000" />
              <Field label="Passphrase" placeholder="••••••••••" type="password" />
              <Field label="Reserve Code" placeholder="e.g. KAZ-04" />

              <a
                href="/login"
                className="w-full mt-2 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-neon text-primary-foreground font-medium tracking-wide hover:scale-[1.02] transition-transform group"
                style={{ boxShadow: "var(--shadow-glow)" }}
              >
                Authenticate
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="text-center mt-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  New to the team?{" "}
                  <a href="/signup" className="text-neon hover:underline">Register Now</a>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-muted-foreground pt-2 border-t border-border/40">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-glow" />
                  Secure channel
                </span>
                <a href="#" className="hover:text-neon transition-colors">Help</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-secondary/60 border border-border focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm font-mono"
      />
    </label>
  );
}

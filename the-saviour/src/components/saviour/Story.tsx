"use client";
import { useReveal } from "@/hooks/use-reveal";

export function Story() {
  const ref = useReveal<HTMLDivElement>();
  const lines = [
    { txt: "Every 26 minutes,", em: false },
    { txt: "an animal is lost to poachers.", em: true },
    { txt: "Forests stretch for thousands of miles —", em: false },
    { txt: "rangers cannot.", em: false },
    { txt: "But intelligence can.", em: true },
  ];

  return (
    <section id="story" className="relative py-40 md:py-56 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-forest/40 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-neon/5 blur-[120px] -z-10" />

      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex items-center gap-4 text-xl font-mono uppercase tracking-[0.3em] text-neon/70 reveal" ref={ref}>
          <span className="w-12 h-px bg-neon/40" />
          Chapter 01 — The Problem
        </div>

        <div className="space-y-2 md:space-y-4 font-display text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight">
          {lines.map((l, i) => (
            <RevealLine key={i} delay={i * 120} emphasis={l.em}>
              {l.txt}
            </RevealLine>
          ))}
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 text-sm text-muted-foreground">
          <RevealBlock delay={0}>
            <div className="text-3xl font-display text-foreground mb-2">35,000+</div>
            <div>Elephants poached each year for ivory across Africa.</div>
          </RevealBlock>
          <RevealBlock delay={150}>
            <div className="text-3xl font-display text-foreground mb-2">73%</div>
            <div>Of protected reserves lack continuous human surveillance.</div>
          </RevealBlock>
          <RevealBlock delay={300}>
            <div className="text-3xl font-display text-foreground mb-2">96%</div>
            <div>Reduction in incidents when AI detection is deployed early.</div>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}

function RevealLine({ children, delay, emphasis }: { children: React.ReactNode; delay: number; emphasis?: boolean }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${emphasis ? "text-shimmer" : "text-foreground/80"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function RevealBlock({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal glass rounded-2xl p-6"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
const tiger = "/assets/wildlife-tiger.jpg";
const elephant = "/assets/wildlife-elephant.jpg";
const leopard = "/assets/wildlife-leopard.jpg";
const deer = "/assets/wildlife-deer.jpg";

const stats = [
  { value: 1200000, suffix: "+", label: "Training Images", format: (v: number) => (v / 1000000).toFixed(1) + "M" },
  { value: 225, suffix: "", label: "Camera Traps", format: (v: number) => v.toLocaleString() },
  { value: 40, suffix: "+", label: "Species Tracked", format: (v: number) => v.toString() },
];

export function Dataset() {
  return (
    <section className="relative py-32 md:py-44 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="mt-16 grid grid-cols-12 gap-3 md:gap-4">
          <Tile src={tiger} alt="Tiger" className="col-span-7 row-span-2 aspect-[4/5]" tag="Panthera tigris · Confidence 99.2%" delay={0} />
          <Tile src={elephant} alt="Elephant herd" className="col-span-5 aspect-[4/3]" tag="Loxodonta · Confidence 97.8%" delay={120} />
          <Tile src={leopard} alt="Leopard" className="col-span-5 aspect-[4/3]" tag="Panthera pardus · Confidence 98.6%" delay={240} />
          <Tile src={deer} alt="Deer" className="col-span-12 aspect-[16/6]" tag="Cervus elaphus · Confidence 96.4%" delay={360} />
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <Counter key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Header() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-7xl">
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 text-xl font-mono uppercase tracking-[0.3em] text-neon/70 mb-6">
          <span className="w-12 h-px bg-neon/40" />
          Chapter 03 — The Dataset
        </div>
        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          Trained on millions <br /> of <span className="text-shimmer">forest moments.</span>
        </h2>
      </div>
      <p className="md:max-w-sm text-sm text-muted-foreground leading-relaxed">
        Our vision pipeline is fed by a custom corpus of camera-trap footage from
        partner reserves across India, Kenya, and Borneo — annotated frame by frame.
      </p>
    </div>
  );
}

function Tile({ src, alt, className, tag, delay }: { src: string; alt: string; className: string; tag: string; delay: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal relative ${className} overflow-hidden rounded-2xl group bg-forest`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      {/* Mist overlay removed as requested */}
      <div className="absolute inset-0 ring-1 ring-inset ring-border rounded-2xl" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="px-2 py-1 rounded bg-background/60 backdrop-blur-md text-neon border border-neon/30">
          {tag}
        </span>
        <span className="w-2 h-2 rounded-full bg-neon animate-pulse-glow" />
      </div>
    </div>
  );
}

function Counter({ value, label, format, index }: { value: number; label: string; format: (v: number) => string; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStarted(true)),
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !numRef.current) return;
    const el = numRef.current;
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(eased * value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, format]);

  return (
    <div ref={ref} className="bg-background p-10 md:p-14 text-center md:text-left">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon/60 mb-4">
        Metric 0{index + 1}
      </div>
      <div className="font-display text-5xl md:text-7xl font-semibold tracking-tight">
        <span ref={numRef}>0</span>
        <span className="text-neon">+</span>
      </div>
      <div className="mt-3 text-sm text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}

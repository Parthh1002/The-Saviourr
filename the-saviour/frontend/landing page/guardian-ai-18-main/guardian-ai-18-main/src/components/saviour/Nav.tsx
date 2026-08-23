import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3 backdrop-blur-xl bg-background/70 border-b border-border" : "py-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Shield className="w-6 h-6 text-neon" strokeWidth={1.5} />
            <div className="absolute inset-0 blur-md bg-neon/40 -z-10" />
          </div>
          <span className="font-display text-sm font-semibold tracking-[0.2em] uppercase">
            The Saviour
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          <a href="#story" className="hover:text-neon transition-colors">Story</a>
          <a href="#features" className="hover:text-neon transition-colors">Features</a>
          <a href="#methodology" className="hover:text-neon transition-colors">Method</a>
          <a href="#analytics" className="hover:text-neon transition-colors">Analytics</a>
          <a href="#officer" className="hover:text-neon transition-colors">Officer</a>
        </div>
        <a
          href="#officer"
          className="text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-full border border-neon/40 text-neon hover:bg-neon hover:text-primary-foreground transition-all"
        >
          Officer Login
        </a>
      </div>
    </nav>
  );
}

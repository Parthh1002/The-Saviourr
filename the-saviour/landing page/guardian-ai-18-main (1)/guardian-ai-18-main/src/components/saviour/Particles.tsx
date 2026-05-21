export function Particles({ count = 30 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i * 0.7) % 20;
        const duration = 14 + ((i * 3) % 12);
        const size = 1 + ((i * 7) % 3);
        return (
          <span
            key={i}
            className="absolute rounded-full bg-neon animate-drift"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              boxShadow: "0 0 8px oklch(0.85 0.24 145 / 0.8)",
              opacity: 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

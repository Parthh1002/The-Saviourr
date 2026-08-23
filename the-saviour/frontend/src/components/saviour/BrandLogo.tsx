"use client";

import React from "react";
import { Shield } from "lucide-react";

export function BrandLogo({ size = "normal" }: { size?: "normal" | "large" }) {
  const isLarge = size === "large";

  return (
    <div className={`flex items-center gap-4 group transition-transform hover:scale-105 ${isLarge ? "scale-125 md:scale-150" : ""}`}>
      {/* Simple Outlined Shield from the image */}
      <div className="relative">
        <Shield
          className="w-8 h-8 text-emerald-700 transition-all group-hover:text-emerald-500"
          strokeWidth={1.2}
        />
        <div className="absolute inset-0 blur-xl bg-emerald-500/10 -z-10 group-hover:bg-emerald-500/20" />
      </div>

      {/* Bold Minimalist Typography */}
      <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-emerald-800 leading-none">
        The Saviour
      </span>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldAlert, Activity, Eye, LayoutDashboard, Database, Menu, Volume2, Siren } from "lucide-react";
import { useState } from "react";
import { useSystem } from "@/components/saviour/SystemProvider";

const NAV_LINKS = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Scanning", href: "/detection", icon: Eye },
  { name: "Threat Alerts", href: "/alerts", icon: ShieldAlert },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "Database", href: "/database", icon: Database },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutToast, setLogoutToast] = useState("");
  const [emailToast, setEmailToast] = useState("");
  const { role, officerId, playClick, playSiren, stopSiren, isSirenActive } = useSystem();

  const handleLogout = () => {
    setLogoutToast("You have successfully logged out");
    setEmailToast("Email sent: Logout detected from The Saviour");
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  // Normalize pathname to handle trailing slashes and ensure exact matching
  const normalizedPathname = pathname?.replace(/\/$/, "") || "/";
  const hideNavbarPaths = ["", "/", "/login", "/signup"];
  
  if (hideNavbarPaths.includes(normalizedPathname)) return null;

  return (
    <nav className="dark-dashboard sticky top-0 z-50 w-full glass border-b border-border/50 transition-all pt-[env(safe-area-inset-top)] text-slate-100">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2 mr-8">
          <div className="relative flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 border border-primary/30">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <div className="absolute inset-0 rounded-lg shadow-[var(--shadow-glow)] animate-pulse opacity-50" />
          </div>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              THE SAVIOUR
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={playClick}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]"
                    : "text-secondary hover:text-foreground hover:bg-secondary/10"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4 ml-auto relative">
          {logoutToast && (
            <div className="fixed top-20 right-8 bg-panel border border-border shadow-lg px-4 py-3 rounded-md flex items-center gap-3 z-50 animate-fade-in text-sm font-medium transition-all">
              <div className="h-2 w-2 rounded-full animate-pulse bg-success"></div>
              {logoutToast}
            </div>
          )}
          {emailToast && (
            <div className="fixed top-36 right-8 bg-panel border border-border shadow-lg px-4 py-3 rounded-md flex items-center gap-3 z-50 animate-fade-in text-sm font-medium transition-all">
              <ShieldAlert className="h-4 w-4 text-primary" />
              {emailToast}
            </div>
          )}
          {role === 'main_officer' && (
            <button
              onClick={() => isSirenActive ? stopSiren() : playSiren()}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all border shadow-sm mr-2 ${isSirenActive ? 'bg-danger text-white border-danger animate-pulse' : 'bg-background border-danger/50 text-danger hover:bg-danger/10'}`}
            >
              <Siren className={`h-4 w-4 ${isSirenActive ? 'animate-spin' : ''}`} />
              {isSirenActive ? 'STOP SIREN' : 'EMERGENCY SIREN'}
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 mr-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {officerId ? `${officerId} [${role === 'main_officer' ? 'CMD' : 'FIELD'}]` : 'SYSTEM ONLINE'}
          </div>
          <button
            onClick={handleLogout}
            className="hidden md:inline-flex bg-danger/10 text-danger border border-danger/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger hover:text-white transition-all shadow-sm"
          >
            Logout
          </button>
          <button
            className="md:hidden p-2 text-secondary hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 glass">
          <div className="flex flex-col p-4 space-y-3">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-secondary hover:text-foreground hover:bg-secondary/10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

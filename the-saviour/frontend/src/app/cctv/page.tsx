"use client";

import { Camera, Eye, MapPin, Activity, ShieldAlert, Crosshair, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const CCTV_FEEDS = [
  {
    id: "CAM-01",
    zone: "Sector Alpha - Main Watering Hole",
    status: "active",
    video: "/videos/elephant.mp4",
    detections: [{ label: "ELEPHANT", confidence: "99.8%", type: "safe", box: "top-[20%] left-[30%] w-[180px] h-[220px]" }]
  },
  {
    id: "CAM-02",
    zone: "Sector Alpha - Perimeter",
    status: "alert",
    video: "/videos/human.mp4",
    detections: [{ label: "HUMAN", confidence: "94.5%", type: "danger", box: "top-[40%] left-[45%] w-[90px] h-[150px]" }]
  },
  {
    id: "CAM-03",
    zone: "Sector Bravo - Deep Forest",
    status: "active",
    video: "/videos/tiger.mp4",
    detections: [{ label: "TIGER", confidence: "96.1%", type: "safe", box: "top-[30%] left-[20%] w-[250px] h-[170px]" }]
  },
  {
    id: "CAM-04",
    zone: "Sector Bravo - East Ridge",
    status: "active",
    video: "/videos/wildlife nature.mp4",
    detections: []
  },
  {
    id: "CAM-05",
    zone: "Sector Charlie - Ranger Post",
    status: "warning",
    video: "/videos/vehicle.mp4",
    detections: [{ label: "VEHICLE", confidence: "88.2%", type: "warning", box: "top-[40%] left-[40%] w-[170px] h-[90px]" }]
  },
  {
    id: "CAM-06",
    zone: "Sector Charlie - North Boundary",
    status: "active",
    video: "/videos/deer.mp4",
    detections: [{ label: "DEER", confidence: "99.1%", type: "safe", box: "top-[30%] left-[40%] w-[100px] h-[150px]" }]
  },
  {
    id: "CAM-07",
    zone: "Sector Delta - River Crossing",
    status: "active",
    video: "/videos/rhino.mp4",
    detections: [{ label: "RHINO", confidence: "97.4%", type: "safe", box: "top-[40%] left-[25%] w-[220px] h-[140px]" }]
  },
  {
    id: "CAM-08",
    zone: "Sector Delta - Highway Access",
    status: "alert",
    video: "/videos/Human with gun.mp4",
    detections: [{ label: "WEAPON", confidence: "92.3%", type: "danger", box: "top-[50%] left-[30%] w-[70px] h-[40px]" }, { label: "HUMAN", confidence: "95.5%", type: "danger", box: "top-[30%] left-[25%] w-[110px] h-[180px]" }]
  },
  {
    id: "CAM-09",
    zone: "Sector Echo - Reserve Core",
    status: "active",
    video: "/videos/normal nature.mp4",
    detections: []
  }
];

export default function CCTVPage() {
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState<"2x2" | "3x3">("3x3");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 border border-border rounded-md hover:bg-secondary/10 transition-colors bg-panel text-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
              <Camera className="h-8 w-8 text-primary" />
              CCTV Surveillance Matrix
            </h1>
            <p className="text-secondary text-sm mt-1">Live monitoring 45 active camera streams across the reserve.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-panel border border-border rounded-lg p-1 mr-2">
            <button
              onClick={() => setLayout("2x2")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${layout === '2x2' ? 'bg-primary/20 text-primary shadow-sm' : 'text-secondary hover:text-foreground'}`}
            >
              2x2 Grid
            </button>
            <button
              onClick={() => setLayout("3x3")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${layout === '3x3' ? 'bg-primary/20 text-primary shadow-sm' : 'text-secondary hover:text-foreground'}`}
            >
              3x3 Grid
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-danger bg-danger/10 px-3 py-1.5 rounded-full border border-danger/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
            </span>
            2 CRITICAL THREATS
          </div>
          <button className="bg-panel border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/10 transition-colors shadow-sm flex items-center gap-2">
            <Activity className="h-4 w-4" /> AI Diagnostics
          </button>
        </div>
      </div>

      {/* Grid of Cameras */}
      <div className={`grid gap-6 mt-4 ${layout === '3x3' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} `}>
        {CCTV_FEEDS.slice(0, layout === '2x2' ? 4 : 9).map((feed, index) => (
          <div
            key={feed.id}
            className={`glass rounded-xl border border-border overflow-hidden flex flex-col group transition-all duration-500 animate-fade-in ${feed.status === 'alert' ? 'shadow-[0_0_20px_rgba(239,68,68,0.15)] border-danger/40' : 'hover:shadow-[var(--shadow-glow)] hover:border-primary/30'
              }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Header info */}
            <div className="px-4 py-3 bg-panel border-b border-border flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${feed.status === 'alert' ? 'bg-danger animate-pulse' : feed.status === 'warning' ? 'bg-warning' : 'bg-success'}`} />
                <span className="font-bold text-sm text-foreground">{feed.id}</span>
              </div>
              <span className="text-xs text-secondary flex items-center gap-1 font-medium"><MapPin className="h-3 w-3" /> {feed.zone}</span>
            </div>

            {/* Camera Viewport */}
            <div className="relative aspect-video bg-black overflow-hidden group cursor-crosshair">
              {/* Actual Video Element */}
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-[10000ms] group-hover:scale-110 ease-linear"
                src={feed.video}
                autoPlay
                muted
                loop
                playsInline
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              {/* Overlay Grid lines (Cyber/Tech look) */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVoNDBNMzkuNSAwVjQwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none" />

              {/* Detections */}
              {feed.detections.map((det, i) => (
                <div
                  key={i}
                  className={`absolute ${det.box} border-2 rounded-sm pointer-events-none transition-all duration-300 ${det.type === 'danger' ? 'border-danger shadow-[0_0_15px_rgba(239,68,68,0.8)]' :
                    det.type === 'warning' ? 'border-warning shadow-[0_0_15px_rgba(245,158,11,0.8)]' :
                      'border-primary shadow-[0_0_15px_rgba(37,99,235,0.8)]'
                    }`}
                >
                  <span className={`absolute -top-6 left-0 text-white text-[10px] font-mono px-1.5 py-0.5 whitespace-nowrap font-bold tracking-wider ${det.type === 'danger' ? 'bg-danger' :
                    det.type === 'warning' ? 'bg-warning' :
                      'bg-primary'
                    }`}>
                    {det.label}: {det.confidence}
                  </span>

                  {/* Crosshairs on corners */}
                  <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 ${det.type === 'danger' ? 'border-danger' : det.type === 'warning' ? 'border-warning' : 'border-primary'}`} />
                  <div className={`absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 ${det.type === 'danger' ? 'border-danger' : det.type === 'warning' ? 'border-warning' : 'border-primary'}`} />
                  <div className={`absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 ${det.type === 'danger' ? 'border-danger' : det.type === 'warning' ? 'border-warning' : 'border-primary'}`} />
                  <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 ${det.type === 'danger' ? 'border-danger' : det.type === 'warning' ? 'border-warning' : 'border-primary'}`} />
                </div>
              ))}

              {/* Bottom Telemetry */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-[10px] text-white/90 font-mono pointer-events-none z-10">
                <div className="space-y-1">
                  <p className="flex items-center gap-1"><Crosshair className="h-3 w-3 opacity-70" /> FPS: 30</p>
                  <p>RES: 4K UHD</p>
                </div>
                <div className="text-right space-y-1">
                  {feed.status === 'alert' && <p className="text-danger font-bold animate-pulse flex items-center justify-end gap-1"><ShieldAlert className="h-3 w-3" /> THREAT ACTIVE</p>}
                  <p>{new Date().toLocaleTimeString()} UTC</p>
                </div>
              </div>

              {/* Hover Overlay: Fullscreen and PTZ Controls */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-medium flex flex-col items-center gap-3 border border-white/20 shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <button className="flex items-center gap-2 hover:text-primary transition-colors w-full justify-center">
                    <Eye className="h-4 w-4" /> Fullscreen 360° View
                  </button>
                  <div className="w-full h-px bg-white/20"></div>
                  <div className="flex gap-4">
                    <button className="hover:text-primary transition-colors text-[10px] uppercase font-mono">Zoom In</button>
                    <button className="hover:text-primary transition-colors text-[10px] uppercase font-mono">Pan R</button>
                    <button className="hover:text-primary transition-colors text-[10px] uppercase font-mono">Pan L</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}


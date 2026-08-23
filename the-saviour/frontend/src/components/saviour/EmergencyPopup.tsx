"use client";
import React from 'react';
import { AlertOctagon, X, MapPin, Clock, ShieldAlert } from 'lucide-react';

interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  location: string;
  description: string;
  timestamp: string | number;
}

interface EmergencyPopupProps {
  alert: Alert;
  onDismiss: (id: string) => void;
}

export function EmergencyPopup({ alert, onDismiss }: EmergencyPopupProps) {
  const isCritical = alert.severity === 'critical';
  
  return (
    <div className={`fixed top-24 right-6 z-[1000] w-full max-w-md animate-[slide-in_0.5s_ease-out_forwards]`}>
      <div className={`relative overflow-hidden glass rounded-xl border-2 shadow-2xl transition-all duration-500 ${
        isCritical ? 'border-danger/50 shadow-danger/30' : 'border-warning/50 shadow-warning/30'
      }`}>
        
        {/* Animated Scanning Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 z-10 ${
          isCritical ? 'bg-danger/80 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-warning/80 shadow-[0_0_15px_rgba(245,158,11,0.8)]'
        } animate-[scan_3s_linear_infinite]`} />

        {/* Background Glow */}
        <div className={`absolute -inset-20 opacity-20 pointer-events-none blur-3xl ${
          isCritical ? 'bg-danger' : 'bg-warning'
        } animate-pulse`} />

        <div className="p-5 relative z-20">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isCritical ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'} animate-pulse`}>
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`text-lg font-bold tracking-tight ${isCritical ? 'text-danger' : 'text-warning'}`}>
                  {alert.alert_type.toUpperCase()}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-mono text-secondary uppercase tracking-widest">
                  <ShieldAlert className="h-3 w-3" /> System Broadcast: {alert.id}
                </div>
              </div>
            </div>
            <button 
              onClick={() => onDismiss(alert.id)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-foreground leading-relaxed font-medium bg-background/40 p-3 rounded-lg border border-border/50">
              {alert.description}
            </p>

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-secondary">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {alert.location}
                </span>
                <span className="flex items-center gap-1.5 text-secondary">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {typeof alert.timestamp === 'number' ? new Date(alert.timestamp * 1000).toLocaleTimeString() : 'Just Now'}
                </span>
              </div>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                isCritical ? 'bg-danger/10 text-danger border-danger/30' : 'bg-warning/10 text-warning border-warning/30'
              }`}>
                {alert.severity}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => window.location.href = '/alerts'}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  isCritical 
                    ? 'bg-danger text-white hover:bg-danger/90 shadow-[0_4px_12px_rgba(239,68,68,0.4)]' 
                    : 'bg-warning text-white hover:bg-warning/90 shadow-[0_4px_12px_rgba(245,158,11,0.4)]'
                }`}
              >
                OPEN COMMAND CENTER
              </button>
              <button 
                onClick={() => onDismiss(alert.id)}
                className="px-4 py-2 bg-panel border border-border text-foreground hover:bg-secondary/10 rounded-lg text-xs font-bold transition-all"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

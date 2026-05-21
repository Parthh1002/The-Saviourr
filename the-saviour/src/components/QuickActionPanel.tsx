"use client";

import { AlertTriangle, Power, Radio, ShieldAlert, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AI_CORE_URL } from "@/config/api";

export function QuickActionPanel() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [camerasActive, setCamerasActive] = useState(true);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Only show on dashboard/app routes, hide on landing and auth pages
  const normalizedPathname = pathname?.replace(/\/$/, "") || "/";
  const hidePanelPaths = ["", "/", "/login", "/signup"];
  
  if (hidePanelPaths.includes(normalizedPathname)) return null;

  const handleTriggerEmergency = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${AI_CORE_URL}/api/v1/alerts/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alert_type: "Manual Emergency Trigger",
          severity: "critical",
          location: "Command Center - Manual Input",
          description: emergencyReason || "No specific reason provided by officer."
        })
      });

      if (response.ok) {
        setAlertSent(true);
        setShowEmergencyModal(false);
        setEmergencyReason("");
        setTimeout(() => setAlertSent(false), 5000);
      }
    } catch (err) {
      console.error("Failed to trigger emergency:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      
      {/* Confirmation Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4">
          <div className="bg-panel border-2 border-danger/50 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[scale-in_0.3s_ease-out]">
            <div className="flex items-center gap-3 mb-4 text-danger">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Confirm Emergency Broadcast</h2>
            </div>
            
            <p className="text-secondary text-sm mb-6">
              This will trigger a system-wide siren and notify all connected units. Please provide a reason for this manual override.
            </p>
            
            <div className="mb-6">
              <label className="block text-xs font-mono text-secondary mb-2 uppercase tracking-widest">Reason / Description</label>
              <textarea 
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                placeholder="e.g., Suspicious activity near Sector 4, Visual confirmation of poachers..."
                className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-danger focus:border-transparent outline-none min-h-[100px] resize-none transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 px-4 py-3 bg-secondary/10 hover:bg-secondary/20 text-foreground rounded-xl font-bold text-sm transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={handleTriggerEmergency}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-danger text-white hover:bg-danger/90 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
              >
                {isSubmitting ? "TRANSMITTING..." : "CONFIRM & TRIGGER"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel */}
      <div 
        className={`bg-panel border border-border p-4 rounded-2xl shadow-[var(--shadow-glow)] mb-4 w-72 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-danger" /> 
            Command Actions
          </h4>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => setShowEmergencyModal(true)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all ${alertSent ? 'bg-success/20 border-success/50 text-success' : 'bg-danger text-white hover:bg-danger/90 border-transparent shadow-[var(--shadow-glow)]'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            {alertSent ? 'Emergency Alert Sent!' : 'Trigger Emergency'}
          </button>

          <button 
            onClick={() => setCamerasActive(!camerasActive)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-secondary/20 text-sm font-medium transition-all text-foreground"
          >
            <Power className={`w-4 h-4 ${camerasActive ? 'text-primary' : 'text-muted-foreground'}`} />
            {camerasActive ? 'Turn ALL Cameras OFF' : 'Turn ALL Cameras ON'}
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-secondary/20 text-sm font-medium transition-all text-foreground">
            <Radio className="w-4 h-4 text-accent" />
            Broadcast Perimeter Alert
          </button>
        </div>
      </div>

      {/* FAB Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-danger text-white shadow-[var(--shadow-glow)] hover:scale-105 transition-transform flex items-center justify-center relative"
      >
        <span className="absolute inset-0 rounded-full bg-danger animate-ping opacity-20"></span>
        <AlertTriangle className="w-6 h-6" />
      </button>
    </div>
  );
}

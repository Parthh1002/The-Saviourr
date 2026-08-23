"use client";

import { ShieldAlert, BellRing, Search, Filter, AlertTriangle, AlertOctagon, MapPin, Clock, X, Check, Eye, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useSystem } from "@/components/saviour/SystemProvider";

const INITIAL_ALERTS = [
  {
    id: "ALT-8924",
    type: "critical",
    title: "Unauthorized Human Detected",
    desc: "Multiple armed individuals detected moving towards Sector 4 watering hole.",
    time: "2 mins ago",
    location: "Zone 3, Sector 4",
    status: "unresolved"
  },
  {
    id: "ALT-8923",
    type: "high",
    title: "Weapon Detected",
    desc: "Object classified as hunting rifle identified in camera trap feed.",
    time: "15 mins ago",
    location: "Zone 2, Boundary",
    status: "investigating"
  },
  {
    id: "ALT-8922",
    type: "medium",
    title: "Vehicle Intrusion",
    desc: "Unregistered 4x4 vehicle detected on restricted access road.",
    time: "1 hour ago",
    location: "North Gate Access",
    status: "resolved"
  }
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const { isSirenActive, stopSiren, playSiren, sirenMode, notifications, toggleNotification, requestPushPermission } = useSystem();
  
  // Fetch dynamic alerts from backend
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("@/config/firebase");
        const querySnapshot = await getDocs(collection(db, "alerts"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (data && data.length > 0) {
          const formatted = data.map((a: any) => ({
            id: a.id,
            type: a.severity || a.type || "high",
            title: a.alert_type || a.title || "Threat Identified",
            desc: a.description || a.desc || `AI classification: ${a.alert_type || 'Security Breach'}`,
            time: "Live Feed",
            location: a.location || "Sector Feed",
            status: a.status || "unresolved"
          }));
          setAlerts(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);
  const sirenActive = isSirenActive;

  const [showSirenModal, setShowSirenModal] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleDispatch = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'investigating' } : a));
    showToast(`Ranger Team Alpha dispatched to location for ${id}`);
  };

  const handleResolve = async (id: string) => {
    // 1. Update local state immediately for UI response
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    
    // 2. Persist to backend so it doesn't reset on refresh
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db } = await import("@/config/firebase");
      
      const alertDocRef = doc(db, "alerts", id);
      await updateDoc(alertDocRef, {
        status: "resolved"
      });
      showToast(`Alert ${id} has been officially RESOLVED.`);
    } catch (err) {
      console.error("Failed to persist alert status:", err);
    }
  };

  const handleSilenceSiren = () => {
    stopSiren();
    setShowSirenModal(false);
    showToast("System Siren has been disabled. Notification protocols active.");
  };

  const handleToggleNotification = (key: 'sms' | 'email' | 'push') => {
    if (key === 'push' && !notifications?.push) {
      requestPushPermission();
    } else {
      toggleNotification(key);
    }
    showToast(`${key === 'sms' ? 'Gmail' : key.toUpperCase()} alert protocols updated.`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6 relative">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-panel border border-border shadow-lg px-4 py-3 rounded-md flex items-center gap-3 z-50 animate-fade-in text-sm font-medium">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          {toastMsg}
        </div>
      )}

      {/* Feed Modal */}
      {showFeedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-panel w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-border animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b border-border bg-background">
              <h3 className="font-bold flex items-center gap-2"><Eye className="h-5 w-5 text-primary"/> Live Feed Analysis: {showFeedModal}</h3>
              <button onClick={() => setShowFeedModal(null)} className="text-secondary hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative h-[300px] bg-black flex items-center justify-center">
              {/* Simulated Camera Feed */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629853925760-b7470fcfdcb9?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80" />
              <div className="absolute top-[30%] left-[40%] w-[120px] h-[200px] border-2 border-danger shadow-[0_0_10px_rgba(239,68,68,0.8)] rounded-sm">
                <span className="absolute -top-6 left-0 bg-danger text-white text-[10px] font-mono px-1 py-0.5 whitespace-nowrap">POACHER: 94%</span>
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-0.5 bg-primary/40 shadow-[0_0_15px_rgba(37,99,235,0.8)] animate-[scan_3s_ease-in-out_infinite]" />
              </div>
            </div>
            <div className="p-4 flex justify-end gap-3 bg-background">
              <button onClick={() => setShowFeedModal(null)} className="px-4 py-2 bg-secondary/10 text-foreground rounded-md text-sm font-medium hover:bg-secondary/20 transition-colors">Close Feed</button>
              <button onClick={() => { handleDispatch(showFeedModal); setShowFeedModal(null); }} className="px-4 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-danger/90 transition-colors shadow-sm flex items-center gap-2"><Users className="h-4 w-4"/> Dispatch Intercept Team</button>
            </div>
          </div>
        </div>
      )}

      {/* Siren Modal */}
      {showSirenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-panel w-full max-w-md rounded-xl shadow-2xl p-6 border border-border animate-fade-in text-center">
            <div className="h-16 w-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
              <BellRing className="h-8 w-8 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-2">Disable Master Siren?</h2>
            <p className="text-secondary text-sm mb-6">Are you sure you want to silence the active alert siren? Emergency notifications will still proceed via enabled channels.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowSirenModal(false)} className="px-4 py-2 bg-background border border-border text-foreground rounded-md text-sm font-medium hover:bg-secondary/10">Cancel</button>
              <button onClick={handleSilenceSiren} className="px-4 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-danger/90 shadow-sm">Confirm Silence</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-danger" />
            Threat Intelligence
          </h1>
          <p className="text-secondary text-sm mt-1">Real-time alerts and incident response management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        
        {/* Main Alert Feed */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {alerts.map((alert, idx) => (
            <div key={alert.id || idx} className="glass p-5 rounded-xl border border-border hover:border-secondary/50 transition-colors flex flex-col sm:flex-row gap-5 relative overflow-hidden group">
              
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                alert.type === 'critical' ? 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                alert.type === 'high' ? 'bg-warning' :
                alert.type === 'medium' ? 'bg-accent' : 'bg-secondary'
              }`}></div>
              
              <div className="flex-1 pl-2">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {alert.type === 'critical' && <AlertOctagon className="h-5 w-5 text-danger animate-pulse" />}
                    {alert.type === 'high' && <AlertTriangle className="h-5 w-5 text-warning" />}
                    <h3 className="text-lg font-bold">{alert.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-secondary bg-background px-2 py-1 rounded border border-border">{alert.id}</span>
                </div>
                
                <p className="text-secondary text-sm mb-4">{alert.desc}</p>
                
                <div className="flex flex-wrap gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1 text-secondary">
                    <Clock className="h-3.5 w-3.5" /> {alert.time}
                  </span>
                  <span className="flex items-center gap-1 text-secondary">
                    <MapPin className="h-3.5 w-3.5" /> {alert.location}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px] ${
                    alert.status === 'unresolved' ? 'bg-danger/10 text-danger border border-danger/20' :
                    alert.status === 'investigating' ? 'bg-warning/10 text-warning border border-warning/20' :
                    'bg-primary/10 text-primary border border-primary/20'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 justify-center sm:border-l border-border sm:pl-5 w-full sm:w-auto min-w-[140px] mt-4 sm:mt-0">
                {alert.status === 'unresolved' && (
                  <button onClick={() => handleDispatch(alert.id)} className={`alert-btn flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-semibold transition-all text-center border ${
                    alert.type === 'critical' ? 'bg-red-50 hover:bg-red-100 text-[#d4351c] border-red-200' :
                    alert.type === 'high' ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-[#e6f4ea] hover:bg-[#d0ebd6] text-[#00703c] border-[#00703c]/20'
                  }`}>
                    Dispatch Team
                  </button>
                )}
                {(alert.status === 'unresolved' || alert.status === 'investigating') && (
                  <button onClick={() => handleResolve(alert.id)} className="alert-btn flex-1 sm:flex-none bg-emerald-50 hover:bg-emerald-100 text-[#00703c] border border-emerald-200 px-3 py-1.5 rounded-md text-xs font-semibold transition-all text-center">
                    Mark Resolved
                  </button>
                )}
                {alert.status === 'investigating' && (
                  <button disabled className="alert-btn flex-1 sm:flex-none bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-md text-xs font-semibold text-center opacity-70 cursor-not-allowed">
                    Team En Route
                  </button>
                )}
                {(alert.status === 'unresolved' || alert.status === 'investigating') && (
                  <button onClick={() => setShowFeedModal(alert.id)} className="alert-btn flex-1 sm:flex-none bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-md text-xs font-medium transition-all text-center">
                    View Feed
                  </button>
                )}
                {alert.status === 'resolved' && (
                  <div className="text-success text-[10px] font-bold text-center flex items-center justify-center gap-1">
                    <Check className="h-3 w-3" /> THREAT NEUTRALIZED
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          
          <div className={`glass rounded-xl border ${sirenActive ? 'border-danger/30' : 'border-border'} p-5 relative overflow-hidden transition-all duration-500`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BellRing className={`h-24 w-24 ${sirenActive ? 'text-danger' : 'text-secondary'}`} />
            </div>
            <h3 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${sirenActive ? 'text-danger' : 'text-foreground'}`}>
              <BellRing className={`h-5 w-5 ${sirenActive && sirenMode === 'active' ? 'animate-bounce' : ''}`} />
              {sirenActive ? `Siren Active (${sirenMode === 'active' ? 'Emergency' : 'Silent'})` : 'Siren Standby'}
            </h3>
            <p className="text-sm text-secondary mb-4">
              {sirenActive 
                ? (sirenMode === 'active' 
                    ? 'Emergency audio siren is active across all sectors. Interception teams dispatched.' 
                    : 'Siren is in silent monitoring mode. Visual alerts and logging active.')
                : 'Siren array is currently standing by. AI automation active.'}
            </p>
            
            {sirenActive ? (
              <button onClick={() => setShowSirenModal(true)} className="alert-btn w-full bg-danger hover:bg-danger/90 text-white py-2 rounded-md text-sm font-bold shadow-[0_4px_14px_rgba(239,68,68,0.39)] transition-colors">
                SILENCE SYSTEM
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => playSiren('active')}
                  className="alert-btn flex-1 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 py-2 rounded-md text-xs font-bold transition-all"
                >
                  ACTIVATE SIREN
                </button>
                <button 
                  onClick={() => playSiren('silent')}
                  className="alert-btn flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 py-2 rounded-md text-xs font-bold transition-all"
                >
                  SILENT MODE
                </button>
              </div>
            )}
          </div>

          <div className="glass rounded-xl border border-border p-5">
            <h3 className="font-semibold text-lg mb-4">Notification Channels</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Gmail Emergency Alerts</p>
                  <p className="text-xs text-secondary">Authorized Officers Only</p>
                </div>
                <button 
                  onClick={() => handleToggleNotification('sms')}
                  className={`h-6 w-11 rounded-full relative transition-colors ${notifications?.sms ? 'bg-danger' : 'bg-secondary/30'}`}
                >
                  <div className={`absolute top-1 bg-white h-4 w-4 rounded-full transition-all ${notifications?.sms ? 'right-1 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'left-1'}`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Reports</p>
                  <p className="text-xs text-secondary">Admin & HQ</p>
                </div>
                <button 
                  onClick={() => handleToggleNotification('email')}
                  className={`h-6 w-11 rounded-full relative transition-colors ${notifications?.email ? 'bg-primary' : 'bg-secondary/30'}`}
                >
                  <div className={`absolute top-1 bg-white h-4 w-4 rounded-full transition-all ${notifications?.email ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-secondary">Mobile App Users</p>
                </div>
                <button 
                  onClick={() => handleToggleNotification('push')}
                  className={`h-6 w-11 rounded-full relative transition-colors ${notifications?.push ? 'bg-primary' : 'bg-secondary/30'}`}
                >
                  <div className={`absolute top-1 bg-white h-4 w-4 rounded-full transition-all ${notifications?.push ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

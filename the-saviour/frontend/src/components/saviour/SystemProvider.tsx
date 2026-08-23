"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { EmergencyPopup } from './EmergencyPopup';
import { AI_CORE_WS_URL } from '@/config/api';

type Role = 'main_officer' | 'sub_officer' | null;

interface SystemContextType {
  role: Role;
  officerId: string;
  setOfficerInfo: (role: Role, id: string) => void;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  playClick: () => void;
  playNotify: () => void;
  playSiren: (mode?: 'active' | 'silent') => void;
  stopSiren: () => void;
  isSirenActive: boolean;
  sirenMode: 'active' | 'silent';
  notifications: { sms: boolean; email: boolean; push: boolean };
  toggleNotification: (key: 'sms' | 'email' | 'push') => void;
  requestPushPermission: () => Promise<void>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [officerId, setOfficerId] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [sirenMode, setSirenMode] = useState<'active' | 'silent'>('active');
  const [notifications, setNotifications] = useState({
    sms: true, // Now Gmail Alerts
    email: true,
    push: false
  });
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);
  const sirenGainRef = useRef<GainNode | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as Role;
    const savedId = localStorage.getItem('officerId');
    if (savedRole && savedId) {
      setRole(savedRole);
      setOfficerId(savedId);
    }
    
    
    const savedNotifs = localStorage.getItem('system_notifications');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {}
    }

    const savedSirenMode = localStorage.getItem('siren_mode') as 'active' | 'silent';
    if (savedSirenMode) setSirenMode(savedSirenMode);
    
    // WebSocket for real-time alerts
    const ws = new WebSocket(AI_CORE_WS_URL);
    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      handleIncomingAlert(alert);
    };

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('SW Registered');
      });
    }
    
    // Add global click listener for UI interaction sounds
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
        playClick();
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      ws.close();
    };
  }, []);

  const handleIncomingAlert = async (alert: any) => {
    // 0. Add to active alerts for popup
    setActiveAlerts(prev => [...prev, alert]);
    
    // Auto-remove alert after 10 seconds
    setTimeout(() => {
      setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, 10000);

    // 1. Play notification sound
    playNotify();

    // 2. Trigger Siren only for critical threats (e.g. Weapons) - DISABLED AS PER REQUEST
    /*
    if (alert.severity === 'critical') {
      playSiren(sirenMode);
    }
    */

    // 3. Browser Push Notification
    if (notifications.push && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 ${alert.alert_type}`, {
        body: `Detected in ${alert.location}. Confidence: ${alert.confidence || '90'}%`,
        icon: '/favicon.ico'
      });
    }

    // 4. Gmail Alert (using our Nodemailer route)
    if (notifications.sms) { // Mapping 'sms' toggle to Gmail Alerts as per request
      try {
        await fetch('/api/alerts/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threatType: alert.alert_type,
            timestamp: alert.timestamp,
            location: alert.location,
            cameraId: alert.camera_id || 'CAM-NODE-01',
            threatLevel: alert.severity || 'high',
            confidence: alert.confidence || '94',
            dashboardUrl: window.location.origin + '/alerts'
          })
        });
      } catch (e) {
        console.error('Failed to send Gmail alert', e);
      }
    }
  };

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toggleNotification('push');
      }
    }
  };

  const setOfficerInfo = (newRole: Role, newId: string) => {
    setRole(newRole);
    setOfficerId(newId);
    localStorage.setItem('userRole', newRole || '');
    localStorage.setItem('officerId', newId || '');
  };

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playClick = () => {
    if (!audioEnabled) return;
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  const playNotify = () => {
    if (!audioEnabled) return;
    const ctx = getAudioCtx();
    [600, 800].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.5);
    });
  };

  const playSiren = (mode: 'active' | 'silent' = 'active') => {
    if (isSirenActive) return;
    setIsSirenActive(true);
    setSirenMode(mode);
    localStorage.setItem('siren_mode', mode);

    if (mode === 'silent' || !audioEnabled) {
        // Visual only mode - state is already set to active
        return;
    }

    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    gain.gain.value = 0.1; // Balanced volume for siren
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    
    let isHigh = false;
    const toggleFreq = () => {
      if (!sirenOscRef.current) return;
      sirenOscRef.current.frequency.setTargetAtTime(isHigh ? 600 : 900, ctx.currentTime, 0.1);
      isHigh = !isHigh;
    };
    
    sirenOscRef.current = osc;
    sirenGainRef.current = gain;
    sirenIntervalRef.current = setInterval(toggleFreq, 600);
  };

  const stopSiren = () => {
    if (sirenOscRef.current) {
      sirenOscRef.current.stop();
      sirenOscRef.current.disconnect();
      sirenOscRef.current = null;
    }
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
    }
    setIsSirenActive(false);
  };

  const toggleNotification = (key: 'sms' | 'email' | 'push') => {
    setNotifications(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('system_notifications', JSON.stringify(next));
      return next;
    });
  };

  return (
    <SystemContext.Provider value={{ 
        role, 
        officerId, 
        setOfficerInfo, 
        audioEnabled, 
        setAudioEnabled, 
        playClick, 
        playNotify, 
        playSiren, 
        stopSiren, 
        isSirenActive, 
        sirenMode,
        notifications, 
        toggleNotification,
        requestPushPermission
    }}>
      {children}
      
      {/* Global Alert Popups */}
      <div className="fixed top-0 right-0 z-[1000] pointer-events-none p-6 space-y-4">
        {activeAlerts.map(alert => (
          <div key={alert.id} className="pointer-events-auto">
            <EmergencyPopup 
              alert={alert} 
              onDismiss={(id) => setActiveAlerts(prev => prev.filter(a => a.id !== id))} 
            />
          </div>
        ))}
      </div>
    </SystemContext.Provider>
  );
}

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used within SystemProvider");
  return context;
};

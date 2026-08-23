"use client";

import { ArrowLeft, Plus, Save, MapPin, Activity, Navigation, Clock, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRecordPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activityType, setActivityType] = useState("Animal Detection");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [source, setSource] = useState("Manual Entry");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      const newRecord = {
        id: `REC-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toISOString(),
        activityType,
        location,
        coordinates,
        source
      };

      const existingRecords = JSON.parse(localStorage.getItem('saviour_activity_logs') || '[]');
      const updatedRecords = [newRecord, ...existingRecords];
      localStorage.setItem('saviour_activity_logs', JSON.stringify(updatedRecords));

      // Trigger a custom event to notify other components (like dashboard/database)
      window.dispatchEvent(new Event('recordsUpdated'));

      setIsSaving(false);
      router.push('/database');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[800px] mx-auto w-full gap-6">
      
      <div className="flex items-center gap-4 animate-fade-in">
        <Link href="/database" className="p-2 border border-border rounded-md hover:bg-secondary/10 transition-colors bg-panel text-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
            <Plus className="h-8 w-8 text-primary" />
            Add Activity Record
          </h1>
          <p className="text-secondary text-sm mt-1">Manually insert a new surveillance or detection log into the database.</p>
        </div>
      </div>

      <div className="glass rounded-xl border border-border p-6 md:p-8 animate-[fade-in_0.5s_ease-out_forwards]" style={{ animationDelay: '100ms' }}>
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-foreground group-focus-within:text-primary transition-colors">Activity Type</label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary group-focus-within:text-primary transition-colors" />
                <select 
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-sm text-foreground hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <option className="bg-panel text-foreground">Animal Detection</option>
                  <option className="bg-panel text-foreground">Human Intrusion</option>
                  <option className="bg-panel text-foreground">Vehicle Movement</option>
                  <option className="bg-panel text-foreground">Camera Maintenance</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary pointer-events-none group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-foreground group-focus-within:text-primary transition-colors">Timestamp</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  disabled
                  value={new Date().toLocaleString()}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/10 border border-border rounded-lg text-secondary text-sm font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-foreground group-focus-within:text-primary transition-colors">Location Name</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector Alpha, North Gate"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground hover:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-foreground group-focus-within:text-primary transition-colors">Coordinates (Lat, Lng)</label>
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder="e.g. 29.5300, 78.7747"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground font-mono hover:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-4">
            <Link href="/database" className="px-6 py-2.5 rounded-lg text-sm font-bold text-secondary hover:bg-secondary/10 hover:text-foreground transition-all border border-transparent">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-primary text-primary-foreground px-8 py-2.5 rounded-lg text-sm font-bold shadow-[var(--shadow-glow)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving to Database...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 group-hover:scale-110 transition-transform" /> Save Record
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Film, X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { db } from "@/config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useSystem } from "@/components/saviour/SystemProvider";
import { AI_CORE_URL } from "@/config/api";

type UploadedFile = {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video";
  status: "uploading" | "success" | "error" | "processing";
  results?: any[];
  errorMsg?: string;
};

export function DataUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playClick, playNotify } = useSystem();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (newFiles: FileList | File[]) => {
    const newUploads = Array.from(newFiles).map((file) => {
      const isVideo = file.type.startsWith("video/");
      return {
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file),
        type: (isVideo ? "video" : "image") as "video" | "image",
        status: "uploading" as const,
      };
    });

    setFiles((prev) => [...prev, ...newUploads]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const analyzeAll = async () => {
    const pendingFiles = files.filter(f => f.status !== "success" && f.status !== "processing");
    if (pendingFiles.length === 0) return;

    playClick();

    for (const fileObj of pendingFiles) {
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "processing" } : f));
      
      // Simulate highly realistic cyber scanning progress delay (0.2s)
      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        const formData = new FormData();
        formData.append("file", fileObj.file);

        // Fetch actual YOLO AI results from Render backend!
        const res = await fetch(`${AI_CORE_URL}/api/v1/detect`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`AI Core status: ${res.status}`);
        }

        const detections = await res.json();
        
        let processedResults = [{ class_name: "Clear Sector", confidence: 1.0, severity: "low", isThreat: false }];
        
        if (detections && detections.length > 0) {
          processedResults = detections.map((d: any) => {
            const name = d.class_name || "Unknown";
            const conf = d.confidence || 0.90;
            
            const criticalClasses = ["WEAPON", "POACHER", "GUN", "RIFLE", "PISTOL"];
            const warningClasses = ["HUMAN", "PERSON", "VEHICLE", "CAR", "TRUCK", "VAN", "BIKE"];
            
            const isCritical = criticalClasses.some(c => name.toUpperCase().includes(c));
            const isWarning = warningClasses.some(c => name.toUpperCase().includes(c));
            const severity = isCritical ? "critical" : isWarning ? "medium" : "low";
            
            return {
              class_name: name,
              confidence: conf,
              severity: severity,
              isThreat: isCritical || isWarning
            };
          });
        }

        const locations = ["Zone Alpha Perimeter", "Sector Bravo Crossing", "River Basin Node", "North Gate Access Road"];
        const loc = locations[Math.floor(Math.random() * locations.length)];

        // Save detections to Firestore
        for (const item of processedResults) {
          await addDoc(collection(db, "detections"), {
            species: item.class_name,
            confidence: Math.round(item.confidence * 1000) / 10,
            location: loc,
            severity: item.severity,
            status: item.isThreat ? "Dispatched" : "Logged",
            region: loc.split(" ")[0] + " " + (loc.split(" ")[1] || ""),
            timestamp: Timestamp.now()
          });

          // Log this evidence upload directly in Firestore live logs!
          const logText = item.isThreat
            ? `🚨 CRITICAL UPLOAD: Tactical AI analyzed evidence "${fileObj.file.name}" and locked armed target (${item.class_name}) at ${loc}!`
            : `UPLOAD SUCCESS: AI analyzed evidence "${fileObj.file.name}" and identified ${item.class_name} at ${loc} with ${Math.round(item.confidence * 100)}% confidence.`;

          await addDoc(collection(db, "logs"), {
            text: logText,
            type: item.isThreat ? "alert" : "detection",
            severity: item.severity,
            operator: "TACTICAL-AI",
            timestamp: Timestamp.now()
          });
        }

        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "success", results: processedResults } : f));
        playNotify();

      } catch (err: any) {
        console.error("AI core fetch or Firebase write error:", err);
        const errMsg = err?.message || String(err);
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "error", errorMsg: errMsg } : f));
      }
    }
  };

  return (
    <div className="bg-[#0B2E13]/80 border border-[#1B4332]/60 rounded-2xl p-5 flex flex-col w-full h-full min-h-[400px] font-mono text-xs text-slate-200">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#1B4332]/40">
        <h3 className="font-semibold text-sm flex items-center gap-2 text-slate-100 uppercase tracking-widest">
          <UploadCloud className="h-5 w-5 text-[#39FF14]" />
          TACTICAL EVIDENCE PORTAL
        </h3>
        {files.length > 0 && (
          <button 
            onClick={analyzeAll}
            className="text-[10px] bg-[#39FF14] text-[#081C15] px-3 py-1.5 rounded-md hover:bg-[#39FF14]/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all font-bold uppercase tracking-wider"
          >
            RUN AI INFERENCE
          </button>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex-shrink-0 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-[#39FF14] bg-[#123524]/40"
            : "border-[#1B4332] hover:border-[#39FF14]/60 hover:bg-[#123524]/20"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />
        <div className="h-10 w-10 rounded-full bg-[#123524] flex items-center justify-center mb-2 border border-[#1B4332]">
          <UploadCloud className="h-5 w-5 text-[#39FF14]" />
        </div>
        <p className="font-bold text-slate-200 mb-1">
          DRAG EVIDENCE FILES HERE OR BROWSE
        </p>
        <p className="text-[10px] text-slate-400">
          JPG, PNG, MP4, AVI SECURE METADATA SYNC (MAX 50MB)
        </p>
      </div>

      <div className="flex-1 mt-4 overflow-y-auto pr-2 space-y-3 max-h-[190px]">
        {files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 italic py-10 text-center uppercase tracking-wider text-[10px] opacity-70">
            No telemetry files queued.
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[#1B4332] bg-[#081C15] animate-fade-in group"
            >
              <div className="h-10 w-10 rounded-md overflow-hidden bg-[#123524] flex-shrink-0 relative flex items-center justify-center border border-[#1B4332]">
                {file.type === "image" ? (
                  <img src={file.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <video src={file.previewUrl} className="w-full h-full object-cover opacity-50" />
                    <Film className="absolute h-4 w-4 text-[#39FF14]" />
                  </>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-200 truncate">
                  {file.file.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-slate-400">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  {file.status === "processing" ? (
                    <span className="text-[9px] text-[#39FF14] flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" /> AI INFERENCE ACTIVE...
                    </span>
                  ) : file.status === "success" ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-[#39FF14] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="h-3 w-3" /> ANALYSIS WRITTEN TO CLOUD
                      </span>
                      {file.results && file.results.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1">
                          {file.results.map((r, i) => (
                            <span key={i} className="text-[11px] bg-[#e6f4ea] border border-[#00703c]/20 text-[#00703c] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">
                              {r.class_name} ({Math.round(r.confidence * 100)}%)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : file.status === "error" ? (
                    <span className="text-[9px] text-red-500 flex flex-col gap-0.5 font-bold">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> SECURE GRID TRANSMISSION FAILED
                      </span>
                      {file.errorMsg && (
                        <span className="text-[8px] text-red-400/90 pl-4 font-mono truncate max-w-[280px]" title={file.errorMsg}>
                          ERR: {file.errorMsg}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 flex items-center gap-1">
                      <UploadCloud className="h-3 w-3" /> SECURED ON STANDBY
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="h-8 w-8 rounded-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-950/20 transition-colors"
                title="Remove evidence"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

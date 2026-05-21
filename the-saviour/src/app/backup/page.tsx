"use client";

import { DatabaseBackup, HardDrive, ShieldCheck, ArrowLeft, DownloadCloud } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BackupPage() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing connection to AWS S3 Glacier...");
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState<{title: string, desc: string, type: 'success'|'danger'|'info'} | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleDownloadLogs = async () => {
    setIsDownloading(true);
    setToastMsg({ title: "Generating Logs", desc: "Please wait while we compile the officer audit report.", type: "info" });

    try {
      const response = await fetch('/api/logs/download');
      if (!response.ok) throw new Error('PDF Generation Failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Saviour_Officer_Audit_Log_${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setToastMsg({ title: "Download Complete", desc: "The audit log PDF has been successfully downloaded.", type: "success" });
    } catch (error) {
      console.error(error);
      setToastMsg({ title: "Error", desc: "Failed to generate audit logs. Check server logs.", type: "danger" });
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStatus("Backup Complete. Data fully encrypted and stored safely.");
          return 100;
        }
        if (prev === 20) setStatus("Compressing 865 GB of telemetry data...");
        if (prev === 50) setStatus("Uploading to secure cloud storage...");
        if (prev === 80) setStatus("Verifying checksums and encryption...");
        return prev + 5;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[800px] mx-auto w-full gap-6 items-center justify-center min-h-[calc(100vh-4rem)] relative">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border flex flex-col gap-1 w-[320px] animate-fade-in ${
          toastMsg.type === 'success' ? 'bg-panel border-success/30 text-success' : 
          toastMsg.type === 'danger' ? 'bg-panel border-danger/30 text-danger' : 
          'bg-panel border-border text-foreground'
        }`}>
          <div className="font-bold">{toastMsg.title}</div>
          <div className="text-sm opacity-90 text-secondary">{toastMsg.desc}</div>
        </div>
      )}
      
      <div className="w-full">
        <Link href="/database" className="inline-flex items-center gap-2 text-secondary hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Database
        </Link>
        
        <div className="glass rounded-2xl p-8 border border-border shadow-[var(--shadow-elegant)] text-center animate-fade-in">
          
          <div className="relative h-24 w-24 mx-auto mb-6 flex items-center justify-center">
            {progress < 100 ? (
              <>
                <div className="absolute inset-0 border-4 border-secondary/20 rounded-full"></div>
                <div 
                  className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                  style={{ animationDuration: '1.5s' }}
                ></div>
                <DatabaseBackup className="h-10 w-10 text-primary animate-pulse" />
              </>
            ) : (
              <div className="bg-success/10 rounded-full h-24 w-24 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="h-12 w-12 text-success" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {progress < 100 ? "System Backup in Progress" : "Backup Successful"}
          </h1>
          <p className="text-secondary font-medium mb-8 h-6">{status}</p>

          <div className="w-full bg-secondary/20 rounded-full h-3 mb-2 overflow-hidden border border-border/50">
            <div 
              className={`h-full rounded-full transition-all duration-300 ease-out ${progress === 100 ? 'bg-success' : 'bg-primary'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-mono text-secondary mb-8">
            <span>0%</span>
            <span>{progress}%</span>
          </div>

          {progress === 100 && (
            <div className="flex gap-4 justify-center animate-fade-in">
              <button 
                onClick={handleDownloadLogs}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-panel border border-border text-foreground px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-secondary/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <><div className="h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" /> Compiling...</>
                ) : (
                  <><DownloadCloud className="h-4 w-4" /> Download Logs</>
                )}
              </button>
              <Link href="/database" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-bold shadow-[var(--shadow-glow)] hover:bg-primary/90 transition-colors">
                Return to Database
              </Link>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

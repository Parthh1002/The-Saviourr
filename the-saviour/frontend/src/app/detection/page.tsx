"use client";

import { Upload, Video, Image as ImageIcon, Play, Pause, RefreshCw, Crosshair } from "lucide-react";
import { useState, useRef } from "react";
import { AI_CORE_URL } from "@/config/api";

export default function DetectionPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'upload'>('live');
  const [isPlaying, setIsPlaying] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  
  const LIVE_CHANNELS = [
    { id: 'CH-01', name: 'Elephant Sanctuary', video: '/videos/elephant.mp4', detection: 'Elephant', confidence: 99.8, bbox: { t: '30%', l: '40%', w: '200px', h: '180px' }, type: 'wildlife' },
    { id: 'CH-02', name: 'Tiger Reserve', video: '/videos/tiger.mp4', detection: 'Tiger', confidence: 94.5, bbox: { t: '40%', l: '30%', w: '180px', h: '150px' }, type: 'wildlife' },
    { id: 'CH-03', name: 'West Border', video: '/videos/vehicle.mp4', detection: 'Vehicle', confidence: 88.2, bbox: { t: '50%', l: '20%', w: '250px', h: '120px' }, type: 'warning' },
    { id: 'CH-04', name: 'North Perimeter', video: '/videos/Human with gun.mp4', detection: 'Weapon Detected', confidence: 97.9, bbox: { t: '25%', l: '45%', w: '120px', h: '220px' }, type: 'threat' },
  ];

  const [currentChannel, setCurrentChannel] = useState(LIVE_CHANNELS[0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Detection System</h1>
          <p className="text-secondary text-sm">Advanced AI inference for object classification and threat analysis.</p>
        </div>
        <div className="flex bg-panel border border-border rounded-lg p-1">
          <button
            onClick={() => setActiveTab('live')}
            className={`tab-btn px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'live' ? 'bg-primary/20 text-primary shadow-sm' : 'text-secondary hover:text-foreground'}`}
          >
            Live Stream
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`tab-btn px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-primary/20 text-primary shadow-sm' : 'text-secondary hover:text-foreground'}`}
          >
            File Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">

        {/* Main View Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass rounded-xl border border-border overflow-hidden flex-1 relative min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-black/90">

            {activeTab === 'live' ? (
              <>
                {/* Live Stream Simulation */}
                <video
                  key={currentChannel.video}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 transition-opacity duration-500"
                  src={currentChannel.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  ref={videoRef}
                />
                
                {/* Channel Overlay */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 animate-fade-in">
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-md">
                    <div className="bg-[#00703c] p-1 rounded-full text-white flex items-center justify-center">
                      <Video className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">{currentChannel.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {LIVE_CHANNELS.map(ch => (
                      <button 
                        key={ch.id}
                        onClick={() => setCurrentChannel(ch)}
                        className={`channel-btn px-2 py-1 rounded text-[10px] font-bold transition-all border ${currentChannel.id === ch.id ? 'channel-btn-active' : 'channel-btn-inactive'}`}
                      >
                        {ch.id}
                      </button>
                    ))}
                  </div>
                </div>

                {isPlaying && (
                  <>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                      <div className="w-full h-1 bg-primary/40 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-[scan_4s_ease-in-out_infinite]" />
                    </div>

                    {/* AI Bounding Box Logic based on channel */}
                    <div className={`absolute transition-all duration-1000 border-2 shadow-[0_0_10px_rgba(37,99,235,0.8)] rounded-sm animate-pulse z-10 ${currentChannel.type === 'threat' ? 'border-danger shadow-danger/50' : 'border-primary shadow-primary/50'}`}
                      style={{
                        top: currentChannel.bbox.t,
                        left: currentChannel.bbox.l,
                        width: currentChannel.bbox.w,
                        height: currentChannel.bbox.h
                      }}
                    >
                      <span className={`absolute -top-7 left-0 text-white text-[10px] font-mono px-2 py-1 whitespace-nowrap font-bold tracking-wider rounded-t-sm ${currentChannel.type === 'threat' ? 'bg-danger' : 'bg-primary'}`}>
                        {currentChannel.detection.toUpperCase()}: {currentChannel.confidence}%
                      </span>
                    </div>
                  </>
                )}

                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm animate-fade-in">
                  <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-[#00703c] animate-pulse' : 'bg-slate-400'}`}></div>
                  <span className="hidden sm:inline text-xs font-mono text-slate-900 font-bold">{isPlaying ? 'LIVE STREAMING' : 'PAUSED'}</span>
                  <span className="sm:hidden text-[10px] font-mono text-slate-900 font-bold">{isPlaying ? 'LIVE' : 'PAUSED'}</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                {previewUrl ? (
                  <div className="relative max-w-full max-h-full">
                    <img src={previewUrl} className="max-w-full max-h-[70vh] rounded-lg shadow-2xl" alt="Preview" />
                    
                    {/* Real Dynamic Bounding Boxes */}
                    {!isProcessing && Array.isArray(detections) && detections.map((det, index) => {
                      if (!det || !det.bbox || !Array.isArray(det.bbox)) return null;
                      
                      const [x, y, w, h] = det.bbox;
                      return (
                        <div 
                          key={index}
                          className="absolute border-2 border-primary shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-sm"
                          style={{
                            left: `${x - w/2}px`, 
                            top: `${y - h/2}px`,
                            width: `${w}px`,
                            height: `${h}px`,
                            transform: 'scale(1)' 
                          }}
                        >
                          <span className="absolute -top-7 left-0 bg-primary text-primary-foreground text-[10px] font-mono px-2 py-0.5 whitespace-nowrap font-bold tracking-wider rounded">
                            {det.class_name || 'OBJECT'}: {(det.confidence ? det.confidence * 100 : 0).toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}

                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-3 max-w-[85%] text-center p-4">
                          <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                          <span className="text-sm font-mono text-white font-bold uppercase tracking-wider">AI ANALYSIS IN PROGRESS...</span>
                          <span className="text-[10px] font-mono text-slate-300 leading-relaxed max-w-[280px]">
                            Establishing neural connection. This may take up to 60 seconds if the Render server is waking up from idle.
                          </span>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => { setPreviewUrl(null); setDetections([]); }}
                      className="absolute -top-4 -right-4 bg-danger text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-panel/30 w-[80%] max-w-[500px] transition-all hover:border-primary/50">
                    <div className="bg-primary/10 p-4 rounded-full mb-4 shadow-[var(--shadow-glow)]">
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Upload for Real AI Analysis</h3>
                    <p className="text-sm text-secondary mb-6">Upload footage to run your trained model on the backend.</p>

                    <div className="flex gap-3">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*,video/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const url = URL.createObjectURL(file);
                          setPreviewUrl(url);
                          setIsProcessing(true);
                          
                          const formData = new FormData();
                          formData.append("file", file);
                          
                          try {
                            const response = await fetch(`${AI_CORE_URL}/api/v1/detect`, {
                              method: "POST",
                              headers: {
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                              },
                              body: formData
                            });
                            if (response.ok) {
                              const data = await response.json();
                              setDetections(Array.isArray(data) ? data : [data]);
                            } else {
                              const errorData = await response.text();
                              console.error(`Backend Error (${response.status}):`, errorData);
                              alert(`AI Backend Error ${response.status}: Failed to connect to AI server at ${AI_CORE_URL}. The service may be starting up.`);
                              setDetections([]);
                            }
                          } catch (err) {
                            console.error("Inference Error:", err);
                          } finally {
                            setIsProcessing(false);
                          }
                        }} 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-all shadow-[var(--shadow-glow)] cursor-pointer flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" /> Select Media
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Control Bar overlay */}
            {activeTab === 'live' && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 bg-white/90 backdrop-blur-md px-3 md:px-6 py-2 md:py-3 rounded-full border border-slate-200 shadow-lg animate-fade-in z-20 max-w-[90%] w-auto">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) videoRef.current.pause();
                      else videoRef.current.play();
                    }
                    setIsPlaying(!isPlaying);
                  }}
                  className="video-control-btn"
                >
                  {isPlaying ? <Pause className="h-5 w-5 text-slate-800" /> : <Play className="h-5 w-5 text-slate-800" />}
                </button>
                <div className="h-4 w-px bg-slate-200"></div>
                <button className="video-control-btn">
                  <ImageIcon className="h-5 w-5 text-slate-800" />
                </button>
                <button className="video-control-btn">
                  <Video className="h-5 w-5 text-slate-800" />
                </button>
                <div className="h-4 w-px bg-slate-200"></div>
                <button className="video-control-btn" title="Retrain/Refresh model">
                  <RefreshCw className="h-5 w-5 text-slate-800" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-xl border border-border p-5 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Crosshair className="h-5 w-5 text-accent" />
                Inference Results
              </h3>
              {Array.isArray(detections) && detections.some(det => 
                ["HUMAN", "WEAPON", "POACHER", "GUN", "PERSON", "RIFLE", "PISTOL"].some(c => 
                  det.class_name?.toUpperCase().includes(c)
                ) && det.confidence > 0.2
              ) && (
                <div className="bg-danger/10 text-danger border border-danger/30 px-2 py-1 rounded text-[10px] font-bold animate-pulse">
                  THREAT IDENTIFIED
                </div>
              )}
            </div>

            <div className="space-y-4">
              {Array.isArray(detections) && detections.length > 0 ? detections.filter(d => d && d.bbox).map((det, index) => (
                <div key={index} className="p-3 bg-panel border border-border rounded-lg animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-primary">{det.class_name}</span>
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{(det.confidence ? det.confidence * 100 : 0).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(det.confidence || 0) * 100}%` }}></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-secondary">
                    <span className="bg-background px-2 py-1 rounded border border-border">X: {det.bbox?.[0]}</span>
                    <span className="bg-background px-2 py-1 rounded border border-border">Y: {det.bbox?.[1]}</span>
                    <span className="bg-background px-2 py-1 rounded border border-border">W: {det.bbox?.[2]}</span>
                    <span className="bg-background px-2 py-1 rounded border border-border">H: {det.bbox?.[3]}</span>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                  <Crosshair className="h-10 w-10 mb-2 text-secondary" />
                  <p className="text-xs font-mono">NO ACTIVE INFERENCE DATA</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-secondary mb-3 uppercase tracking-wider">Model Status</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Active Model</span>
                  <span className="font-mono text-foreground">YOLOv8-Saviour-v2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Inference Time</span>
                  <span className="font-mono text-primary">12ms (83 FPS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Resolution</span>
                  <span className="font-mono text-foreground">1920x1080</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Device</span>
                  <span className="font-mono text-accent">NVIDIA T4 Edge</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

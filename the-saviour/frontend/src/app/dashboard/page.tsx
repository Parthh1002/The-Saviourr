"use client";

import { Activity, Camera, AlertTriangle, Users, MapPin, Search, Map as MapIcon, ChevronRight, Eye, Crosshair, TriangleAlert, Compass, Battery, Wifi, Navigation, Calendar, Download, RefreshCw, Plus, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';
import Link from "next/link";
import { ForestLocation, MapMode } from "@/components/tracking-map";
import { DataUpload } from "@/components/saviour/DataUpload";
import { useSystem } from "@/components/saviour/SystemProvider";
import { db } from "@/config/firebase";
import { collection, query, orderBy, limit, onSnapshot, addDoc, getDocs, Timestamp, where, doc, setDoc, writeBatch } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TrackingMap = dynamic(() => import('@/components/tracking-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0B2E13]/30 animate-pulse rounded-xl flex items-center justify-center text-[#39FF14]/70 font-mono">LOADING CYBER SATELLITE RADAR SYSTEM...</div>
});

// Helper for seeding initial data if Firebase collections are completely empty
const seedDatabaseIfEmpty = async () => {
  try {
    const detectionsRef = collection(db, "detections");
    const snapshot = await getDocs(query(detectionsRef, limit(1)));

    if (snapshot.empty) {
      console.log("Firebase Database is empty! Initializing Saviour cyber intelligence feed...");
      const batch = writeBatch(db);

      const now = new Date();
      const oneHour = 60 * 60 * 1000;
      const oneDay = 24 * 60 * 60 * 1000;

      // Seed Detections
      const dummyDetections = [
        { species: "Rhino", confidence: 98.2, location: "Zone Alpha Perimeter", severity: "medium", status: "Verified", region: "Sector Alpha", timestamp: new Date(now.getTime() - 2 * oneHour) },
        { species: "Human · armed", confidence: 94.6, location: "Sector Bravo Crossing", severity: "critical", status: "Dispatched", region: "Sector Bravo", timestamp: new Date(now.getTime() - 4 * oneHour) },
        { species: "Elephant", confidence: 97.1, location: "River Basin Watering Node", severity: "low", status: "Logged", region: "River Basin", timestamp: new Date(now.getTime() - 5 * oneHour) },
        { species: "Logging truck", confidence: 91.4, location: "North Gate Access Road", severity: "critical", status: "Escalated", region: "North Gate", timestamp: new Date(now.getTime() - 8 * oneHour) },
        { species: "Tiger", confidence: 99.0, location: "Sector Bravo Canopy", severity: "low", status: "Logged", region: "Sector Bravo", timestamp: new Date(now.getTime() - 11 * oneHour) },
        { species: "Leopard", confidence: 95.8, location: "Zone Alpha Perimeter", severity: "low", status: "Logged", region: "Sector Alpha", timestamp: new Date(now.getTime() - 15 * oneHour) },
        { species: "Human · armed", confidence: 96.5, location: "River Basin North", severity: "critical", status: "Dispatched", region: "River Basin", timestamp: new Date(now.getTime() - 18 * oneHour) },

        // Yesterday's Detections for math comparison (+15% yesterday delta)
        { species: "Rhino", confidence: 97.5, location: "Zone Alpha Perimeter", severity: "medium", status: "Verified", region: "Sector Alpha", timestamp: new Date(now.getTime() - 26 * oneHour) },
        { species: "Elephant", confidence: 98.0, location: "River Basin Node", severity: "low", status: "Logged", region: "River Basin", timestamp: new Date(now.getTime() - 28 * oneHour) },
        { species: "Tiger", confidence: 96.4, location: "Sector Bravo Canopy", severity: "low", status: "Logged", region: "Sector Bravo", timestamp: new Date(now.getTime() - 32 * oneHour) },
        { species: "Deer", confidence: 94.1, location: "North Gate Field", severity: "low", status: "Logged", region: "North Gate", timestamp: new Date(now.getTime() - 36 * oneHour) },
        { species: "Human · armed", confidence: 92.0, location: "Sector Bravo Border", severity: "critical", status: "Dispatched", region: "Sector Bravo", timestamp: new Date(now.getTime() - 40 * oneHour) },
        { species: "Rhino", confidence: 98.9, location: "River Basin North", severity: "medium", status: "Verified", region: "River Basin", timestamp: new Date(now.getTime() - 44 * oneHour) }
      ];

      dummyDetections.forEach((det) => {
        const docRef = doc(collection(db, "detections"));
        batch.set(docRef, {
          ...det,
          timestamp: Timestamp.fromDate(det.timestamp)
        });
      });

      // Seed Logs
      const dummyLogs = [
        { text: "AI Core successfully linked to Cloud Firestore Mesh.", type: "system", severity: "low", operator: "SYS-ADMIN", timestamp: new Date(now.getTime() - 23 * oneHour) },
        { text: "UAV-DRONE-01 launched on auto-patrol schedule.", type: "trigger", severity: "low", operator: "SEC-01", timestamp: new Date(now.getTime() - 12 * oneHour) },
        { text: "Rhino detected at Zone Alpha. Camera node active.", type: "detection", severity: "medium", operator: "SYS-AI", timestamp: new Date(now.getTime() - 2 * oneHour) },
        { text: "ALERT: Armed intruders scanned near Sector Bravo Crossing.", type: "alert", severity: "critical", operator: "SYS-AI", timestamp: new Date(now.getTime() - 4 * oneHour) },
        { text: "Ranger team Alpha dispatched to intercept intruders.", type: "ranger", severity: "critical", operator: "CMD-OFFICER", timestamp: new Date(now.getTime() - 3.8 * oneHour) },
        { text: "Elephant herd spotted at River Basin watering node.", type: "detection", severity: "low", operator: "SYS-AI", timestamp: new Date(now.getTime() - 5 * oneHour) },
        { text: "ALERT: Unauthorized logging vehicle scanned near North Gate.", type: "alert", severity: "critical", operator: "SYS-AI", timestamp: new Date(now.getTime() - 8 * oneHour) }
      ];

      dummyLogs.forEach((log) => {
        const docRef = doc(collection(db, "logs"));
        batch.set(docRef, {
          ...log,
          timestamp: Timestamp.fromDate(log.timestamp)
        });
      });

      // Seed Tasks
      const dummyTasks = [
        { text: "Investigate Zone Alpha Intrusion Alarms", status: "Pending", assignedTo: "SEC-01", timestamp: Timestamp.fromDate(now) },
        { text: "Perform thermal calibration on Camera Node 12", status: "In Progress", assignedTo: "SEC-02", timestamp: Timestamp.fromDate(now) }
      ];

      dummyTasks.forEach((task) => {
        const docRef = doc(collection(db, "tasks"));
        batch.set(docRef, task);
      });

      await batch.commit();
      console.log("Database seeded successfully!");
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [mapMode, setMapMode] = useState<MapMode>('standard');
  const [selectedForest, setSelectedForest] = useState<ForestLocation | null>(null);
  const [toastMsg, setToastMsg] = useState<{ title: string, desc: string, type: 'success' | 'danger' | 'warning' | 'info' } | null>(null);

  // Dynamic Realtime Firebase Data States
  const [liveDetections, setLiveDetections] = useState<any[]>([]);
  const [liveLogs, setLiveLogs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [detectionsCount24h, setDetectionsCount24h] = useState(0);
  const [yesterdayCount, setYesterdayCount] = useState(0);
  const [percentageDiff, setPercentageDiff] = useState(0);
  const [criticalAlertsCount, setCriticalAlertsCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>("Initializing...");

  // Automated Analytics & Report states
  const [analyticsStats, setAnalyticsStats] = useState<any>({
    totalDetections: 0,
    poachingIncidents: 0,
    threatPercentage: 0,
    regionalStats: {},
    speciesStats: {},
    trendData: [],
    aiSummary: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReportView, setShowReportView] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    dateRange: 'Last 7 Days',
    location: 'All',
    activityType: 'All',
    severity: 'All'
  });

  const { role, officerId, playClick, playNotify } = useSystem();
  const [newTask, setNewTask] = useState('');
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  // Trigger local seed and real-time snapshot listeners
  useEffect(() => {
    setMounted(true);

    // Seed DB if it doesn't have records
    seedDatabaseIfEmpty().then(() => {
      // 1. Live Detections Listener
      const qDetections = query(collection(db, "detections"), orderBy("timestamp", "desc"));
      const unsubscribeDetections = onSnapshot(qDetections, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLiveDetections(docs);

        // Process 24h & yesterday stats locally from Firebase collection
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

        let todayCountTemp = 0;
        let yesterdayCountTemp = 0;
        let criticalTemp = 0;

        docs.forEach((d: any) => {
          if (!d.timestamp) return;
          const time = d.timestamp.toDate ? d.timestamp.toDate().getTime() : new Date(d.timestamp).getTime();

          if (time >= startOfToday) {
            todayCountTemp++;
            if (d.severity === 'critical') criticalTemp++;
          } else if (time >= startOfYesterday && time < startOfToday) {
            yesterdayCountTemp++;
          }
        });

        setDetectionsCount24h(todayCountTemp);
        setYesterdayCount(yesterdayCountTemp);
        setCriticalAlertsCount(criticalTemp);

        const diff = yesterdayCountTemp === 0
          ? (todayCountTemp > 0 ? 100 : 0)
          : Math.round(((todayCountTemp - yesterdayCountTemp) / yesterdayCountTemp) * 100);
        setPercentageDiff(diff);

        if (docs.length > 0) {
          const latestDoc: any = docs[0];
          const latestTime = latestDoc.timestamp?.toDate ? latestDoc.timestamp.toDate() : new Date(latestDoc.timestamp);
          setLastUpdated(latestTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " PM");
        } else {
          setLastUpdated("No data logged");
        }
      }, (error) => {
        console.error("Detections Listener failed:", error);
      });

      // 2. Live Logs Listener (limited to 50 logs for premium scrollable view)
      const qLogs = query(collection(db, "logs"), orderBy("timestamp", "desc"), limit(50));
      const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLiveLogs(docs);
      }, (error) => {
        console.error("Logs Listener failed:", error);
      });

      // 3. Live Tasks Listener
      const qTasks = query(collection(db, "tasks"), orderBy("timestamp", "desc"));
      const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(docs);
      }, (error) => {
        console.error("Tasks Listener failed:", error);
      });

      return () => {
        unsubscribeDetections();
        unsubscribeLogs();
        unsubscribeTasks();
      };
    });

    // Background timer to compute 24h reset cycles
    const updateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeftStr(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimeLeft();
    const timeInterval = setInterval(updateTimeLeft, 1000);

    // Active Live Surveillance Simulator: Inserts a new random detection/log every 25 seconds
    const simulatorInterval = setInterval(async () => {
      const animalClasses = ["Rhino", "Elephant", "Tiger", "Leopard", "Deer"];
      const threatClasses = ["Human · armed", "Logging truck"];
      const isThreat = Math.random() > 0.75;

      const species = isThreat
        ? threatClasses[Math.floor(Math.random() * threatClasses.length)]
        : animalClasses[Math.floor(Math.random() * animalClasses.length)];

      const locations = ["Zone Alpha Perimeter", "Sector Bravo Crossing", "River Basin Node", "North Gate Access Road"];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const conf = parseFloat((90 + Math.random() * 9.9).toFixed(1));
      const sev = isThreat ? "critical" : (species === "Rhino" ? "medium" : "low");
      const stat = isThreat ? "Dispatched" : "Logged";

      try {
        // 1. Add Detection
        const newDetection = {
          species,
          confidence: conf,
          location: loc,
          severity: sev,
          status: stat,
          region: loc.split(" ")[0] + " " + (loc.split(" ")[1] || ""),
          timestamp: Timestamp.now()
        };
        await addDoc(collection(db, "detections"), newDetection);

        // 2. Add System Log
        const logText = isThreat
          ? `🚨 ALERT: Armed threat suspected (${species}) scanned at ${loc}.`
          : `Spotted ${species} (${conf}% confidence) at ${loc}. Camera triggered successfully.`;

        await addDoc(collection(db, "logs"), {
          text: logText,
          type: isThreat ? "alert" : "detection",
          severity: sev,
          operator: isThreat ? "SYS-AI" : "SYS-CAMERA",
          timestamp: Timestamp.now()
        });

        // Play alert sound if critical
        if (isThreat) {
          playNotify();
        }
      } catch (err) {
        console.error("Simulation trigger failed:", err);
      }
    }, 25000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(simulatorInterval);
    };
  }, []);

  // Compute live analytics dynamically when selections or filter filters change
  const computeAnalyticsData = () => {
    if (liveDetections.length === 0) return;

    let filterMs = 7 * 24 * 60 * 60 * 1000; // default 7 days
    if (reportFilters.dateRange === 'Last 30 Days' || reportFilters.dateRange === 'Last 1 Month') {
      filterMs = 30 * 24 * 60 * 60 * 1000;
    } else if (reportFilters.dateRange === 'Last 1 Year') {
      filterMs = 365 * 24 * 60 * 60 * 1000;
    } else if (reportFilters.dateRange === 'Last 24 Hours') {
      filterMs = 24 * 60 * 60 * 1000;
    }

    const cutoff = Date.now() - filterMs;
    const filtered = liveDetections.filter((d: any) => {
      const time = d.timestamp?.toDate ? d.timestamp.toDate().getTime() : new Date(d.timestamp).getTime();
      if (time < cutoff) return false;

      // Filter by location
      if (reportFilters.location !== 'All' && !d.location.toLowerCase().includes(reportFilters.location.toLowerCase())) {
        return false;
      }
      // Filter by activity type
      if (reportFilters.activityType !== 'All') {
        const isHuman = d.species.toLowerCase().includes('human') || d.species.toLowerCase().includes('truck');
        if (reportFilters.activityType === 'Human Intrusion' && !isHuman) return false;
        if (reportFilters.activityType === 'Animal Detection' && isHuman) return false;
      }
      // Filter by severity
      if (reportFilters.severity !== 'All' && d.severity !== reportFilters.severity.toLowerCase()) {
        return false;
      }

      return true;
    });

    // Run aggregations
    let poachingVal = 0;
    const regionalObj: any = {};
    const speciesObj: any = {};
    const trendMap: any = {};

    filtered.forEach((d: any) => {
      // Detections categorization
      if (d.severity === 'critical') poachingVal++;

      // Regions
      const reg = d.region || "Unassigned";
      regionalObj[reg] = (regionalObj[reg] || 0) + 1;

      // Species
      const sp = d.species || "Other";
      speciesObj[sp] = (speciesObj[sp] || 0) + 1;

      // Trend mapping by date
      const dateKey = d.timestamp?.toDate
        ? d.timestamp.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' })
        : new Date(d.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

      if (!trendMap[dateKey]) trendMap[dateKey] = { date: dateKey, animals: 0, threats: 0 };
      if (d.severity === 'critical') {
        trendMap[dateKey].threats++;
      } else {
        trendMap[dateKey].animals++;
      }
    });

    // Format trends
    const trends = Object.values(trendMap).reverse().slice(0, 10);

    // AI generated summary creator
    const speciesList = Object.keys(speciesObj).map(name => `${speciesObj[name]} instances of ${name}`).join(", ");
    const summaryText = filtered.length > 0
      ? `SAVIOUR INTELLIGENCE ANALYSIS: Over the past timeframe, our AI monitoring grid observed a total of ${filtered.length} wildlife surveillance events across monitored forest sectors. Poaching threat incidents logged stand at ${poachingVal} critical warnings. Regional metrics identify ${Object.keys(regionalObj)[0] || "N/A"} as the highest density intelligence sector with ${Object.values(regionalObj)[0] || 0} active logs. Scanned species consist of: ${speciesList || 'No dynamic animal classes recorded'}. AI models continue continuous pattern classification with an active grid confidence average of 97.2%.`
      : "GRID REPORT SYNC: No historical detection metadata matches the selected active filters. All surveillance assets are fully synchronized and waiting for target triggers.";

    setAnalyticsStats({
      totalDetections: filtered.length,
      poachingIncidents: poachingVal,
      threatPercentage: filtered.length > 0 ? Math.round((poachingVal / filtered.length) * 100) : 0,
      regionalStats: regionalObj,
      speciesStats: speciesObj,
      trendData: trends.length > 0 ? trends : [
        { date: 'Mon', animals: 10, threats: 0 },
        { date: 'Tue', animals: 15, threats: 1 },
        { date: 'Wed', animals: 8, threats: 0 }
      ],
      aiSummary: summaryText
    });
  };

  useEffect(() => {
    computeAnalyticsData();
  }, [liveDetections, reportFilters]);

  // Execute PDF generation client-side with absolute premium cyber formatting
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setShowFilterModal(false);
    showToast("Analyzing Grid", "Reading real-time Firebase records and generating intelligence PDF...", "info");

    // Allow DOM render
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) throw new Error("Report element not found");

        const canvas = await html2canvas(element, {
          backgroundColor: "#081C15",
          scale: 2,
          useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`THE_SAVIOUR_INTELLIGENCE_REPORT_${new Date().toISOString().split('T')[0]}.pdf`);
        showToast("Intelligence Exported", "Automated PDF successfully compiled and downloaded.", "success");
      } catch (err) {
        console.error("PDF export failed:", err);
        showToast("Generation Error", "Failed to compile cyber PDF report.", "danger");
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const showToast = (title: string, desc: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info') => {
    setToastMsg({ title, desc, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Add a task to Firestore live tasks collection
  const handleAddTask = async () => {
    if (!newTask) return;
    playClick();
    const tempId = "task-" + Date.now();
    const newTaskObj = {
      id: tempId,
      text: newTask,
      status: "Pending",
      assignedTo: role === "main_officer" ? "FIELD-OP" : "SEC-02",
      timestamp: new Date()
    };
    
    // Instant local state update for 100% responsive action!
    setTasks(prev => [newTaskObj, ...prev]);
    setNewTask('');
    
    try {
      if (db) {
        await addDoc(collection(db, "tasks"), {
          text: newTaskObj.text,
          status: newTaskObj.status,
          assignedTo: newTaskObj.assignedTo,
          timestamp: Timestamp.now()
        });
      }
      showToast("Task Broadcasted", "New operations order sent to surveillance mesh.", "success");
    } catch (err) {
      console.warn("Firebase task write warning:", err);
      showToast("Task Simulated", "New local operations order created.", "info");
    }
  };

  // Toggle/complete tasks in Firestore
  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    playClick();
    const nextStatus = currentStatus === "Pending" ? "In Progress" : "Completed";
    
    // Instant local state update for 100% responsive action!
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
    
    try {
      if (taskId && db) {
        const taskRef = doc(db, "tasks", taskId);
        await setDoc(taskRef, { status: nextStatus }, { merge: true });
      }
      showToast("Task Updated", `Operation status changed to ${nextStatus}`, "success");
    } catch (err) {
      console.warn("Firebase task write warning:", err);
      showToast("Task Simulated", `Operation status changed locally to ${nextStatus}`, "info");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6 animate-fade-in relative text-foreground">

      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-4 md:top-20 left-4 right-4 md:left-auto md:right-8 z-[500] backdrop-blur-md bg-[#0B2E13]/90 border p-4 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.15)] animate-fade-in flex gap-3 md:min-w-[300px] ${toastMsg.type === 'danger' ? 'border-red-500/60' :
            toastMsg.type === 'warning' ? 'border-yellow-500/60' :
              toastMsg.type === 'success' ? 'border-[#39FF14]/60' : 'border-blue-500/60'
          }`}>
          <div className={`mt-1 h-2.5 w-2.5 rounded-full animate-pulse ${toastMsg.type === 'danger' ? 'bg-red-500' :
              toastMsg.type === 'warning' ? 'bg-yellow-400' :
                toastMsg.type === 'success' ? 'bg-[#39FF14]' : 'bg-blue-400'
            }`} />
          <div>
            <h4 className="font-bold text-sm font-mono text-slate-100">{toastMsg.title}</h4>
            <p className="text-xs font-mono text-slate-300 mt-1">{toastMsg.desc}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1B4332]/40 pb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-100 tracking-wider font-mono">
            <Activity className="h-8 w-8 text-[#39FF14] animate-pulse" />
            THE SAVIOUR COMMAND CENTER
          </h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <p className="text-slate-400 text-sm font-mono">Real-time cybernetic surveillance and military AI grid monitoring.</p>
            <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-ping hidden md:inline" />
            <p className="text-[11px] font-semibold font-mono text-[#39FF14] bg-[#0B2E13] px-3 py-1 rounded-full border border-[#39FF14]/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(57,255,20,0.1)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#39FF14]"></span>
              </span>
              ACTIVE MONITORING RESETS IN: {timeLeftStr}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <Link href="/cctv" onClick={playClick} className="bg-[#0B2E13] border border-[#1B4332] text-white px-4 py-2.5 rounded-lg text-xs font-bold font-mono hover:bg-[#1B4332] active:scale-95 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
            <Eye className="h-4 w-4" /> VIEW MATRIX FEED
          </Link>
          <button
            onClick={() => { playClick(); setShowFilterModal(true); }}
            disabled={isGenerating}
            className="bg-[#0B2E13] border border-[#1B4332] text-white px-5 py-2.5 rounded-lg text-xs font-bold font-mono hover:bg-[#1B4332] active:scale-95 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
          >
            {isGenerating ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> GENERATING INTELLIGENCE...</>
            ) : (
              <><Download className="h-4 w-4" /> EXPORT PDF INTEL</>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* Stats Grid - Premium Cyber-Security Military Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Active Cameras */}
          <div className="bg-[#0B2E13]/80 border border-[#1B4332]/60 hover:border-[#39FF14]/70 p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] hover:-translate-y-1">
            <div>
              <p className="text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider">Active Camera Network</p>
              <h3 className="text-3xl font-bold font-mono text-slate-100">09/12</h3>
              <p className="text-xs text-red-400 font-mono mt-2 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> 3 units offline for maintenance
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#123524] border border-[#1B4332] group-hover:border-[#39FF14]/50 transition-all duration-300">
              <Camera className="h-6 w-6 text-[#39FF14]" />
            </div>
          </div>

          {/* Detections (24h) - Realtime Firebase Counter */}
          <div className="bg-[#0B2E13]/80 border border-[#1B4332]/60 hover:border-[#39FF14]/70 p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] hover:-translate-y-1">
            <div>
              <p className="text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]"></span>
                </span>
                Detections (24h)
              </p>
              <h3 className="text-3xl font-bold font-mono text-slate-100 animate-[pulse_2s_infinite]">{detectionsCount24h}</h3>
              <p className={`text-xs font-mono mt-2 ${percentageDiff >= 0 ? 'text-[#39FF14]' : 'text-red-400'}`}>
                {percentageDiff >= 0 ? `+${percentageDiff}%` : `${percentageDiff}%`} from yesterday
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#123524] border border-[#1B4332] group-hover:border-[#39FF14]/50 transition-all duration-300">
              <Activity className="h-6 w-6 text-[#39FF14]" />
            </div>
          </div>

          {/* Critical Alerts - Real-time Criticals Counter */}
          <div className="bg-[#0B2E13]/80 border border-red-900/60 hover:border-red-500/70 p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:-translate-y-1">
            <div>
              <p className="text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider">Critical Alerts</p>
              <h3 className="text-3xl font-bold font-mono text-red-500">{criticalAlertsCount}</h3>
              <p className="text-xs text-slate-400 font-mono mt-2">
                Last updated: {lastUpdated}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-red-950/30 border border-red-900 group-hover:border-red-500/50 transition-all duration-300 animate-pulse">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>

          {/* Active Personnel */}
          <div className="bg-[#0B2E13]/80 border border-[#1B4332]/60 hover:border-[#39FF14]/70 p-5 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] hover:-translate-y-1">
            <div>
              <p className="text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider">Active Rangers</p>
              <h3 className="text-3xl font-bold font-mono text-slate-100">18</h3>
              <p className="text-xs text-[#39FF14] font-mono mt-2">
                Deployed across 4 active zones
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#123524] border border-[#1B4332] group-hover:border-[#39FF14]/50 transition-all duration-300">
              <Users className="h-6 w-6 text-[#39FF14]" />
            </div>
          </div>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

          {/* Activity Overview - Firestore Trend Chart */}
          <div className="lg:col-span-2 bg-[#0B2E13]/80 border border-[#1B4332]/60 rounded-2xl p-5 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-lg font-mono text-slate-100 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#39FF14] animate-pulse" />
                  REAL-TIME DETECTIONS OVERVIEW
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Continuous Firebase aggregations over active timeframes.</p>
              </div>
              <div className="text-xs font-mono bg-[#123524] border border-[#1B4332] text-[#39FF14] px-3 py-1.5 rounded-md uppercase">
                {reportFilters.dateRange}
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsStats.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAnimals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39FF14" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#123524" vertical={false} />
                  <XAxis dataKey="date" stroke="#86efac" fontSize={11} tickLine={false} axisLine={false} style={{ fontFamily: 'monospace' }} />
                  <YAxis stroke="#86efac" fontSize={11} tickLine={false} axisLine={false} style={{ fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B2E13', border: '1px solid #1B4332', borderRadius: '8px', color: '#f8fafc', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#39FF14' }}
                  />
                  <Area type="monotone" name="Wildlife spotted" dataKey="animals" stroke="#ffffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorAnimals)" />
                  <Area type="monotone" name="Threats detected" dataKey="threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cyber Authority Override Panel / Operations Log */}
          <div className="lg:col-span-1 bg-[#0B2E13]/80 border border-red-950/60 rounded-2xl p-5 flex flex-col relative overflow-hidden group bg-gradient-to-br from-[#0B2E13] to-red-950/5">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/80 animate-pulse" />
            <div className="flex justify-between items-center mb-4 z-10">
              <h3 className="font-semibold text-lg font-mono text-red-500 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 animate-bounce" />
                TACTICAL OVERRIDE
              </h3>
              <div className="text-[10px] bg-red-950/40 text-red-400 px-2 py-1 rounded font-mono uppercase border border-red-900/50 tracking-wider font-bold">
                AUTH LEVEL-5
              </div>
            </div>

            <div className="space-y-3 flex-1 mb-4">
              <button
                onClick={() => { playClick(); showToast("Drone Deployed", "UAV-Strike Drone initialized and en route to target sector.", "danger"); }}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-red-900/40 bg-[#081C15] hover:bg-red-950/20 hover:border-red-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all group font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <Crosshair className="w-4 h-4 text-red-500" />
                  <span className="text-slate-200">DEPLOY STRIKE DRONE</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
              </button>

              <button
                onClick={() => { playClick(); showToast("Lockdown Initiated", "Sector lockdown protocols activated. All checkpoints secured.", "warning"); }}
                className="w-full flex items-center justify-between p-3 rounded-lg border-yellow-900/40 bg-[#081C15] hover:bg-yellow-950/20 hover:border-yellow-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all group font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <TriangleAlert className="w-4 h-4 text-yellow-500" />
                  <span className="text-slate-200">SECTOR LOCKDOWN</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
              </button>
            </div>

            {/* Task Assignment System linked directly to Firestore */}
            <div className="border-t border-[#1B4332]/50 pt-4 mt-2">
              <h4 className="text-xs font-bold font-mono text-[#39FF14] mb-2 uppercase tracking-wider">Deploy Ranger Order</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="e.g. Inspect Zone B Fence..."
                  className="flex-1 bg-[#081C15] border border-[#1B4332] text-slate-200 rounded text-xs px-3 py-2 focus:outline-none focus:border-[#39FF14] font-mono"
                />
                <button
                  onClick={handleAddTask}
                  className="bg-[#39FF14] text-[#081C15] hover:bg-[#39FF14]/90 px-4 py-2 rounded text-xs font-bold font-mono transition-all active:scale-95"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row: Drone feed and Dynamic Firebase upload panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

          {/* Drone feed */}
          <div className="lg:col-span-1 bg-[#0B2E13]/80 border border-[#1B4332]/60 p-5 flex flex-col relative overflow-hidden group shadow-lg rounded-2xl">
            <div className="flex justify-between items-center mb-4 z-10">
              <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2 font-mono"><Compass className="h-5 w-5 text-[#39FF14] animate-spin-slow" /> UAV CAMERA PATROL</h3>
              <div className="flex gap-2">
                <span className="bg-[#123524] text-[#39FF14] text-[9px] px-2 py-0.5 rounded font-mono border border-[#39FF14]/30 shadow-sm">AUTO-RADAR</span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                </span>
              </div>
            </div>

            <div className="relative flex-1 bg-black min-h-[300px] rounded-xl overflow-hidden border border-white/10 cursor-crosshair group shadow-inner">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[20000ms] scale-105 group-hover:scale-110"
              >
                <source src="/videos/Drone.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 mix-blend-multiply" />
              <div className="absolute inset-0 bg-[#39FF14]/5 pointer-events-none" />

              {/* Laser line scanning overlay */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#39FF14]/80 shadow-[0_0_15px_#39FF14] animate-[scan_3s_ease-in-out_infinite] z-20" />

              {/* Target lock box */}
              <div className="absolute top-[35%] left-[45%] w-[80px] h-[60px] border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] rounded-sm z-20 transition-all duration-300 group-hover:scale-110">
                <span className="absolute -top-5 left-0 bg-red-500 text-white text-[9px] font-mono px-1 py-0.5 whitespace-nowrap">CLASSIFIED: POACHER 98%</span>
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-red-500" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-red-500" />
              </div>

              {/* Telemetric overlay */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start text-[9px] text-white/90 font-mono z-20">
                <div className="space-y-1">
                  <p className="flex items-center gap-1"><Battery className="h-3 w-3" /> BAT: 74%</p>
                  <p className="flex items-center gap-1"><Wifi className="h-3 w-3 text-[#39FF14]" /> SIG: SECURE</p>
                </div>
                <div className="text-right space-y-1">
                  <p>ALT: 450m</p>
                  <p>SPD: 32km/h</p>
                </div>
              </div>

              {/* Footer telemetries */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs text-white/90 font-mono z-20">
                <div>
                  <p className="flex items-center gap-1 text-[#39FF14] font-bold text-[10px]"><Navigation className="h-3 w-3" /> UAV-INTEL-01</p>
                  <p className="text-red-400 mt-1 font-bold text-[9px] uppercase tracking-widest">LOCK ON TARGET</p>
                </div>
                <p className="text-[9px]">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Evidence Upload (Simulation with Firebase updates) */}
          <div className="lg:col-span-2">
            <DataUpload />
          </div>

        </div>

        {/* Live Command Center Monitoring Feed - Realtime Firebase Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

          <div className="lg:col-span-2 bg-[#0B2E13]/80 border border-[#1B4332]/60 p-6 rounded-2xl flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#1B4332]/40">
              <div>
                <h3 className="font-semibold text-lg font-mono text-slate-100 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]"></span>
                  </span>
                  CYBER SURVEILLANCE MONITORING FEED
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Real-time camera triggers and threat alerts streaming from Firebase.</p>
              </div>
              <span className="text-[10px] font-mono bg-[#123524] text-[#39FF14] border border-[#39FF14]/30 px-2 py-1 rounded">
                LIVE INTEL
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 space-y-3 font-mono text-xs">
              {liveLogs.map((log: any, i) => {
                const date = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const isCritical = log.severity === 'critical';
                const isMedium = log.severity === 'medium';

                return (
                  <div
                    key={log.id || i}
                    className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.01] ${isCritical
                        ? 'bg-red-950/20 border-red-900/60 hover:border-red-500/80 text-red-200'
                        : isMedium
                          ? 'bg-yellow-950/20 border-yellow-900/60 hover:border-yellow-500/80 text-yellow-200'
                          : 'bg-[#081C15] border-[#1B4332]/60 hover:border-[#39FF14]/50 text-slate-200'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${isCritical
                          ? 'bg-red-900/30 border-red-500/40 text-red-400'
                          : isMedium
                            ? 'bg-yellow-900/30 border-yellow-500/40 text-yellow-400'
                            : 'bg-[#123524] border-[#39FF14]/30 text-[#39FF14]'
                        }`}>
                        {log.type || "detection"}
                      </span>
                      <span className="text-slate-400 text-[10px]">{timeStr} | OPERATOR: {log.operator || "SYS"}</span>
                    </div>
                    <p className="text-slate-100 mt-1.5 leading-relaxed">{log.text}</p>
                  </div>
                );
              })}
              {liveLogs.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-400 italic py-20 text-center">
                  Waiting for active intelligence stream from Firebase...
                </div>
              )}
            </div>
          </div>

          {/* Active Field Operations orders */}
          <div className="lg:col-span-1 bg-[#0B2E13]/80 border border-[#1B4332]/60 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg font-mono text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-[#1B4332]/40">
                <Users className="h-5 w-5 text-[#39FF14]" />
                MESH DEPLOYMENTS
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
                {tasks.map((task: any, i) => (
                  <div key={task.id || i} className="p-3 border border-[#1B4332] bg-[#081C15] rounded-xl font-mono text-xs">
                    <p className="text-slate-200 mb-2 font-semibold">{task.text}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded font-bold border ${task.status === 'Completed'
                          ? 'bg-emerald-950/30 border-[#39FF14]/40 text-[#39FF14]'
                          : task.status === 'In Progress'
                            ? 'bg-yellow-950/30 border-yellow-500/40 text-yellow-400'
                            : 'bg-[#123524]/40 border-[#1B4332] text-slate-400'
                        }`}>
                        {task.status}
                      </span>
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleToggleTaskStatus(task.id, task.status)}
                          className="bg-[#39FF14] text-[#081C15] px-2 py-1 rounded text-[10px] font-bold font-mono hover:scale-105 active:scale-95 transition-all shadow-sm"
                        >
                          {task.status === 'Pending' ? 'START' : 'RESOLVE'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-xs text-slate-400 text-center py-10 font-mono">No active missions running.</p>}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#1B4332]/40 text-center">
              <span className="text-[10px] font-mono text-slate-400">RANGER INTERFACE SYNCED</span>
            </div>
          </div>

        </div>

        {/* Dynamic Satellite Maps & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

          <div className="lg:col-span-1 bg-[#0B2E13]/80 border border-[#1B4332]/60 p-6 rounded-2xl flex flex-col justify-between">
            {selectedForest ? (
              <div className="animate-fade-in flex-1">
                <h3 className="font-semibold font-mono text-xl mb-1 flex items-center gap-2 text-[#39FF14]">
                  <MapPin className="h-6 w-6" />
                  {selectedForest.name}
                </h3>
                <p className="text-slate-400 text-xs font-mono mb-6">{selectedForest.state} • Coordinates: {selectedForest.lat}, {selectedForest.lng}</p>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-[#081C15] border border-[#1B4332] rounded-xl">
                    <p className="text-slate-400 uppercase font-bold tracking-wider mb-1">Grid Status</p>
                    <p className={`font-bold text-sm ${selectedForest.risk === 'Critical' ? 'text-red-500 animate-pulse' : selectedForest.risk === 'High' ? 'text-yellow-400' : 'text-[#39FF14]'}`}>
                      {selectedForest.risk} Intrusion Danger
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#081C15] border border-[#1B4332] rounded-xl">
                      <p className="text-slate-400 mb-1">CCTV Arrays</p>
                      <p className="font-semibold text-slate-200 text-sm">{selectedForest.cameras} Cameras</p>
                    </div>
                    <div className="p-3 bg-[#081C15] border border-[#1B4332] rounded-xl">
                      <p className="text-slate-400 mb-1">Mesh Range</p>
                      <p className="font-semibold text-slate-200">{selectedForest.surveillanceLevel}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#081C15] border border-[#1B4332] rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-slate-400">Intrusion Danger</p>
                      <p className="text-xs font-bold text-red-500">{selectedForest.humanProb}</p>
                    </div>
                    <div className="w-full bg-[#123524] rounded-full h-1.5 border border-[#1B4332]/40">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: selectedForest.humanProb }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#081C15] border border-[#1B4332] rounded-xl">
                    <p className="text-slate-400 mb-1">Wildlife Census</p>
                    <p className="font-semibold text-slate-200">{selectedForest.wildlifeDensity}</p>
                  </div>
                </div>

                <button onClick={() => setSelectedForest(null)} className="mt-6 text-xs font-bold font-mono text-[#39FF14] hover:underline block">
                  CLEAR TARGET SELECTION
                </button>
              </div>
            ) : (
              <div className="animate-fade-in flex-1">
                <h3 className="font-semibold text-xl mb-2 font-mono text-slate-100 flex items-center gap-2">
                  <MapIcon className="h-6 w-6 text-[#39FF14]" />
                  SURVEILLANCE RADAR MAP
                </h3>
                <p className="text-slate-400 text-xs font-mono mb-6">Select a wildlife reserve or camera outpost to display live telemetry coordinates and telemetry feeds.</p>

                <div className="h-48 border border-dashed border-[#1B4332] rounded-xl flex items-center justify-center text-slate-400 bg-[#081C15]/50 font-mono text-xs">
                  <p>Click target marker on radar map to inspect.</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-[#1B4332]/40">
              <p className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-3">RADAR VIEW MODE</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setMapMode('standard')}
                  className={`border border-[#1B4332] px-3 py-1.5 rounded text-xs font-bold font-mono transition-all flex items-center gap-1 ${mapMode === 'standard' ? 'bg-[#39FF14] text-[#081C15]' : 'bg-[#081C15] text-[#39FF14] hover:bg-[#1B4332]'}`}
                >
                  <MapIcon className="h-3 w-3" /> STANDARD
                </button>
                <button
                  onClick={() => setMapMode('thermal')}
                  className={`border border-[#1B4332] px-3 py-1.5 rounded text-xs font-bold font-mono transition-all flex items-center gap-1 ${mapMode === 'thermal' ? 'bg-red-500 text-white border-red-400' : 'bg-[#081C15] text-[#39FF14] hover:bg-[#1B4332]'}`}
                >
                  <Activity className="h-3 w-3" /> THERMAL RADAR
                </button>
                <button
                  onClick={() => setMapMode('night')}
                  className={`border border-[#39FF14]/40 px-3 py-1.5 rounded text-xs font-bold font-mono transition-all flex items-center gap-1 ${mapMode === 'night' ? 'bg-[#1b4332] text-[#39FF14] border-[#39FF14]' : 'bg-[#081C15] text-[#39FF14] hover:bg-[#1B4332]'}`}
                >
                  <Eye className="h-3 w-3" /> NIGHT VISION
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Radar Leaflet Map */}
          <div className="lg:col-span-2 bg-[#0B2E13]/80 border border-[#1B4332]/60 p-2 h-[500px] lg:h-[600px] overflow-hidden flex flex-col relative transition-all duration-500 rounded-2xl">
            <div className="flex-1 rounded-xl overflow-hidden border border-[#1B4332]/50 relative">
              <span className={`absolute top-4 right-4 z-[400] text-xs font-mono backdrop-blur px-3 py-1.5 rounded-md border flex items-center gap-2 shadow-sm ${mapMode === 'thermal' ? 'bg-red-950/60 text-red-400 border-red-500/50' : mapMode === 'night' ? 'bg-[#1b4332]/90 text-[#39FF14] border-[#39FF14]' : 'bg-[#0B2E13]/90 text-[#39FF14] border-[#1B4332]'
                }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mapMode === 'thermal' ? 'bg-red-500' : mapMode === 'night' ? 'bg-[#39FF14]' : 'bg-[#39FF14]'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${mapMode === 'thermal' ? 'bg-red-500' : mapMode === 'night' ? 'bg-[#39FF14]' : 'bg-[#39FF14]'}`}></span>
                </span>
                {mapMode === 'thermal' ? 'LIVE THERMAL SYNC' : mapMode === 'night' ? 'NIGHT VISION PATROL' : 'LIVE GRID TELEMETRY'}
              </span>
              <div className="w-full h-full relative z-10 isolate">
                <TrackingMap mode={mapMode} onSelectLocation={setSelectedForest} />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Filter / Config Intelligence Report Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md animate-[fade-in_0.2s_ease-out_forwards]">
          <div className="bg-[#0B2E13] border border-[#39FF14]/50 rounded-2xl shadow-2xl p-6 max-w-md w-full relative font-mono text-xs">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#39FF14] shadow-[0_0_10px_#39FF14]" />
            <h2 className="text-lg font-bold mb-1 text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#39FF14]" /> CONFIGURE REPORT
            </h2>
            <p className="text-slate-400 mb-6 uppercase tracking-wider text-[9px]">Select specific telemetry filters for AI analysis & export.</p>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">DATE RANGE</label>
                <select className="w-full bg-[#081C15] border border-[#1B4332] text-slate-200 rounded p-2 focus:outline-none focus:border-[#39FF14]" value={reportFilters.dateRange} onChange={e => setReportFilters({ ...reportFilters, dateRange: e.target.value })}>
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 1 Year</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">LOCATION RESERVE</label>
                <select className="w-full bg-[#081C15] border border-[#1B4332] text-slate-200 rounded p-2 focus:outline-none focus:border-[#39FF14]" value={reportFilters.location} onChange={e => setReportFilters({ ...reportFilters, location: e.target.value })}>
                  <option>All</option>
                  <option>Sector Alpha</option>
                  <option>Sector Bravo</option>
                  <option>North Gate</option>
                  <option>River Basin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">ACTIVITY TYPE</label>
                  <select className="w-full bg-[#081C15] border border-[#1B4332] text-slate-200 rounded p-2 focus:outline-none focus:border-[#39FF14]" value={reportFilters.activityType} onChange={e => setReportFilters({ ...reportFilters, activityType: e.target.value })}>
                    <option>All</option>
                    <option>Human Intrusion</option>
                    <option>Animal Detection</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">SEVERITY LEVEL</label>
                  <select className="w-full bg-[#081C15] border border-[#1B4332] text-slate-200 rounded p-2 focus:outline-none focus:border-[#39FF14]" value={reportFilters.severity} onChange={e => setReportFilters({ ...reportFilters, severity: e.target.value })}>
                    <option>All</option>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowFilterModal(false)} className="px-4 py-2 text-slate-400 hover:bg-[#123524] rounded-lg font-bold">CANCEL</button>
              <button onClick={handleGenerateReport} className="px-5 py-2 bg-[#39FF14] text-[#081C15] font-bold rounded-lg shadow-[0_0_15px_rgba(57,255,20,0.3)]">RUN AI ANALYSIS & DOWNLOAD</button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden layout compiled on-the-fly for PDF Capture (Extremely high-fidelity and matches requested style) */}
      <div className="absolute left-[-9999px] top-0 pointer-events-none">
        <div
          ref={reportRef}
          className="w-[800px] bg-[#081C15] p-10 font-mono text-slate-200 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#39FF14] pb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#39FF14] tracking-widest uppercase">THE SAVIOUR</h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase">AI-Based Wild Animal Protection & Anti-Poaching Surveillance Mesh</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] bg-[#0B2E13] border border-[#39FF14]/40 text-[#39FF14] px-3 py-1 rounded font-bold uppercase">CLASSIFIED INTEL</span>
              <p className="text-[8px] text-slate-400 mt-1">GENERATED: {new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0B2E13] border border-[#1B4332] p-4 rounded-xl">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Surveillance Period</p>
              <p className="font-bold text-sm text-[#39FF14] mt-1 uppercase">{reportFilters.dateRange}</p>
            </div>
            <div className="bg-[#0B2E13] border border-[#1B4332] p-4 rounded-xl">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Monitored Reserve</p>
              <p className="font-bold text-sm text-slate-100 mt-1 uppercase">{reportFilters.location === 'All' ? 'All National Parks' : reportFilters.location}</p>
            </div>
            <div className="bg-[#0B2E13] border border-[#1B4332] p-4 rounded-xl">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Accuracy Confidence</p>
              <p className="font-bold text-sm text-[#39FF14] mt-1">98.4% AI CORE</p>
            </div>
          </div>

          {/* AI generated Summary Text */}
          <div className="bg-[#0B2E13] border border-[#1B4332] p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#39FF14]" />
            <h3 className="font-bold text-[#39FF14] text-xs uppercase mb-2">Automated AI Threat Analysis Summary</h3>
            <p className="text-[10px] leading-relaxed text-slate-300">{analyticsStats.aiSummary}</p>
          </div>

          {/* Aggregated Counters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0B2E13] border border-[#1B4332] p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Total Grid Detections</p>
                <h4 className="text-xl font-bold text-slate-100 mt-1">{analyticsStats.totalDetections}</h4>
              </div>
              <div className="h-9 w-9 bg-[#123524] rounded-lg flex items-center justify-center border border-[#39FF14]/30">
                <Activity className="h-5 w-5 text-[#39FF14]" />
              </div>
            </div>
            <div className="bg-[#0B2E13] border border-red-900 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Critical Threats stopped</p>
                <h4 className="text-xl font-bold text-red-500 mt-1">{analyticsStats.poachingIncidents}</h4>
              </div>
              <div className="h-9 w-9 bg-red-950/20 rounded-lg flex items-center justify-center border border-red-900">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </div>

          {/* Regional Statistics */}
          <div className="bg-[#0B2E13] border border-[#1B4332] p-5 rounded-2xl">
            <h3 className="font-bold text-[#39FF14] text-xs uppercase mb-4">Surveillance Outposts Aggregation</h3>
            <div className="space-y-3">
              {Object.keys(analyticsStats.regionalStats).map((regName) => {
                const count = analyticsStats.regionalStats[regName];
                const percentage = analyticsStats.totalDetections > 0 ? Math.round((count / analyticsStats.totalDetections) * 100) : 0;
                return (
                  <div key={regName}>
                    <div className="flex justify-between items-center text-[10px] mb-1">
                      <span className="font-medium text-slate-300">{regName}</span>
                      <span className="text-[#39FF14] font-bold">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#123524] rounded-full border border-[#1B4332]">
                      <div className="h-2 rounded-full bg-[#39FF14]" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Incidents Table */}
          <div className="bg-[#0B2E13] border border-[#1B4332] p-5 rounded-2xl">
            <h3 className="font-bold text-[#39FF14] text-xs uppercase mb-3">Live Log Summary Matrix</h3>
            <table className="w-full text-left text-[9px]">
              <thead>
                <tr className="text-slate-400 border-b border-[#1B4332] uppercase">
                  <th className="py-2">Spotted Class</th>
                  <th className="py-2">Sector Location</th>
                  <th className="py-2">Severity</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {liveDetections.slice(0, 5).map((d: any, i) => (
                  <tr key={i} className="border-b border-[#1B4332]/40 last:border-0 text-slate-200">
                    <td className="py-2 font-bold">{d.species}</td>
                    <td className="py-2">{d.location}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold ${d.severity === 'critical' ? 'bg-red-950/40 text-red-500 border border-red-500/20' : 'bg-[#123524] text-[#39FF14] border border-[#39FF14]/20'
                        }`}>
                        {d.severity}
                      </span>
                    </td>
                    <td className="py-2">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-[#1B4332] pt-6 flex justify-between items-center text-[8px] text-slate-400">
            <p>THE SAVIOUR COMMAND SYSTEM SECURED MESH PROTOCOL v1.0.2</p>
            <p>COPYRIGHT © {new Date().getFullYear()} ALL OUTPOSTS SHIELDED</p>
          </div>
        </div>
      </div>

    </div>
  );
}

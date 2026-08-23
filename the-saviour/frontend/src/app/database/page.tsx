"use client";

import { Database, Server, HardDrive, Cpu, Search, Plus, Filter, MoreVertical, DatabaseBackup, CheckCircle, Eye, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Collection = {
  name: string;
  count: number | string;
  size: string;
  type: string;
  status: 'monitoring' | 'completed' | 'under_surveillance';
}

const INITIAL_DB_COLLECTIONS: Collection[] = [
  { name: "Users", count: 42, size: "1.2 MB", type: "Firestore", status: "completed" },
  { name: "Camera_Feeds", count: 128, size: "15.4 GB", type: "Firestore", status: "under_surveillance" },
  { name: "Detection_Logs", count: "1.4M", size: "850 GB", type: "Firestore", status: "monitoring" },
  { name: "Alerts_History", count: 8432, size: "45 MB", type: "Firestore", status: "monitoring" },
  { name: "Animal_Records", count: 540, size: "8.5 MB", type: "Firestore", status: "completed" },
  { name: "Forest_Zones", count: 12, size: "120 KB", type: "Firestore", status: "under_surveillance" },
];

export default function DatabasePage() {
  const [collections, setCollections] = useState<Collection[]>(INITIAL_DB_COLLECTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  
  // Record History State
  const [logs, setLogs] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  const router = useRouter();

  // Load real evidence logs from backend AND local manual records
  useEffect(() => {
    const fetchLogs = async () => {
      let firebaseLogs: any[] = [];
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("@/config/firebase");
        const querySnapshot = await getDocs(collection(db, "detections"));
        
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("DEBUG: Evidence data fetched:", data);
        firebaseLogs = data.map((d: any) => ({
          id: d.id,
          timestamp: d.timestamp ? (typeof d.timestamp === 'number' ? new Date(d.timestamp * (d.timestamp < 1000000000000 ? 1000 : 1)).toISOString() : d.timestamp) : new Date().toISOString(), 
          activityType: d.activity_type || d.activityType || "Animal Detection",
          location: d.location || "Sector 4 - Alpha Feed",
          coordinates: d.coordinates || (d.bbox ? `${d.bbox[0]}, ${d.bbox[1]}` : "N/A"),
          source: d.source || `AI Model (Conf: ${Math.round((d.confidence || 0.9) * 100)}%)`
        }));
      } catch (err) {
        console.error("Failed to fetch evidence from Firestore:", err);
      }

      // Fetch manual records from localStorage
      let manualLogs: any[] = [];
      try {
        manualLogs = JSON.parse(localStorage.getItem('saviour_activity_logs') || '[]');
      } catch (err) {
        console.error("Failed to fetch local manual records:", err);
      }

      // Combine both lists
      setLogs([...manualLogs, ...firebaseLogs]);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); 
    
    const handleManualUpdate = () => fetchLogs();
    window.addEventListener('recordsUpdated', handleManualUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('recordsUpdated', handleManualUpdate);
    };
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filterType !== "All" && log.activityType !== filterType) return false;
    if (filterLocation && !log.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    return true;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleStatusChange = (index: number, newStatus: Collection['status']) => {
    const newCollections = [...collections];
    newCollections[index].status = newStatus;
    setCollections(newCollections);
    setOpenDropdown(null);
    showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
  };

  const filteredCollections = collections.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6 relative">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-panel border border-border shadow-lg px-4 py-3 rounded-md flex items-center gap-3 z-50 animate-fade-in text-sm font-medium">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            System Database
          </h1>
          <p className="text-secondary text-sm mt-1">Manage schemas, collections, and backend infrastructure.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/backup')} className="bg-panel border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/10 transition-colors flex items-center gap-2 shadow-sm">
            <DatabaseBackup className="h-4 w-4" /> Backup Now
          </button>
          <button onClick={() => router.push('/add-record')} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        
        {/* System Status */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass rounded-xl border border-border p-5">
            <h3 className="font-semibold text-lg mb-4 text-primary">Cluster Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary flex items-center gap-1"><HardDrive className="h-4 w-4" /> Storage</span>
                  <span className="font-mono text-primary">865 GB / 2 TB</span>
                </div>
                <div className="w-full bg-secondary/20 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full w-[43%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary flex items-center gap-1"><Cpu className="h-4 w-4" /> CPU Load</span>
                  <span className="font-mono text-accent">24%</span>
                </div>
                <div className="w-full bg-secondary/20 rounded-full h-1.5">
                  <div className="bg-accent h-1.5 rounded-full w-[24%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary flex items-center gap-1"><Server className="h-4 w-4" /> Memory</span>
                  <span className="font-mono text-warning">12 GB / 32 GB</span>
                </div>
                <div className="w-full bg-secondary/20 rounded-full h-1.5">
                  <div className="bg-warning h-1.5 rounded-full w-[37%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collections Table */}
        <div className="lg:col-span-3 glass rounded-xl border border-border flex flex-col overflow-visible relative min-h-[400px]">
          <div className="p-4 border-b border-border flex justify-between items-center bg-panel rounded-t-xl">
            <h3 className="font-semibold">Database Collections</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collections..." 
                className="bg-background border border-border rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm relative">
              <thead className="bg-background text-secondary uppercase text-xs border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Collection Name</th>
                  <th className="px-6 py-4 font-medium">Documents</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCollections.map((col, i) => (
                  <tr key={i} className="hover:bg-background/50 transition-colors group bg-panel">
                    <td className="px-6 py-4 font-mono font-medium text-foreground flex items-center gap-2">
                      <Database className="h-4 w-4 text-secondary group-hover:text-primary transition-colors" />
                      {col.name}
                    </td>
                    <td className="px-6 py-4 font-mono">{col.count}</td>
                    <td className="px-6 py-4">
                      {col.status === 'completed' && <span className="bg-success/10 text-success border border-success/20 px-2 py-1 rounded text-xs inline-flex items-center gap-1"><CheckCircle className="h-3 w-3"/> Completed</span>}
                      {col.status === 'under_surveillance' && <span className="bg-warning/10 text-warning border border-warning/20 px-2 py-1 rounded text-xs inline-flex items-center gap-1"><Eye className="h-3 w-3"/> Surveillance</span>}
                      {col.status === 'monitoring' && <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded text-xs inline-flex items-center gap-1"><Activity className="h-3 w-3"/> Monitoring</span>}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                        className="btn-icon text-secondary hover:text-foreground p-1 rounded-md hover:bg-secondary/10"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openDropdown === i && (
                        <div className="absolute right-8 top-10 bg-panel border border-border shadow-lg rounded-md w-48 z-50 py-1 text-left animate-fade-in">
                          <button onClick={() => handleStatusChange(i, 'completed')} className="dropdown-item w-full px-4 py-2 text-sm hover:bg-secondary/10 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success" /> Mark Completed
                          </button>
                          <button onClick={() => handleStatusChange(i, 'under_surveillance')} className="dropdown-item w-full px-4 py-2 text-sm hover:bg-secondary/10 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-warning" /> Under Surveillance
                          </button>
                          <button onClick={() => handleStatusChange(i, 'monitoring')} className="dropdown-item w-full px-4 py-2 text-sm hover:bg-secondary/10 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> Active Monitoring
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredCollections.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-secondary">No collections found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>

        {/* Record History / Activity Log Section */}
        <div className="lg:col-span-4 glass rounded-xl border border-border flex flex-col overflow-visible mt-6">
          <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center bg-panel rounded-t-xl gap-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Record History / Activity Log
            </h3>
            <div className="flex flex-wrap gap-3">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Activities</option>
                <option value="Animal Detection">Animal Detection</option>
                <option value="Human Intrusion">Human Intrusion</option>
                <option value="Vehicle Movement">Vehicle Movement</option>
                <option value="Camera Maintenance">Camera Maintenance</option>
              </select>
              <input 
                type="text" 
                placeholder="Filter by Location" 
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-40"
              />
              <button 
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm hover:bg-secondary/10 transition-colors"
              >
                Sort: {sortOrder === 'desc' ? 'Latest First' : 'Oldest First'}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-sm relative">
              <thead className="bg-background text-secondary uppercase text-xs border-b border-border sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Activity Type</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Coordinates</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedLogs.map((log, i) => (
                  <tr key={log.id} className="hover:bg-background/50 transition-colors bg-panel animate-[fade-in_0.3s_ease-out_forwards]" style={{ animationDelay: `${i * 50}ms` }}>
                    <td className="px-6 py-4 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">
                      <span className={`px-2 py-1 rounded text-xs inline-flex items-center gap-1 ${
                        log.activityType.includes('Human') ? 'bg-danger/10 text-danger border border-danger/20' : 
                        log.activityType.includes('Vehicle') ? 'bg-warning/10 text-warning border border-warning/20' : 
                        log.activityType.includes('Maintenance') ? 'bg-primary/10 text-primary border border-primary/20' :
                        'bg-success/10 text-success border border-success/20'
                      }`}>
                        {log.activityType}
                      </span>
                    </td>
                    <td className="px-6 py-4">{log.location}</td>
                    <td className="px-6 py-4 font-mono text-xs text-secondary">{log.coordinates}</td>
                    <td className="px-6 py-4 text-xs">{log.source}</td>
                  </tr>
                ))}
                {sortedLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-secondary">No activity records found. Add a record to see it here.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

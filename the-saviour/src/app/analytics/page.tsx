"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Map, Target, ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSystem } from "@/components/saviour/SystemProvider";

const filterDatasets = {
  '7d': {
    barData: [
      { name: 'Mon', elephants: 40, tigers: 12, humans: 24 },
      { name: 'Tue', elephants: 30, tigers: 13, humans: 22 },
      { name: 'Wed', elephants: 20, tigers: 9, humans: 29 },
      { name: 'Thu', elephants: 27, tigers: 19, humans: 20 },
      { name: 'Fri', elephants: 18, tigers: 28, humans: 21 },
      { name: 'Sat', elephants: 23, tigers: 18, humans: 25 },
      { name: 'Sun', elephants: 34, tigers: 23, humans: 21 },
    ],
    speciesData: [
      { name: 'Elephant', value: 192 },
      { name: 'Tiger', value: 122 },
      { name: 'Leopard', value: 85 },
      { name: 'Rhino', value: 42 },
    ],
    stats: {
      accuracy: '98.4%',
      accTrend: '↑ 0.2% from last week',
      accTrendUp: true,
      riskZone: 'Zone 3, Sector North',
      riskProb: '84%',
      prevented: '12 Incidents',
      prevTrend: '↑ 2 from last week',
      prevTrendUp: true
    }
  },
  '30d': {
    barData: [
      { name: 'Week 1', elephants: 140, tigers: 62, humans: 84 },
      { name: 'Week 2', elephants: 160, tigers: 53, humans: 92 },
      { name: 'Week 3', elephants: 120, tigers: 49, humans: 109 },
      { name: 'Week 4', elephants: 157, tigers: 79, humans: 80 },
    ],
    speciesData: [
      { name: 'Elephant', value: 577 },
      { name: 'Tiger', value: 243 },
      { name: 'Leopard', value: 210 },
      { name: 'Rhino', value: 125 },
    ],
    stats: {
      accuracy: '97.8%',
      accTrend: '↓ 0.5% from last month',
      accTrendUp: false,
      riskZone: 'River Basin, East',
      riskProb: '72%',
      prevented: '45 Incidents',
      prevTrend: '↑ 14% from last month',
      prevTrendUp: true
    }
  },
  '1y': {
    barData: [
      { name: 'Q1', elephants: 1400, tigers: 620, humans: 840 },
      { name: 'Q2', elephants: 1600, tigers: 530, humans: 920 },
      { name: 'Q3', elephants: 1200, tigers: 490, humans: 1090 },
      { name: 'Q4', elephants: 1570, tigers: 790, humans: 800 },
    ],
    speciesData: [
      { name: 'Elephant', value: 5770 },
      { name: 'Tiger', value: 2430 },
      { name: 'Leopard', value: 2100 },
      { name: 'Rhino', value: 1250 },
    ],
    stats: {
      accuracy: '96.5%',
      accTrend: '↑ 3.2% from last year',
      accTrendUp: true,
      riskZone: 'Sector Alpha Grid',
      riskProb: '65%',
      prevented: '512 Incidents',
      prevTrend: '↑ 24% from last year',
      prevTrendUp: true
    }
  }
};

const COLORS = ['#0B6623', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '1y'>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const { playClick } = useSystem();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFilterChange = (filter: '7d' | '30d' | '1y') => {
    if (filter === timeFilter) return;
    playClick();
    setIsLoading(true);
    setTimeFilter(filter);
    
    // Simulate network delay for real-time feel
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const currentData = filterDatasets[timeFilter];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-8 w-8 text-accent" />
            Analytics & Intelligence
          </h1>
          <p className="text-secondary text-sm mt-1">Deep learning insights, wildlife trends, and threat probability reports.</p>
        </div>
        <div className="flex bg-background border border-border rounded-lg p-1 shadow-sm">
          <button 
            onClick={() => handleFilterChange('7d')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeFilter === '7d' ? 'bg-[#0B6623] text-white shadow-md' : 'text-secondary hover:text-foreground hover:bg-secondary/10'}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => handleFilterChange('30d')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeFilter === '30d' ? 'bg-[#0B6623] text-white shadow-md' : 'text-secondary hover:text-foreground hover:bg-secondary/10'}`}
          >
            30 Days
          </button>
          <button 
            onClick={() => handleFilterChange('1y')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeFilter === '1y' ? 'bg-[#0B6623] text-white shadow-md' : 'text-secondary hover:text-foreground hover:bg-secondary/10'}`}
          >
            1 Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 glass rounded-xl border border-border p-5 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center animate-fade-in">
              <Loader2 className="h-8 w-8 text-[#0B6623] animate-spin mb-2" />
              <p className="text-sm font-bold text-[#0B6623]">Updating Data...</p>
            </div>
          )}
          <h3 className="font-semibold text-lg mb-6">Detection Frequency Trends</h3>
          <div className="h-[350px] w-full transition-opacity duration-300" style={{ opacity: isLoading ? 0.3 : 1 }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData.barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    cursor={{fill: 'var(--secondary)', opacity: 0.1}}
                  />
                  <Bar dataKey="elephants" stackId="a" fill="#0B6623" radius={[0, 0, 4, 4]} animationDuration={1000} />
                  <Bar dataKey="tigers" stackId="a" fill="var(--warning)" animationDuration={1000} />
                  <Bar dataKey="humans" stackId="a" fill="var(--danger)" radius={[4, 4, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass rounded-xl border border-border p-5 flex flex-col relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center animate-fade-in">
              <Loader2 className="h-8 w-8 text-[#0B6623] animate-spin mb-2" />
            </div>
          )}
          <h3 className="font-semibold text-lg mb-2">Species Distribution</h3>
          <p className="text-xs text-secondary mb-4">Classified wildlife across all zones</p>
          <div className="flex-1 min-h-[250px] w-full transition-opacity duration-300" style={{ opacity: isLoading ? 0.3 : 1 }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.speciesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1000}
                  >
                    {currentData.speciesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {currentData.speciesData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-secondary">{item.name}</span>
                <span className="font-bold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass rounded-xl border border-border p-6 flex items-start gap-4 hover:border-[#0B6623]/50 transition-colors relative overflow-hidden group">
          <div className="bg-[#0B6623]/10 p-3 rounded-lg group-hover:bg-[#0B6623]/20 transition-colors">
            <Target className="h-6 w-6 text-[#0B6623]" />
          </div>
          <div className="flex-1 transition-opacity duration-300" style={{ opacity: isLoading ? 0.3 : 1 }}>
            <h4 className="font-bold text-lg">AI Accuracy</h4>
            <p className="text-2xl font-mono mt-1 mb-1">{currentData.stats.accuracy}</p>
            <p className={`text-xs font-bold mb-2 ${currentData.stats.accTrendUp ? 'text-[#0B6623]' : 'text-danger'}`}>{currentData.stats.accTrend}</p>
            <p className="text-sm text-secondary">Average confidence score across YOLOv8 inference nodes.</p>
          </div>
        </div>

        <div className="glass rounded-xl border border-border p-6 flex items-start gap-4 hover:border-danger/50 transition-colors relative overflow-hidden group">
          <div className="bg-danger/10 p-3 rounded-lg group-hover:bg-danger/20 transition-colors">
            <Map className="h-6 w-6 text-danger" />
          </div>
          <div className="flex-1 transition-opacity duration-300" style={{ opacity: isLoading ? 0.3 : 1 }}>
            <h4 className="font-bold text-lg">High-Risk Zones</h4>
            <p className="text-lg font-mono mt-1 mb-1 text-danger">{currentData.stats.riskZone}</p>
            <p className="text-xs font-bold mb-2 text-danger">Intrusion Risk: {currentData.stats.riskProb}</p>
            <p className="text-sm text-secondary">Predicted intrusion probability based on historical data.</p>
          </div>
        </div>

        <div className="glass rounded-xl border border-border p-6 flex items-start gap-4 hover:border-[#0B6623]/50 transition-colors relative overflow-hidden group">
          <div className="bg-[#0B6623]/10 p-3 rounded-lg group-hover:bg-[#0B6623]/20 transition-colors">
            <ShieldCheck className="h-6 w-6 text-[#0B6623]" />
          </div>
          <div className="flex-1 transition-opacity duration-300" style={{ opacity: isLoading ? 0.3 : 1 }}>
            <h4 className="font-bold text-lg">Poaching Prevented</h4>
            <p className="text-2xl font-mono mt-1 mb-1">{currentData.stats.prevented}</p>
            <p className={`text-xs font-bold mb-2 ${currentData.stats.prevTrendUp ? 'text-[#0B6623]' : 'text-danger'}`}>{currentData.stats.prevTrend}</p>
            <p className="text-sm text-secondary">Estimated wildlife saved through early warning system.</p>
          </div>
        </div>

      </div>

    </div>
  );
}

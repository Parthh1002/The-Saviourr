"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0B6623', '#ef4444', '#f59e0b'];

function ReportViewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/report-data?id=${id}`)
        .then(res => res.json())
        .then(data => setData(data))
        .catch(console.error);
    }
  }, [id]);

  if (!data) return <div className="p-10 font-mono text-xs">Loading report data for PDF engine...</div>;

  return (
    <div className="bg-white text-black p-8 w-[800px] mx-auto" style={{ fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div className="border-b-2 border-emerald-700 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">THE SAVIOUR</h1>
          <p className="text-slate-600 font-medium">Wildlife Monitoring & Activity Analysis Report</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>Generated: {new Date(data.timestamp).toLocaleString()}</p>
          <p>ID: {data.id.split('-')[0]}</p>
        </div>
      </div>

      {/* Filters Summary */}
      <div className="flex gap-4 mb-6 text-xs text-slate-700 bg-slate-50 p-3 border border-slate-200 rounded">
        <div><strong>Time Range:</strong> {data.filters.dateRange}</div>
        <div><strong>Location:</strong> {data.filters.location}</div>
        <div><strong>Activity:</strong> {data.filters.activityType}</div>
        <div><strong>Severity:</strong> {data.filters.severity}</div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatBox label="Total Detections" value={data.summary.totalDetections} />
        <StatBox label="Human Activity" value={data.summary.humanDetections} color="text-red-600" />
        <StatBox label="Animal Tracking" value={data.summary.animalDetections} color="text-emerald-700" />
        <StatBox label="Alerts Triggered" value={data.summary.alertsTriggered} color="text-amber-600" />
      </div>

      {/* AI Insights */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">AI Intelligence Engine Insights</h2>
        <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700">
          {data.aiInsights.map((insight: string, i: number) => (
            <li key={i}>{insight}</li>
          ))}
        </ul>
      </div>

      {/* Hotspots */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">Location Analysis & Hotspots</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-2">Zone Name</th>
              <th className="border border-slate-300 p-2">Coordinates</th>
              <th className="border border-slate-300 p-2 text-center">Incidents</th>
              <th className="border border-slate-300 p-2">Risk Status</th>
            </tr>
          </thead>
          <tbody>
            {data.hotspots.map((h: any, i: number) => (
              <tr key={i}>
                <td className="border border-slate-300 p-2 font-medium">{h.name}</td>
                <td className="border border-slate-300 p-2 font-mono text-xs">{h.coordinates}</td>
                <td className="border border-slate-300 p-2 text-center">{h.incidents}</td>
                <td className={`border border-slate-300 p-2 font-semibold ${h.risk === 'Critical' ? 'text-red-600' : 'text-emerald-700'}`}>{h.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts Page Break avoidance is handled automatically by puppeteer if configured, but we keep it simple */}
      <div className="grid grid-cols-2 gap-4 mt-8 break-inside-avoid">
        
        <div className="border border-slate-200 p-4 rounded bg-white">
          <h3 className="text-sm font-bold text-center mb-2 text-slate-700">Activity Timeline</h3>
          <LineChart width={340} height={200} data={data.timeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" fontSize={10} />
            <YAxis fontSize={10} />
            <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </div>

        <div className="border border-slate-200 p-4 rounded bg-white">
          <h3 className="text-sm font-bold text-center mb-2 text-slate-700">Detection Distribution</h3>
          <PieChart width={340} height={200}>
            <Pie data={data.pieData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value" label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} isAnimationActive={false}>
              {data.pieData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

        <div className="col-span-2 border border-slate-200 p-4 rounded bg-white break-inside-avoid">
          <h3 className="text-sm font-bold text-center mb-2 text-slate-700">Area-wise Cross Analysis</h3>
          <BarChart width={730} height={250} data={data.activityData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Legend wrapperStyle={{ fontSize: '12px' }}/>
            <Bar dataKey="Animal" fill="#0B6623" isAnimationActive={false} />
            <Bar dataKey="Human" fill="#ef4444" isAnimationActive={false} />
            <Bar dataKey="Vehicle" fill="#f59e0b" isAnimationActive={false} />
          </BarChart>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
        CONFIDENTIAL - Authorised Personnel Only. Generated by The Saviour Node Analysis Engine.
      </div>

    </div>
  );
}

export default function ReportViewPage() {
  return (
    <Suspense fallback={<div className="p-10 font-mono text-xs">Loading report data for PDF engine...</div>}>
      <ReportViewContent />
    </Suspense>
  );
}

function StatBox({ label, value, color = "text-slate-900" }: { label: string, value: number, color?: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">{label}</div>
    </div>
  );
}

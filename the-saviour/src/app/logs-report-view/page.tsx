"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0B6623', '#1E8449', '#f59e0b', '#475569'];

function LogsReportViewContent() {
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

  if (!data) return <div className="p-10 font-mono text-xs">Loading audit logs for PDF engine...</div>;

  return (
    <div className="bg-white text-black p-8 w-[800px] mx-auto" style={{ fontFamily: 'sans-serif' }}>
      <div className="border-b-2 border-emerald-800 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">THE SAVIOUR</h1>
          <p className="text-slate-600 font-medium">System Activity & Officer Audit Log</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>Generated: {new Date(data.timestamp).toLocaleString()}</p>
          <p>Audit ID: {data.id.split('-')[0].toUpperCase()}</p>
        </div>
      </div>
      {/* ... Rest of the component code ... */}
      <div className="mt-8 pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500 font-mono">
        STRICTLY CONFIDENTIAL. DO NOT DISTRIBUTE. SAVIOUR AUTOMATED AUDIT SYSTEM.
      </div>
    </div>
  );
}

export default function LogsReportView() {
  return (
    <Suspense fallback={<div className="p-10 font-mono text-xs">Loading audit logs for PDF engine...</div>}>
      <LogsReportViewContent />
    </Suspense>
  );
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-slate-100 border border-slate-300 p-3 rounded text-center">
      <div className="text-xl font-bold text-emerald-900">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-slate-600 font-bold mt-1">{label}</div>
    </div>
  );
}

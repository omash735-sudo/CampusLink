// app/admin/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReports, resolveReport } from '@/lib/services/admin.service';

interface Report {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data as Report[]);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    if (!confirm('Resolve this report?')) return;
    try {
      await resolveReport(id);
      await loadReports();
    } catch (error) {
      console.error('Failed to resolve:', error);
    }
  };

  const filtered = reports.filter((r) => filter === 'All' || r.status === filter);

  const statusColors: Record<string, string> = {
    'pending': 'bg-red-100 text-red-700',
    'resolved': 'bg-green-100 text-green-700',
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 p-4">
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-gray-500">{reports.filter(r => r.status === 'pending').length} active reports</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'pending', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 text-sm border transition-colors ${
              filter === status
                ? 'bg-primary-green text-white border-primary-green'
                : 'border-gray-200 hover:border-primary-green'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((report) => (
          <div key={report.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{report.targetType}: {report.targetId}</h3>
                  <span className={`text-xs px-2 py-0.5 ${statusColors[report.status] || 'bg-gray-100 text-gray-600'}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Reason: {report.reason}</p>
                <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                {report.status === 'pending' && (
                  <button onClick={() => handleResolve(report.id)} className="text-sm text-green-600 hover:text-green-700">
                    Resolve
                  </button>
                )}
                <Link href={`/admin/reports/${report.id}`} className="text-primary-green hover:underline text-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No reports found.</p>
        </div>
      )}
    </div>
  );
}

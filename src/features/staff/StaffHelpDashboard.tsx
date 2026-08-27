import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { BellRing, CheckCircle, Clock, UserCheck, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

interface StaffRequest {
  id: string;
  kioskId: string;
  patientName?: string;
  tokenNumber?: string;
  language: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export const StaffHelpDashboard: React.FC = () => {
  const [requests, setRequests] = useState<StaffRequest[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRequests = async () => {
    setIsRefreshing(true);
    try {
      const res = await apiService.getAssistanceRequests();
      if (res && res.requests) {
        setRequests(res.requests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Poll every 10s for new kiosk help calls
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const res = await apiService.resolveAssistanceRequest(id, 'OPD Staff Attendant');
      if (res && res.requests) {
        setRequests(res.requests);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-sky-50 py-8 px-4 md:px-8 text-left" id="staff-dashboard-root">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center shadow-xs border-2 border-amber-300">
              <BellRing className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-sky-950">
                Hospital OPD Staff Assistance & Kiosk Help Desk
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Live alerts from ground-floor kiosks for elderly, low-literacy, or unwell patients
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-2xl text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 block">PENDING CALLS</span>
              <span className="text-2xl font-black text-amber-900">{pendingCount}</span>
            </div>

            <button
              onClick={fetchRequests}
              className="py-3 px-5 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 text-sky-950 font-black text-xs rounded-2xl flex items-center gap-2 cursor-pointer shadow-xs transition-all active:scale-98"
            >
              <RefreshCw className={`w-4 h-4 text-sky-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl">
          <h3 className="font-black text-base text-sky-950 mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            <span>Active Assistance Requests ({requests.length})</span>
          </h3>

          {requests.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-medium border-2 border-dashed border-sky-200 rounded-3xl">
              No staff assistance requests currently pending.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-4 transition-all ${
                    req.status === 'PENDING'
                      ? 'bg-amber-50/80 border-amber-300 ring-4 ring-amber-400/15 shadow-md'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-2xl shadow-xs ${
                        req.status === 'PENDING'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.status === 'PENDING' ? <BellRing className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="font-black text-base text-sky-950">{req.kioskId}</span>
                        {req.tokenNumber && (
                          <span className="text-xs bg-white border-2 border-sky-200 px-2.5 py-0.5 rounded-lg font-mono font-black text-sky-900">
                            {req.tokenNumber}
                          </span>
                        )}
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-950 uppercase">
                          Lang: {req.language}
                        </span>
                      </div>

                      <p className="text-sm text-slate-800 font-bold">{req.reason}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Patient: {req.patientName || 'Self'} • Called at:{' '}
                        {new Date(req.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    {req.status === 'PENDING' ? (
                      <button
                        onClick={() => handleResolve(req.id)}
                        className="py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer border-b-4 border-emerald-700 transition-all"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Mark Attended / Resolved</span>
                      </button>
                    ) : (
                      <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-300">
                        Resolved by {req.resolvedBy || 'Staff'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

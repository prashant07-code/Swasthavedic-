import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import {
  Users,
  Search,
  RefreshCw,
  Clock,
  Play,
  CheckCircle,
  AlertTriangle,
  Flame,
  Filter,
} from 'lucide-react';

export const QueueTable: React.FC = () => {
  const { queue, openPatientConsultation, refreshQueue } = useDoctor();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'HIGH' | 'NORMAL'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshQueue();
    setIsRefreshing(false);
  };

  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());

    if (severityFilter === 'HIGH') {
      return matchesSearch && (item.severity === 'HIGH' || item.severity === 'CRITICAL');
    }
    return matchesSearch;
  });

  return (
    <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8 text-left" id="doctor-queue-table-container">
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b-2 border-sky-100 pb-5">
        <div>
          <h3 className="font-black text-xl text-sky-950 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600" />
            <span>Today's Live OPD Patient Queue</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Room 04 General Medicine & AYUSH OPD • AIIMS / District Civil Hospital
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            id="queue-refresh-btn"
            onClick={handleRefresh}
            className="py-2.5 px-4 rounded-2xl border-2 border-sky-200 bg-sky-50 text-sky-950 hover:bg-sky-100 flex items-center gap-2 text-xs font-black cursor-pointer shadow-2xs transition-all"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Severity filter */}
          <div className="flex bg-sky-50 p-1.5 rounded-2xl border-2 border-sky-100 text-xs font-black">
            <button
              onClick={() => setSeverityFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                severityFilter === 'ALL' ? 'bg-white shadow-xs text-sky-950' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({queue.length})
            </button>
            <button
              onClick={() => setSeverityFilter('HIGH')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                severityFilter === 'HIGH' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Priority Red Flags
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-5 relative max-w-md">
        <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Patient Name, Token (#OPD-101) or Complaint..."
          className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-sky-50/50 border-2 border-sky-100 rounded-2xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
        />
      </div>

      {/* Queue Table */}
      {filteredQueue.length === 0 ? (
        <div className="py-16 text-center text-xs font-medium text-slate-400 border-2 border-dashed border-sky-200 rounded-3xl">
          No patients waiting in queue matching the selected filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-2 border-sky-100 rounded-2xl overflow-hidden">
            <thead className="bg-sky-50 text-sky-950 font-black border-b-2 border-sky-100">
              <tr>
                <th className="p-4">Token #</th>
                <th className="p-4">Triage Severity</th>
                <th className="p-4">Patient Details</th>
                <th className="p-4">Chief Complaints</th>
                <th className="p-4">Arrival</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 font-medium text-slate-800">
              {filteredQueue.map((item) => {
                const isHigh = item.severity === 'HIGH' || item.severity === 'CRITICAL';
                const isMedium = item.severity === 'MEDIUM';

                return (
                  <tr
                    key={item.visitId}
                    className={`hover:bg-sky-50/50 transition-colors ${
                      isHigh ? 'bg-rose-50/50' : ''
                    }`}
                  >
                    {/* Token */}
                    <td className="p-4 font-black text-sm text-sky-950 font-mono">
                      {item.tokenNumber}
                    </td>

                    {/* Triage Severity */}
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                          isHigh
                            ? 'bg-rose-600 text-white animate-pulse shadow-xs'
                            : isMedium
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        }`}
                      >
                        {isHigh ? <AlertTriangle className="w-3.5 h-3.5" /> : null}
                        {item.severity}
                      </span>
                    </td>

                    {/* Patient Details */}
                    <td className="p-4">
                      <div className="font-black text-slate-900 text-sm">{item.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">
                        {item.age} Yrs • {item.gender}
                      </div>
                    </td>

                    {/* Chief Complaints */}
                    <td className="p-4 max-w-xs">
                      <span className="font-bold text-slate-800 line-clamp-1">
                        {item.chiefComplaint}
                      </span>
                    </td>

                    {/* Arrival */}
                    <td className="p-4 text-slate-600 font-mono text-xs font-semibold">
                      {item.arrivalTime}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider ${
                          item.status === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : item.status === 'IN_CONSULTATION'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      {item.status === 'COMPLETED' ? (
                        <span className="text-xs text-slate-400 flex items-center justify-end gap-1.5 font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          Done
                        </span>
                      ) : (
                        <button
                          id={`start-consultation-btn-${item.tokenNumber.replace('#', '')}`}
                          onClick={() => openPatientConsultation(item.visitId)}
                          className={`py-2 px-4 rounded-xl font-black text-xs shadow-md flex items-center gap-2 ml-auto transition-all active:scale-95 cursor-pointer ${
                            isHigh
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'bg-sky-600 hover:bg-sky-700 text-white'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{item.status === 'IN_CONSULTATION' ? 'Resume' : 'Call Patient'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

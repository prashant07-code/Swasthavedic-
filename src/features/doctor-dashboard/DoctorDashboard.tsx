import React from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { QueueTable } from './QueueTable';
import { ConsultationView } from './ConsultationView';
import { User, Activity, Clock, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { currentDoctor, queue, activeVisitId } = useDoctor();

  const totalPatientsToday = queue.length;
  const completedCount = queue.filter((q) => q.status === 'COMPLETED').length;
  const highTriageCount = queue.filter((q) => q.severity === 'HIGH' || q.severity === 'CRITICAL').length;
  const waitingCount = totalPatientsToday - completedCount;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-sky-50 py-8 px-4 md:px-8" id="doctor-dashboard-root">
      {/* If active consultation is in progress, display full consultation workspace */}
      {activeVisitId ? (
        <ConsultationView />
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Doctor Profile Banner */}
          <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8 text-left flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border-2 border-sky-400/30">
                DR
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-sky-950">{currentDoctor.name}</h2>
                  <span className="text-xs bg-sky-100 text-sky-900 border border-sky-200 font-black px-3 py-1 rounded-full font-mono">
                    {currentDoctor.doctorId}
                  </span>
                </div>
                <p className="text-sm text-sky-800 font-bold mt-0.5">{currentDoctor.specialization}</p>
                <p className="text-xs text-slate-500 font-semibold">{currentDoctor.department}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="p-3.5 bg-sky-50 border-2 border-sky-100 rounded-2xl text-center min-w-[90px]">
                <span className="text-[10px] uppercase font-black tracking-wider text-sky-800 block">TODAY'S TOTAL</span>
                <span className="text-2xl font-black text-sky-950">{totalPatientsToday}</span>
              </div>
              <div className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-center min-w-[90px]">
                <span className="text-[10px] uppercase font-black tracking-wider text-rose-800 block">HIGH TRIAGE</span>
                <span className="text-2xl font-black text-rose-600">{highTriageCount}</span>
              </div>
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center min-w-[90px]">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">COMPLETED</span>
                <span className="text-2xl font-black text-emerald-600">{completedCount}</span>
              </div>
            </div>
          </div>

          {/* OPD Live Queue Table */}
          <QueueTable />
        </div>
      )}
    </div>
  );
};

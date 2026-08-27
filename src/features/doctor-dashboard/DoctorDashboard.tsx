import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { QueueTable } from './QueueTable';
import { ConsultationView } from './ConsultationView';
import { DoctorLoginView } from './DoctorLoginView';
import { AUTHORIZED_DOCTORS, AuthorizedDoctor } from '../../data/doctors';
import {
  LogOut,
  UserCheck,
  Building2,
  Stethoscope,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { currentDoctor, isAuthenticated, logoutDoctor, switchDoctor, queue, activeVisitId } = useDoctor();
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  // If not logged in, show Doctor Authentication / Login Screen
  if (!isAuthenticated || !currentDoctor) {
    return <DoctorLoginView />;
  }

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
          {/* Doctor Profile Header Banner */}
          <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8 text-left flex flex-wrap items-center justify-between gap-6 relative">
            {/* Left: Doctor Credentials & Chamber */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border-2 border-sky-400/30 shrink-0">
                {currentDoctor.avatarInitials || 'DR'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl sm:text-3xl font-black text-sky-950">{currentDoctor.name}</h2>
                  <span className="text-xs bg-sky-100 text-sky-900 border-2 border-sky-200 font-mono font-black px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentDoctor.doctorId}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Authorized OPD
                  </span>
                </div>
                <p className="text-sm text-sky-800 font-bold mt-1">{currentDoctor.specialization}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold mt-0.5">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>{currentDoctor.department}</span>
                  </span>
                  <span>•</span>
                  <span>{currentDoctor.hospitalName || 'District Civil Hospital'}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Metrics & Action Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Quick Metrics */}
              <div className="flex items-center gap-2.5">
                <div className="p-3 bg-sky-50 border-2 border-sky-100 rounded-2xl text-center min-w-[85px]">
                  <span className="text-[10px] uppercase font-black tracking-wider text-sky-800 block">TODAY'S QUEUE</span>
                  <span className="text-2xl font-black text-sky-950">{totalPatientsToday}</span>
                </div>
                <div className="p-3 bg-rose-50 border-2 border-rose-200 rounded-2xl text-center min-w-[85px]">
                  <span className="text-[10px] uppercase font-black tracking-wider text-rose-800 block">HIGH TRIAGE</span>
                  <span className="text-2xl font-black text-rose-600">{highTriageCount}</span>
                </div>
                <div className="p-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center min-w-[85px]">
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">COMPLETED</span>
                  <span className="text-2xl font-black text-emerald-600">{completedCount}</span>
                </div>
              </div>

              {/* Action Buttons: Switch Doctor & Logout */}
              <div className="flex items-center gap-2 relative">
                {/* Switch Doctor Dropdown Button */}
                <div className="relative">
                  <button
                    id="switch-doctor-dropdown-btn"
                    onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                    className="py-3 px-4 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 text-sky-950 font-black text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                    title="Switch Doctor Chamber"
                  >
                    <UserCheck className="w-4 h-4 text-sky-600" />
                    <span className="hidden sm:inline">Switch Chamber</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDoctorDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showDoctorDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border-2 border-sky-100 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="p-2 border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Select Authorized Chamber
                      </div>
                      <div className="space-y-1 mt-1">
                        {AUTHORIZED_DOCTORS.map((doc) => {
                          const isCurrent = doc.id === currentDoctor.id;
                          return (
                            <button
                              key={doc.id}
                              onClick={() => {
                                switchDoctor(doc);
                                setShowDoctorDropdown(false);
                              }}
                              className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                                isCurrent
                                  ? 'bg-sky-50 text-sky-950 font-black border border-sky-200'
                                  : 'text-slate-700 hover:bg-slate-50 font-bold'
                              }`}
                            >
                              <div>
                                <div className="font-black">{doc.name}</div>
                                <div className="text-[10px] text-slate-500">{doc.department}</div>
                              </div>
                              <span className="text-[10px] font-mono font-black text-sky-700 bg-white px-1.5 py-0.5 rounded border border-sky-100">
                                {doc.doctorId}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  id="doctor-logout-btn"
                  onClick={logoutDoctor}
                  className="py-3 px-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 text-rose-900 font-black text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                  title="Logout from Doctor OPD Portal"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Logout (लॉगआउट)</span>
                </button>
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

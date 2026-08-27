import React from 'react';
import { Patient } from '../../types';
import { User, Phone, MapPin, CreditCard, Calendar, Activity } from 'lucide-react';

interface PatientOverviewCardProps {
  patient: Patient;
  tokenNumber: string;
}

export const PatientOverviewCard: React.FC<PatientOverviewCardProps> = ({ patient, tokenNumber }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-4" id="doctor-patient-overview-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-xl text-slate-900">{patient.name}</h3>
              <span className="text-xs bg-slate-100 border border-slate-300 font-mono px-2 py-0.5 rounded-md font-bold text-slate-700">
                {patient.patientCode}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
              <span className="font-semibold text-slate-800">
                {patient.age} Yrs • {patient.gender}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {patient.mobile || 'No mobile'}
              </span>
              {patient.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {patient.address}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Token Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
              CURRENT TOKEN
            </span>
            <span className="text-2xl font-black">{tokenNumber}</span>
          </div>
          {patient.abhaId && (
            <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl text-xs">
              <span className="text-[10px] uppercase font-bold text-orange-800 block">ABHA ID</span>
              <span className="font-mono font-bold text-slate-800">{patient.abhaId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

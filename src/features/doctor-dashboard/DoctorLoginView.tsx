import React, { useState } from 'react';
import {
  Stethoscope,
  Lock,
  ShieldCheck,
  User,
  KeyRound,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Check,
  FileText,
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { AUTHORIZED_DOCTORS, AuthorizedDoctor } from '../../data/doctors';

export const DoctorLoginView: React.FC = () => {
  const { loginDoctor } = useDoctor();

  const [doctorIdOrEmail, setDoctorIdOrEmail] = useState('DOC-AIIMS-409');
  const [passwordOrPin, setPasswordOrPin] = useState('4090');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('Room 04 (General Medicine)');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!doctorIdOrEmail.trim()) {
      setErrorMessage('Please enter your Doctor ID or registered Hospital Email.');
      return;
    }
    if (!passwordOrPin.trim()) {
      setErrorMessage('Please enter your Password or 4-digit Security PIN.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = loginDoctor(doctorIdOrEmail, passwordOrPin);
      if (!result.success) {
        setErrorMessage(result.message || 'Login failed. Please check your credentials.');
      }
      setIsLoading(false);
    }, 350);
  };

  const handleQuickSelectDoctor = (doc: AuthorizedDoctor) => {
    setDoctorIdOrEmail(doc.doctorId);
    setPasswordOrPin(doc.pin);
    setSelectedDepartment(doc.roomNumber);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8" id="doctor-login-view">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Hospital & OPD Portal Branding Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-900 via-sky-800 to-sky-950 text-white p-8 sm:p-10 rounded-[32px] shadow-2xl border-4 border-sky-800/60 flex flex-col justify-between relative overflow-hidden text-left">
          {/* Subtle Decorative Backdrop Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* National / Hospital Seal */}
            <div className="inline-flex items-center gap-2 bg-sky-800/80 border border-sky-700/80 px-3.5 py-1.5 rounded-full text-xs font-black text-sky-200 uppercase tracking-wider mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authorized Clinical Access Only</span>
            </div>

            <div className="w-16 h-16 bg-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner backdrop-blur-xs">
              <Stethoscope className="w-9 h-9 text-emerald-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              Doctor OPD Portal
            </h1>
            <h2 className="text-sm font-bold text-sky-200 mb-4">
              चिकित्सक कक्ष • AIIMS & AYUSH Integrative Platform
            </h2>

            <p className="text-xs text-sky-100/90 leading-relaxed mb-6 font-medium">
              Secure clinical workstation for outpatient consultation, live triage queue management, EHR timeline review, and ABHA-linked e-Prescription generation.
            </p>

            <div className="space-y-3 pt-4 border-t border-sky-700/60">
              <div className="flex items-center gap-3 text-xs text-sky-100 font-semibold">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Live OPD Queue with Color-Coded Triage</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-sky-100 font-semibold">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>AI Clinical Synthesis & AYUSH Prakriti Assessment</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-sky-100 font-semibold">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>ABDM-Compliant Digital Rx & Lab Orders</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-sky-700/60 flex items-center justify-between text-[11px] text-sky-300 font-medium">
            <span>ABDM Ready • EHR v2.4</span>
            <span className="font-mono bg-sky-800/80 px-2 py-0.5 rounded text-sky-200">ISO 27001 Sec</span>
          </div>
        </div>

        {/* Right Side: Doctor Authentication Form */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-[32px] border-4 border-sky-100 shadow-2xl flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-sky-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-sky-950 flex items-center gap-2">
                  <span>Doctor Login</span>
                  <span className="text-xs bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full font-bold">
                    लॉगिन
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Enter registered Doctor ID / Hospital credentials to unlock OPD consultation
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-50 rounded-2xl border-2 border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-5 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start gap-3 text-rose-950 text-xs font-bold animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black block">Authentication Error:</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4" id="doctor-login-form">
              {/* Doctor ID / Email */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-1.5">
                  Doctor ID / Hospital Email (डॉक्टर आईडी / ईमेल)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="doctor-id-input"
                    type="text"
                    value={doctorIdOrEmail}
                    onChange={(e) => setDoctorIdOrEmail(e.target.value)}
                    placeholder="e.g. DOC-AIIMS-409 or dr.sharma@hospital.gov.in"
                    className="w-full pl-10 pr-4 py-3 bg-sky-50/60 border-2 border-sky-100 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-hidden transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password or PIN */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-sky-950">
                    Security Password / PIN (पासवर्ड / पिन)
                  </label>
                  <span className="text-[10px] font-bold text-sky-700">
                    Demo PIN: 4090 / 1080 / 2150
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="doctor-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordOrPin}
                    onChange={(e) => setPasswordOrPin(e.target.value)}
                    placeholder="Enter security PIN or password"
                    className="w-full pl-10 pr-11 py-3 bg-sky-50/60 border-2 border-sky-100 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-hidden transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Department / OPD Room Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-1.5">
                  Assigned OPD Room & Chamber (कक्ष)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <select
                    id="doctor-room-select"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-sky-50/60 border-2 border-sky-100 rounded-2xl text-xs font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-hidden cursor-pointer"
                  >
                    <option value="Room 04 (General Medicine)">Room 04 — General Medicine & AYUSH OPD (Ground Floor)</option>
                    <option value="Room 07 (AYUSH Wing)">Room 07 — AYUSH Kayachikitsa & Panchakarma</option>
                    <option value="Room 12 (Surgical Block)">Room 12 — Orthopaedics & Marma Clinic</option>
                    <option value="Room 02 (Pediatrics)">Room 02 — Kaumarbhritya & Pediatrics</option>
                  </select>
                </div>
              </div>

              {/* Remember Session Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded-md border-sky-300 focus:ring-sky-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Remember session on this kiosk/PC</span>
                </label>
                <span className="text-xs text-sky-700 font-bold hover:underline cursor-pointer">
                  Forgot PIN?
                </span>
              </div>

              {/* Submit Button */}
              <button
                id="doctor-login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer border-b-4 border-sky-800 disabled:opacity-75 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Clinical Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock OPD Workspace (डॉक्टर पोर्टल खोलें)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Doctor Profiles for 1-Click Login */}
            <div className="mt-6 pt-5 border-t-2 border-sky-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Authorized Doctors (Quick Autofill & Test)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold">1-Click Select</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {AUTHORIZED_DOCTORS.map((doc) => {
                  const isSelected = doctorIdOrEmail === doc.doctorId;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleQuickSelectDoctor(doc)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-sky-50/50 hover:border-sky-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-black text-sky-800 bg-white px-1.5 py-0.5 rounded border border-sky-200">
                          {doc.doctorId}
                        </span>
                        {isSelected && <BadgeCheck className="w-4 h-4 text-sky-600 shrink-0" />}
                      </div>
                      <div className="font-black text-xs text-slate-900 truncate">{doc.name.split(',')[0]}</div>
                      <div className="text-[10px] text-slate-500 truncate">{doc.department.split('Room')[0] || doc.department}</div>
                      <div className="text-[10px] font-mono text-emerald-700 font-bold mt-1">PIN: {doc.pin}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

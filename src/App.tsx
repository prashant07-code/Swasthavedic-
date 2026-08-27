import React, { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { KioskProvider } from './context/KioskContext';
import { DoctorProvider } from './context/DoctorContext';
import { Navbar, AppView } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { KioskLayout } from './features/kiosk/KioskLayout';
import { DoctorDashboard } from './features/doctor-dashboard/DoctorDashboard';
import { StaffHelpDashboard } from './features/staff/StaffHelpDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('KIOSK');

  return (
    <AccessibilityProvider>
      <KioskProvider>
        <DoctorProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
            {/* Top Navigation */}
            <Navbar currentView={currentView} setCurrentView={setCurrentView} />

            {/* Dynamic Active Workspace View */}
            <div className="flex-1 flex flex-col bg-sky-50">
              {currentView === 'KIOSK' && <KioskLayout />}
              {currentView === 'DOCTOR' && <DoctorDashboard />}
              {currentView === 'STAFF' && <StaffHelpDashboard />}
            </div>

            {/* Global Safety & Clinical Boundary Disclaimer */}
            <DisclaimerBanner />
          </div>
        </DoctorProvider>
      </KioskProvider>
    </AccessibilityProvider>
  );
}

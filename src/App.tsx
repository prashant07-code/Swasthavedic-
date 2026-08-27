import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { KioskProvider } from './context/KioskContext';
import { DoctorProvider } from './context/DoctorContext';
import { Navbar } from './components/Navbar';
import { AppView } from './types';
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
          <div className="min-h-screen flex flex-col bg-sky-50 text-slate-900 font-sans selection:bg-emerald-200">
            {/* Top Navigation Bar with View Switcher */}
            <Navbar currentView={currentView} setCurrentView={setCurrentView} />

            {/* Dynamic Active Workspace View with Layout Stability & Transition */}
            <main className="flex-1 w-full flex flex-col relative overflow-x-hidden" id="workspace-main-content">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="flex-1 w-full flex flex-col"
                >
                  {currentView === 'KIOSK' && <KioskLayout />}
                  {currentView === 'DOCTOR' && <DoctorDashboard />}
                  {currentView === 'STAFF' && <StaffHelpDashboard />}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Global Safety & Clinical Boundary Disclaimer */}
            <DisclaimerBanner />
          </div>
        </DoctorProvider>
      </KioskProvider>
    </AccessibilityProvider>
  );
}

import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { apiService } from '../../../services/api';
import { HelpCircle, BellRing, CheckCircle, X, UserCheck } from 'lucide-react';

export const HelpButton: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen, patient, session } = useKiosk();
  const { language } = useAccessibility();
  const [reason, setReason] = useState('Patient requires assistance with screen navigation or voice input.');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestHelp = async () => {
    setIsSubmitting(true);
    try {
      await apiService.createAssistanceRequest({
        kioskId: 'Kiosk #01 (OPD Ground Floor)',
        patientName: patient?.name || 'Anonymous Patient',
        tokenNumber: session?.tokenNumber,
        language,
        reason,
      });
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setIsHelpModalOpen(false);
      }, 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        id="kiosk-help-floating-btn"
        onClick={() => setIsHelpModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-700 font-black px-6 py-3.5 rounded-3xl shadow-xl flex items-center gap-3.5 border-2 border-rose-300 transition-all cursor-pointer"
        title="सहायता चाहिए? सहायक बुलाएं"
      >
        <div className="w-9 h-9 bg-rose-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-xs">
          ?
        </div>
        <div className="text-left">
          <div className="text-base font-black leading-tight">
            {language === 'hi' ? 'सहायता चाहिए?' : 'Need Help?'}
          </div>
          <div className="text-[10px] text-rose-600 uppercase tracking-widest font-extrabold">
            {language === 'hi' ? 'सहायक बुलाएं (Staff)' : 'Call Attendant'}
          </div>
        </div>
      </button>

      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" id="help-modal-overlay">
          <div className="bg-white rounded-[32px] max-w-md w-full p-7 shadow-2xl border-4 border-rose-200 text-slate-900 relative">
            <button
              id="help-modal-close-btn"
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  {language === 'hi' ? 'सहायक को संदेश भेज दिया गया है!' : 'Assistance Alert Dispatched!'}
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  {language === 'hi'
                    ? 'कृपया कियोस्क के पास ही रुकें। ओपीडी स्टाफ सदस्य 1-2 मिनट में आपकी सहायता के लिए आ रहे हैं।'
                    : 'A hospital OPD attendant has been notified and is coming to assist you at Kiosk #01.'}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-xs">
                    <BellRing className="w-7 h-7 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {language === 'hi' ? 'अस्पताल सहायक को बुलाएं' : 'Request Hospital Staff Assistance'}
                    </h3>
                    <p className="text-xs text-rose-600 font-bold">Kiosk ID: SV-BPL-003 • Ground Floor</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700 mb-5 bg-rose-50 p-4 rounded-2xl border-2 border-rose-200 leading-relaxed font-medium">
                  {language === 'hi'
                    ? 'यदि आपको स्क्रीन चलाने, आवाज में बोलने या दस्तावेज़ स्कैन करने में कोई भी कठिनाई हो रही है, तो संकोच न करें। हमारे सहायक तुरंत आपकी मदद करेंगे।'
                    : 'If you have any difficulty navigating the screen, speaking symptoms, or scanning prescriptions, our OPD desk staff will guide you.'}
                </p>

                <div className="mb-6">
                  <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                    {language === 'hi' ? 'सहायता का कारण (वैकल्पिक)' : 'Assistance Reason'}
                  </label>
                  <select
                    id="help-reason-select"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 text-sm bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 font-semibold"
                  >
                    <option value="Patient requires assistance with screen navigation or voice input.">
                      {language === 'hi' ? 'स्क्रीन चलाने या आवाज रिकॉर्ड करने में मदद' : 'Help with screen navigation/voice input'}
                    </option>
                    <option value="Help needed to take photo of old prescription document.">
                      {language === 'hi' ? 'पुराने पर्चे की फोटो खींचने/स्कैन करने में मदद' : 'Help scanning old prescription document'}
                    </option>
                    <option value="Patient feeling unwell or having severe acute discomfort.">
                      {language === 'hi' ? 'मरीज़ को चक्कर या अत्यधिक बेचैनी महसूस हो रही है' : 'Patient feeling unwell / acute discomfort'}
                    </option>
                    <option value="Language assistance needed.">
                      {language === 'hi' ? 'भाषा समझने में सहायता' : 'Language / dialect assistance'}
                    </option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    id="help-cancel-btn"
                    onClick={() => setIsHelpModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-sm cursor-pointer"
                  >
                    {language === 'hi' ? 'वापस जाएं' : 'Cancel'}
                  </button>
                  <button
                    id="help-confirm-btn"
                    onClick={handleRequestHelp}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <UserCheck className="w-4 h-4" />
                    {isSubmitting
                      ? 'भेज रहे हैं...'
                      : language === 'hi'
                      ? 'सहायक बुलाएं'
                      : 'Call Staff Now'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

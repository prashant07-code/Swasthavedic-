import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { apiService } from '../../../services/api';
import { t } from '../../../constants/languages';
import { Gender } from '../../../types';
import { User, Phone, MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

export const ProfileStep: React.FC = () => {
  const { goToStep, patient, setPatient, setSession } = useKiosk();
  const { language, mode } = useAccessibility();

  const [name, setName] = useState(patient?.name || '');
  const [age, setAge] = useState(patient?.age ? String(patient.age) : '45');
  const [gender, setGender] = useState<Gender>(patient?.gender || 'MALE');
  const [mobile, setMobile] = useState(patient?.mobile || '');
  const [address, setAddress] = useState(patient?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitProfile = async () => {
    setIsSubmitting(true);
    try {
      let activePatient = patient;

      if (!activePatient) {
        const res = await apiService.registerPatient({
          name: name || 'Anonymous Patient',
          age: Number(age) || 45,
          gender,
          mobile,
          address,
          preferredLanguage: language,
        });

        if (res.success && res.patient) {
          activePatient = res.patient;
          setPatient(res.patient);
        }
      }

      if (activePatient) {
        const sessRes = await apiService.createSession({
          patientId: activePatient.id,
          language,
          accessibilityMode: mode,
          isAttendantPresent: mode === 'ASSISTED',
        });

        if (sessRes.success) {
          setSession(sessRes.session);
        }
      }

      goToStep('CHIEF_COMPLAINT');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-10" id="kiosk-profile-step">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-[28px] flex items-center justify-center mx-auto mb-4 shadow-md border-4 border-sky-200">
          <User className="w-10 h-10 text-sky-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
          {t('profileTitle', language)}
        </h2>
        <p className="text-sm text-slate-600 font-medium">
          {language === 'hi'
            ? 'कृपया मरीज़ का बुनियादी विवरण दर्ज करें:'
            : 'Please enter basic patient demographic details:'}
        </p>
      </div>

      <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8">
        {/* Full Name */}
        <div className="mb-5">
          <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-sky-600" />
            {t('nameLabel', language)} <span className="text-rose-500">*</span>
          </label>
          <input
            id="profile-name-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="उदा. रमेश कुमार / शांति देवी"
            className="w-full p-3.5 bg-sky-50/50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-hidden"
          />
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-600" />
              {t('ageLabel', language)} <span className="text-rose-500">*</span>
            </label>
            <input
              id="profile-age-input"
              type="number"
              min="1"
              max="120"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="45"
              className="w-full p-3.5 bg-sky-50/50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2">
              {t('genderLabel', language)} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-3 px-1 text-xs font-black rounded-xl border-2 text-center transition-all cursor-pointer ${
                    gender === g
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                      : 'bg-sky-50/50 text-slate-700 border-slate-200 hover:bg-sky-100'
                  }`}
                >
                  {g === 'MALE' ? t('male', language) : g === 'FEMALE' ? t('female', language) : t('other', language)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Number */}
        <div className="mb-5">
          <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-sky-600" />
            {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
          </label>
          <input
            id="profile-mobile-input"
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="9876543210"
            className="w-full p-3.5 bg-sky-50/50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-hidden"
          />
        </div>

        {/* Address / Location */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-600" />
            {language === 'hi' ? 'पता / गाँव / शहर' : 'Village / Town / Address'}
          </label>
          <input
            id="profile-address-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="उदा. वार्ड 4, महमूरगंज, वाराणसी"
            className="w-full p-3.5 bg-sky-50/50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-hidden"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="profile-back-btn"
          onClick={() => goToStep('CONSENT')}
          className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>

        <button
          id="profile-continue-btn"
          onClick={handleSubmitProfile}
          disabled={isSubmitting || !name}
          className="py-4 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center gap-2.5 disabled:opacity-50 active:scale-98 cursor-pointer border-b-4 border-emerald-700 transition-all"
        >
          <span>{isSubmitting ? 'सहेज रहे हैं...' : t('next', language)}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

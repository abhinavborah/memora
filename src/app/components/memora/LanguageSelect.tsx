/** Language Selection Screen */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Check, Globe, ArrowLeft } from 'lucide-react';
import { Screen, PrimaryBtn, MemoraLogo } from './Shared';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../services/translation';
import { useTranslation } from '../../hooks/useTranslation';
import { ScrollArea } from '../ui/scroll-area';

export function LanguageSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLanguage, setSelectedLanguage } = useApp();
  const { t, preload } = useTranslation();

  const fromProfile = (location.state as { from?: string } | null)?.from === 'profile';

  useEffect(() => {
    preload([
      'Choose Your Language',
      'Select the language you are most comfortable with. You can change this anytime in settings.',
      'Continue',
    ]);
  }, [preload]);

  const handleContinue = () => {
    if (fromProfile) {
      navigate('/profile');
    } else {
      navigate('/phone');
    }
  };

  return (
    <Screen className="px-6 py-10">
      {fromProfile && (
        <button onClick={() => navigate('/profile')} className="mb-4 self-start">
          <ArrowLeft size={24} color="#1A1A1A" />
        </button>
      )}
      <div className="flex flex-col items-center gap-4 mb-8">
        <MemoraLogo size={72} />
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe size={24} className="text-[#C1622F]" />
            <h2 className="text-2xl font-bold text-[#1A1A1A]">{t('Choose Your Language')}</h2>
          </div>
          <p className="text-sm text-[#888] leading-relaxed">
            {t('Select the language you are most comfortable with. You can change this anytime in settings.')}
          </p>
        </div>
      </div>

      <ScrollArea type="always" className="h-[340px] mb-6 border-2 border-[#D4CFC0] rounded-2xl p-2 overflow-hidden">
        <div className="space-y-2 pr-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-[#C1622F] bg-[#C1622F]/5'
                    : 'border-[#D4CFC0] bg-white active:bg-[#F5F1E8]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A1A1A] text-base">{lang.nativeName}</p>
                  <p className="text-sm text-[#888]">{lang.name}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#C1622F] flex items-center justify-center flex-shrink-0">
                    <Check size={14} color="white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="w-full">
        <PrimaryBtn onClick={handleContinue}>{t('Continue')}</PrimaryBtn>
      </div>
    </Screen>
  );
}

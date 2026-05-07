import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { MemoraLogo, Screen, PrimaryBtn, SecondaryBtn } from './Shared';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Input } from '../ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// ─── Splash Screen ────────────────────────────────────────────────────────────
export function SplashScreen() {
  const navigate = useNavigate();
  const { t, preload } = useTranslation();
  const [slide, setSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const slides = [
    {
      titleKey: 'Your Voice, Their Treasure',
      subKey: 'Preserve your memories. Connect with family.',
    },
    {
      titleKey: 'Record & Share Stories',
      subKey: 'Turn your voice into beautiful AI-generated videos.',
    },
    {
      titleKey: 'Stay Connected Every Day',
      subKey: 'Fun missions and voice notes bring family closer.',
    },
  ];

  useEffect(() => {
    preload(slides.flatMap((s) => [s.titleKey, s.subKey, 'Begin Your Journey', 'I Already Have an Account']));
  }, [preload]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && slide < slides.length - 1) {
      setSlide(slide + 1);
    }
    if (isRightSwipe && slide > 0) {
      setSlide(slide - 1);
    }
  };

  return (
    <Screen className="items-center justify-between px-6 py-12">
      {/* Fixed logo + Memora — NOT swipeable */}
      <div className="flex flex-col items-center gap-8 pt-8">
        <MemoraLogo size={90} />
        <h1 className="text-5xl font-extrabold text-[#1A1A1A]">Memora</h1>
      </div>

      {/* Swipeable text — fixed height so layout doesn't shift */}
      <div
        className="flex-1 flex flex-col items-center justify-center w-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="text-center min-h-[80px] flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-[#1A1A1A]">{t(slides[slide].titleKey)}</p>
          <p className="text-sm text-[#888] mt-2 max-w-[260px]">{t(slides[slide].subKey)}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`rounded-full transition-all ${i === slide ? 'bg-[#1A1A1A] w-5 h-2.5' : 'bg-[#C8C3B4] w-2.5 h-2.5'}`}
          />
        ))}
      </div>

      <div className="w-full flex flex-col gap-3">
        <PrimaryBtn onClick={() => navigate('/language')}>{t('Begin Your Journey')}</PrimaryBtn>
        <SecondaryBtn onClick={() => navigate('/language')}>{t('I Already Have an Account')}</SecondaryBtn>
      </div>
    </Screen>
  );
}

const COUNTRIES = [
  { code: 'IN', flag: '🇮🇳', dial: '+91' },
  { code: 'US', flag: '🇺🇸', dial: '+1' },
  { code: 'GB', flag: '🇬🇧', dial: '+44' },
  { code: 'CA', flag: '🇨🇦', dial: '+1' },
  { code: 'AU', flag: '🇦🇺', dial: '+61' },
  { code: 'AE', flag: '🇦🇪', dial: '+971' },
  { code: 'SG', flag: '🇸🇬', dial: '+65' },
];

// ─── Phone Entry Screen ───────────────────────────────────────────────────────
export function PhoneEntry() {
  const navigate = useNavigate();
  const { setPhoneNumber } = useApp();
  const { t, preload } = useTranslation();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    preload([
      'Connect with Family',
      'Enter your number to get started',
      'Phone Number',
      'Continue',
      "We'll send a code to verify.",
      'No passwords to remember.',
      'Need help? Call us',
    ]);
  }, [preload]);

  const handleContinue = () => {
    setPhoneNumber(countryCode + phone);
    navigate('/otp');
  };

  const selectedCountry = COUNTRIES.find((c) => c.dial === countryCode) || COUNTRIES[0];

  return (
    <Screen className="px-6 py-10">
      <div className="flex flex-col items-center gap-6 mb-10">
        <MemoraLogo size={72} />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1A1A1A]">{t('Connect with Family')}</h2>
          <p className="text-[#888] mt-2">{t('Enter your number to get started')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <p className="text-center tracking-wide text-xs font-bold text-[#1A1A1A]">{t('Phone Number')}</p>
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger
              className="px-3 rounded-2xl bg-white border-2 border-[#D4CFC0] font-bold text-[#1A1A1A] text-center focus:border-[#7B9EC8] focus:ring-0 !h-16 w-auto min-w-[5.5rem] flex items-center justify-center gap-1"
            >
              <SelectValue>
                <span className="text-base">{selectedCountry.flag}</span>
                <span className="text-sm">{selectedCountry.dial}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2 border-[#D4CFC0] bg-white">
              {COUNTRIES.map((c) => (
                <SelectItem
                  key={c.code}
                  value={c.dial}
                  className="text-[#1A1A1A] focus:bg-[#EDE8DC] cursor-pointer [&>*:last-child]:w-full"
                >
                  <span className="flex items-center w-full">
                    <span className="text-[#888] text-xs w-8">{c.code}</span>
                    <span className="mr-2">{c.flag}</span>
                    <span className="font-semibold">{c.dial}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98XXX XXXXX"
            className="flex-1 px-4 rounded-2xl border-2 border-[#D4CFC0] text-[#1A1A1A] text-center text-lg font-semibold placeholder:text-[#C8C3B4] focus:border-[#7B9EC8] focus-visible:ring-0 h-16"
          />
        </div>
        <PrimaryBtn onClick={handleContinue}>{t('Continue')}</PrimaryBtn>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <p className="text-center text-sm text-[#888]">
          {t("We'll send a code to verify.")}<br />{t('No passwords to remember.')}
        </p>
        <button className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#C8C3B4] text-sm font-bold tracking-wide text-[#1A1A1A]">
          {t('Need help? Call us')}
        </button>
      </div>
    </Screen>
  );
}

// ─── OTP Verify Screen ────────────────────────────────────────────────────────
export function OTPVerify() {
  const navigate = useNavigate();
  const { t, preload } = useTranslation();
  const [otp, setOtp] = useState('');

  useEffect(() => {
    preload([
      'Code Sent!',
      'Enter the 6-digit code from your SMS',
      'Reading SMS automatically...',
      'Verify',
      "Didn't get it?",
      'Resend',
    ]);
  }, [preload]);

  const handleVerify = () => navigate('/setup');

  return (
    <Screen className="px-6 py-10">
      <button onClick={() => navigate('/phone')} className="mb-8">
        <ArrowLeft size={24} color="#1A1A1A" />
      </button>

      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#1A1A1A]">{t('Code Sent!')}</h2>
          <p className="text-[#888] mt-2">{t('Enter the 6-digit code from your SMS')}</p>
          <p className="text-[#888] text-sm mt-1">{t('Reading SMS automatically...')}</p>
        </div>
      </div>

      <div className="flex justify-center my-8">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-14 rounded-2xl first:rounded-2xl last:rounded-2xl border-2 border-[#D4CFC0] text-2xl font-bold text-[#1A1A1A] bg-white data-[active=true]:border-[#7B9EC8]" />
            <InputOTPSlot index={1} className="w-12 h-14 rounded-2xl first:rounded-2xl last:rounded-2xl border-2 border-[#D4CFC0] text-2xl font-bold text-[#1A1A1A] bg-white data-[active=true]:border-[#7B9EC8]" />
            <InputOTPSlot index={2} className="w-12 h-14 rounded-2xl first:rounded-2xl last:rounded-2xl border-2 border-[#D4CFC0] text-2xl font-bold text-[#1A1A1A] bg-white data-[active=true]:border-[#7B9EC8]" />
            <InputOTPSlot index={3} className="w-12 h-14 rounded-2xl first:rounded-2xl last:rounded-2xl border-2 border-[#D4CFC0] text-2xl font-bold text-[#1A1A1A] bg-white data-[active=true]:border-[#7B9EC8]" />
            <InputOTPSlot index={4} className="w-12 h-14 rounded-2xl first:rounded-2xl last:rounded-2xl border-2 border-[#D4CFC0] text-2xl font-bold text-[#1A1A1A] bg-white data-[active=true]:border-[#7B9EC8]" />
            <InputOTPSlot index={5} className="w-12 h-14 rounded-2xl first:rounded-2xl last:rounded-2xl border-2 border-[#D4CFC0] text-2xl font-bold text-[#1A1A1A] bg-white data-[active=true]:border-[#7B9EC8]" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex flex-col gap-3">
        <PrimaryBtn onClick={handleVerify}>{t('Verify')}</PrimaryBtn>
        <div className="text-center">
          <span className="text-[#888] text-sm">{t("Didn't get it?")} </span>
          <button className="text-sm font-bold underline text-[#1A1A1A]">{t('Resend')}</button>
        </div>
      </div>
    </Screen>
  );
}

// ─── Name Setup Screen ────────────────────────────────────────────────────────
export function NameSetup() {
  const navigate = useNavigate();
  const { setUserName, readAloud, setReadAloud } = useApp();
  const { t, preload } = useTranslation();
  const [name, setName] = useState('');

  useEffect(() => {
    preload([
      'What should we call you?',
      'Enter your name...',
      'Read screens aloud',
      'Voice reads everything on screen',
      "Let's Get Started",
      'You can add more details later',
    ]);
  }, [preload]);

  const handleStart = () => {
    if (name.trim()) setUserName(name.trim());
    navigate('/onboarding/stories');
  };

  return (
    <Screen className="px-6 py-10">
      <button onClick={() => navigate('/otp')} className="mb-8">
        <ArrowLeft size={24} color="#1A1A1A" />
      </button>

      <div className="flex flex-col items-center mb-10">
        <MemoraLogo size={72} />
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold text-[#1A1A1A] whitespace-nowrap text-center">{t('What should we call you?')}</h2>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('Enter your name...')}
          className="w-full px-5 py-6 rounded-2xl border-2 border-[#D4CFC0] text-[#1A1A1A] text-lg font-semibold placeholder:text-[#C8C3B4] focus:border-[#7B9EC8] focus-visible:ring-0 h-auto"
        />

        <button
          onClick={() => setReadAloud(!readAloud)}
          className="w-full flex items-center justify-between gap-4 p-5 rounded-2xl border-2 border-[#D4CFC0] bg-white active:bg-[#F5F1E8] transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F5F1E8] flex items-center justify-center flex-shrink-0">
              <Volume2 size={24} color="#1A1A1A" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#1A1A1A] leading-tight whitespace-nowrap">{t('Read screens aloud')}</p>
              <p className="text-sm text-[#888] mt-0.5">{t('Voice reads everything on screen')}</p>
            </div>
          </div>
          <Switch
            checked={readAloud}
            onCheckedChange={setReadAloud}
            className="data-[state=checked]:bg-[#1A1A1A] data-[state=unchecked]:bg-[#C8C3B4] flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <PrimaryBtn onClick={handleStart}>{t("Let's Get Started")}</PrimaryBtn>
        <p className="text-center text-sm text-[#888]">{t('You can add more details later')}</p>
      </div>
    </Screen>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { MemoraLogo, Screen, PrimaryBtn, SecondaryBtn } from './Shared';
import { useApp } from '../../context/AppContext';
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
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Your Voice, Their Treasure',
      sub: 'Preserve your memories. Connect with family.',
    },
    {
      title: 'Record & Share Stories',
      sub: 'Turn your voice into beautiful AI-generated videos.',
    },
    {
      title: 'Stay Connected Every Day',
      sub: 'Fun missions and voice notes bring family closer.',
    },
  ];

  return (
    <Screen className="items-center justify-between px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <MemoraLogo size={90} />
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-[#1A1A1A] mb-3">
            Memora
          </h1>
          <p className="text-lg font-bold text-[#1A1A1A]">{slides[slide].title}</p>
          <p className="text-sm text-[#888] mt-2">{slides[slide].sub}</p>
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
        <PrimaryBtn onClick={() => navigate('/phone')}>Begin Your Journey</PrimaryBtn>
        <SecondaryBtn onClick={() => navigate('/phone')}>I Already Have an Account</SecondaryBtn>
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
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

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
          <h2 className="text-3xl font-bold text-[#1A1A1A]">Connect with Family</h2>
          <p className="text-[#888] mt-2">Enter your number to get started</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <p className="text-center tracking-widest text-xs font-bold text-[#1A1A1A]">PHONE NUMBER</p>
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
        <PrimaryBtn onClick={handleContinue}>CONTINUE</PrimaryBtn>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <p className="text-center text-sm text-[#888]">
          We'll send a code to verify.<br />No passwords to remember.
        </p>
        <button className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#C8C3B4] text-sm font-bold tracking-widest text-[#1A1A1A]">
          NEED HELP? CALL US
        </button>
      </div>
    </Screen>
  );
}

// ─── OTP Verify Screen ────────────────────────────────────────────────────────
export function OTPVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

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
          <h2 className="text-3xl font-black text-[#1A1A1A]">Code Sent!</h2>
          <p className="text-[#888] mt-2">Enter the 6-digit code from your SMS</p>
          <p className="text-[#888] text-sm mt-1">Reading SMS automatically...</p>
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
        <PrimaryBtn onClick={handleVerify}>VERIFY</PrimaryBtn>
        <div className="text-center">
          <span className="text-[#888] text-sm">Didn't get it? </span>
          <button className="text-sm font-bold underline text-[#1A1A1A]">Resend</button>
        </div>
      </div>
    </Screen>
  );
}

// ─── Name Setup Screen ────────────────────────────────────────────────────────
export function NameSetup() {
  const navigate = useNavigate();
  const { setUserName, readAloud, setReadAloud } = useApp();
  const [name, setName] = useState('');

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
        <h2 className="text-2xl font-black text-[#1A1A1A]">What should we call you?</h2>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full px-5 py-6 rounded-2xl border-2 border-[#D4CFC0] text-[#1A1A1A] text-lg font-semibold placeholder:text-[#C8C3B4] focus:border-[#7B9EC8] focus-visible:ring-0 h-auto"
        />

        <div className="flex items-center gap-3">
          <Switch
            checked={readAloud}
            onCheckedChange={setReadAloud}
            className="data-[state=checked]:bg-[#1A1A1A] data-[state=unchecked]:bg-[#C8C3B4]"
          />
          <Volume2 size={20} color="#1A1A1A" />
          <span className="text-base font-semibold text-[#1A1A1A]">Read screens aloud to me</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <PrimaryBtn onClick={handleStart}>Let's Get Started</PrimaryBtn>
        <p className="text-center text-sm text-[#888]">You can add more details later</p>
      </div>
    </Screen>
  );
}

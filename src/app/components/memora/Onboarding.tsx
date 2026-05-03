import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Screen, PrimaryBtn, SecondaryBtn, StepItem, SaathiAvatar, BottomNav } from './Shared';

// ─── How Stories Work ─────────────────────────────────────────────────────────
export function HowStoriesWork() {
  const navigate = useNavigate();

  return (
    <Screen withNav withSaathi className="px-5 pt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">How Stories Work</h2>
        <p className="text-[#888] mt-1">Preserve your memories in 4 simple steps</p>
      </div>

      <div className="flex flex-col gap-5 mb-8">
        <StepItem number={1} title="Record a Memory" description="Tap the mic and share a story, recipe, or life advice." />
        <StepItem number={2} title="Add Photos" description="Choose pictures to bring your story to life." />
        <StepItem number={3} title="Generate a Video" description="Pick an art style and we will create a beautiful video." />
        <StepItem number={4} title="Share with Family" description="Send the video to your loved ones in one tap." />
      </div>

      <div className="flex flex-col gap-3 pb-4">
        <SecondaryBtn onClick={() => navigate('/stories')}>START RECORDING</SecondaryBtn>
        <PrimaryBtn onClick={() => navigate('/onboarding/games')}>SKIP FOR NOW</PrimaryBtn>
      </div>
    </Screen>
  );
}

// ─── How Games Work ───────────────────────────────────────────────────────────
export function HowGamesWork() {
  const navigate = useNavigate();

  return (
    <Screen withNav withSaathi className="px-5 pt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">How Games Work</h2>
        <p className="text-[#888] mt-1">Stay connected through fun daily missions</p>
      </div>

      <div className="flex flex-col gap-5 mb-8">
        <StepItem number={1} title="Complete Daily Missions" description="Check your garden for new tasks every day." />
        <StepItem number={2} title="Send Voice Notes" description="Record and send messages to your family members." />
        <StepItem number={3} title="Grow Your Garden" description="Finish missions to make your flowers bloom." />
        <StepItem number={4} title="Collect Rewards" description="Keep your streak alive and unlock new flowers." />
      </div>

      <div className="flex flex-col gap-3 pb-4">
        <SecondaryBtn onClick={() => navigate('/games')}>START PLAYING</SecondaryBtn>
        <PrimaryBtn onClick={() => navigate('/onboarding/saathi')}>SKIP FOR NOW</PrimaryBtn>
      </div>
    </Screen>
  );
}

// ─── Meet Saathi ──────────────────────────────────────────────────────────────
export function MeetSaathi() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      body: 'I am your helpful AI assistant',
      hasDashedBox: false,
    },
    {
      body: 'You can find me on\nthe bottom right of the app',
      hasDashedBox: true,
    },
    {
      body: 'Got questions?\nNeed a hand?\nCan\'t find something?\n\nI am at your service!',
      hasDashedBox: true,
      isLast: true,
    },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen bg-black/40 flex items-end justify-center">
      <div className="w-full bg-[#EDE8DC] rounded-t-3xl px-6 pt-4 pb-10 min-h-[70vh] flex flex-col">
        {/* Handle */}
        <div className="w-10 h-1 bg-[#C8C3B4] rounded-full mx-auto mb-6" />

        <div className="flex flex-col items-center text-center gap-4 flex-1">
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">Meet your friendly assistant!</h2>
            <p className="text-lg font-bold text-[#1A1A1A]">Hello, I am Saathi!</p>
          </div>

          {/* Animated Saathi avatar */}
          <div className="relative flex items-center justify-center" style={{ width: 150, height: 150 }}>
            {[1, 2, 3].map((r) => (
              <div
                key={r}
                className="absolute rounded-full border border-[#1A1A1A] opacity-20 animate-ping"
                style={{ width: 80 + r * 22, height: 80 + r * 22, animationDuration: `${2 + r * 0.5}s` }}
              />
            ))}
            <SaathiAvatar size={88} />
          </div>

          {current.hasDashedBox ? (
            <div className="w-full border-2 border-dashed border-[#C8C3B4] rounded-2xl p-4">
              {current.body.split('\n').map((line, i) => (
                <p key={i} className={`text-base text-[#1A1A1A] ${line === '' ? 'h-3' : 'font-semibold'}`}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#888]">{current.body}</p>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 my-5">
          {steps.map((_, i) => (
            <div key={i} className={`rounded-full transition-all ${i === step ? 'bg-[#1A1A1A] w-5 h-2.5' : 'bg-[#C8C3B4] w-2.5 h-2.5'}`} />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {current.isLast ? (
            <PrimaryBtn onClick={() => navigate('/home')}>LETS BEGIN</PrimaryBtn>
          ) : (
            <>
              <SecondaryBtn onClick={() => setStep(step + 1)}>NEXT</SecondaryBtn>
              <PrimaryBtn onClick={() => navigate('/home')}>SKIP</PrimaryBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
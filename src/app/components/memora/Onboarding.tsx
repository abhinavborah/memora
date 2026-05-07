import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Screen, PrimaryBtn, SecondaryBtn, StepItem, SaathiAvatar, BottomNav } from './Shared';
import { useTranslation } from '../../hooks/useTranslation';

// ─── How Stories Work ─────────────────────────────────────────────────────────
export function HowStoriesWork() {
  const navigate = useNavigate();
  const { t, preload } = useTranslation();

  useEffect(() => {
    preload([
      'How Stories Work',
      'Preserve your memories in 4 simple steps',
      'Record a Memory',
      'Tap the mic and share a story, recipe, or life advice.',
      'Add Photos',
      'Choose pictures to bring your story to life.',
      'Generate a Video',
      'Pick an art style and we will create a beautiful video.',
      'Share with Family',
      'Send the video to your loved ones in one tap.',
      'Start Recording',
      'Skip for Now',
    ]);
  }, [preload]);

  return (
    <Screen withNav withSaathi className="px-5 pt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">{t('How Stories Work')}</h2>
        <p className="text-[#888] mt-1">{t('Preserve your memories in 4 simple steps')}</p>
      </div>

      <div className="flex flex-col gap-5 mb-8">
        <StepItem number={1} title={t('Record a Memory')} description={t('Tap the mic and share a story, recipe, or life advice.')} />
        <StepItem number={2} title={t('Add Photos')} description={t('Choose pictures to bring your story to life.')} />
        <StepItem number={3} title={t('Generate a Video')} description={t('Pick an art style and we will create a beautiful video.')} />
        <StepItem number={4} title={t('Share with Family')} description={t('Send the video to your loved ones in one tap.')} />
      </div>

      <div className="flex flex-col gap-3 pb-4">
        <SecondaryBtn onClick={() => navigate('/stories')}>{t('Start Recording')}</SecondaryBtn>
        <PrimaryBtn onClick={() => navigate('/onboarding/games')}>{t('Skip for Now')}</PrimaryBtn>
      </div>
    </Screen>
  );
}

// ─── How Games Work ───────────────────────────────────────────────────────────
export function HowGamesWork() {
  const navigate = useNavigate();
  const { t, preload } = useTranslation();

  useEffect(() => {
    preload([
      'How Games Work',
      'Stay connected through fun daily missions',
      'Complete Daily Missions',
      'Check your garden for new tasks every day.',
      'Send Voice Notes',
      'Record and send messages to your family members.',
      'Grow Your Garden',
      'Finish missions to make your flowers bloom.',
      'Collect Rewards',
      'Keep your streak alive and unlock new flowers.',
      'Start Playing',
      'Skip for Now',
    ]);
  }, [preload]);

  return (
    <Screen withNav withSaathi className="px-5 pt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">{t('How Games Work')}</h2>
        <p className="text-[#888] mt-1">{t('Stay connected through fun daily missions')}</p>
      </div>

      <div className="flex flex-col gap-5 mb-8">
        <StepItem number={1} title={t('Complete Daily Missions')} description={t('Check your garden for new tasks every day.')} />
        <StepItem number={2} title={t('Send Voice Notes')} description={t('Record and send messages to your family members.')} />
        <StepItem number={3} title={t('Grow Your Garden')} description={t('Finish missions to make your flowers bloom.')} />
        <StepItem number={4} title={t('Collect Rewards')} description={t('Keep your streak alive and unlock new flowers.')} />
      </div>

      <div className="flex flex-col gap-3 pb-4">
        <SecondaryBtn onClick={() => navigate('/games')}>{t('Start Playing')}</SecondaryBtn>
        <PrimaryBtn onClick={() => navigate('/onboarding/saathi')}>{t('Skip for Now')}</PrimaryBtn>
      </div>
    </Screen>
  );
}

// ─── Meet Saathi ──────────────────────────────────────────────────────────────
export function MeetSaathi() {
  const navigate = useNavigate();
  const { t, preload } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    preload([
      'Meet your friendly assistant!',
      'Hello, I am Saathi!',
      'I am your helpful AI assistant',
      'You can find me on',
      'the bottom right of the app',
      'Got questions?',
      'Need a hand?',
      "Can't find something?",
      'I am at your service!',
      "Let's Begin",
      'Next',
      'Skip',
    ]);
  }, [preload]);

  const steps = [
    {
      body: t('I am your helpful AI assistant'),
      hasDashedBox: false,
    },
    {
      body: t('You can find me on') + '\n' + t('the bottom right of the app'),
      hasDashedBox: true,
    },
    {
      body: t('Got questions?') + '\n' + t('Need a hand?') + '\n' + t("Can't find something?") + '\n\n' + t('I am at your service!'),
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
            <h2 className="text-xl font-bold text-[#1A1A1A]">{t('Meet your friendly assistant!')}</h2>
            <p className="text-lg font-bold text-[#1A1A1A]">{t('Hello, I am Saathi!')}</p>
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
            <PrimaryBtn onClick={() => navigate('/home')}>{t("Let's Begin")}</PrimaryBtn>
          ) : (
            <>
              <SecondaryBtn onClick={() => setStep(step + 1)}>{t('Next')}</SecondaryBtn>
              <PrimaryBtn onClick={() => navigate('/home')}>{t('Skip')}</PrimaryBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
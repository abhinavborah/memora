import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, ChevronRight, Zap } from 'lucide-react';
import { Screen, FlowerGarden, StreakBadge, RecordingButton, Waveform, PrimaryBtn, SecondaryBtn } from './Shared';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Progress } from '../ui/progress';

// ─── Garden Screen ────────────────────────────────────────────────────────────
export function Garden() {
  const navigate = useNavigate();
  const { gardenFlowers, streak, completedMissions } = useApp();
  const totalMissions = 3;
  const doneMissions = completedMissions.length;

  return (
    <Screen withNav withSaathi className="pt-0">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#166534] via-[#15803D] to-[#4ADE80] px-5 pt-10 pb-6 overflow-hidden">
        <div className="absolute bottom-0 right-4 opacity-20 text-5xl">🌸</div>
        <div className="absolute top-6 left-4 opacity-15 text-3xl">🌿</div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs font-semibold tracking-wide">YOUR GARDEN</p>
            <h2 className="text-[26px] font-bold text-white leading-tight">Grow Together 🌱</h2>
          </div>
          <StreakBadge streak={streak} />
        </div>

        {/* Progress bar */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
          <div className="flex justify-between text-white/80 text-xs font-bold mb-2">
            <span>Today's Progress</span>
            <span>{doneMissions}/{totalMissions} missions</span>
          </div>
          <Progress value={(doneMissions / totalMissions) * 100} className="h-2.5 bg-white/20" />
        </div>
      </div>

      <div className="flex-1 px-5 pt-5">
        <FlowerGarden count={gardenFlowers} />

        <div className="mt-5 flex flex-col gap-3">
          <motion.div whileTap={{ scale: 0.97 }}>
            <PrimaryBtn onClick={() => navigate('/games/missions')}>
              🎯 TODAY'S MISSIONS →
            </PrimaryBtn>
          </motion.div>
          <SecondaryBtn onClick={() => navigate('/games/missions')}>
            🏆 VIEW ALL REWARDS
          </SecondaryBtn>
        </div>

        {/* Fun fact */}
        <div className="mt-4 bg-gradient-to-r from-[#FEF9EC] to-[#FFFBEB] rounded-2xl border border-[#F5D88A] p-4 flex items-start gap-3">
          <span className="text-2xl">🌼</span>
          <div>
            <p className="font-bold text-[#92400E] text-sm">Did you know?</p>
            <p className="text-xs text-[#888] mt-0.5">Each flower represents a shared moment with your family. Your garden has {gardenFlowers} beautiful memories!</p>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─── Daily Missions ───────────────────────────────────────────────────────────
const MISSIONS = [
  { id: 'breakfast', label: 'Share a photo of breakfast', emoji: '🍱', xp: 10 },
  { id: 'priya', label: 'Ask Priya about her picnic', emoji: '🎙️', xp: 20, isVoice: true },
  { id: 'meditate', label: 'Meditate for 2 mins', emoji: '🧘', xp: 15 },
];

export function DailyMissions() {
  const navigate = useNavigate();
  const { gardenFlowers, streak, completedMissions, setCompletedMissions } = useApp();

  const toggle = (label: string) => {
    setCompletedMissions(
      completedMissions.includes(label)
        ? completedMissions.filter((m) => m !== label)
        : [...completedMissions, label]
    );
  };

  const totalXP = MISSIONS.filter(m => completedMissions.includes(m.label)).reduce((sum, m) => sum + m.xp, 0);
  const maxXP = MISSIONS.reduce((sum, m) => sum + m.xp, 0);

  return (
    <Screen withNav withSaathi className="pt-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] px-5 pt-10 pb-5">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('/games')}>
            <ArrowLeft size={22} color="white" />
          </button>
          <StreakBadge streak={streak} />
        </div>
        <p className="text-white/60 text-xs font-semibold tracking-wide">DAILY MISSIONS</p>
        <h2 className="text-[24px] font-bold text-white mt-0.5">Today's Challenges 🎯</h2>

        {/* XP bar */}
        <div className="mt-3 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10">
          <div className="flex justify-between text-white/70 text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1"><Zap size={10} /> XP Earned Today</span>
            <span>{totalXP}/{maxXP} XP</span>
          </div>
          <Progress value={(totalXP / maxXP) * 100} className="h-2 bg-white/20" />
        </div>
      </div>

      <div className="px-5 pt-4">
        <FlowerGarden count={gardenFlowers} />

        <div className="mt-5 mb-3">
          <p className="text-xs font-bold tracking-wide text-[#1A1A1A]">MISSIONS</p>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          {MISSIONS.map(({ id, label, emoji, xp, isVoice }) => {
            const done = completedMissions.includes(label);
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.97 }}
                onClick={() => isVoice ? navigate('/games/voice-note') : toggle(label)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${done ? 'bg-[#F0FDF4] border-[#86EFAC]' : 'bg-white border-[#D4CFC0] hover:border-[#1A1A1A] hover:shadow-md'}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${done ? 'bg-[#DCFCE7]' : 'bg-[#F5F1E8]'}`}>
                  {emoji}
                </div>
                <div className="flex-1">
                  <span className={`font-bold text-sm ${done ? 'line-through text-[#888]' : 'text-[#1A1A1A]'}`}>{label}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-[#F59E0B] bg-[#FEF3C7] px-1.5 py-0.5 rounded-full">+{xp} XP</span>
                    {isVoice && !done && <span className="text-xs font-semibold text-[#7B9EC8]">🎙️ VOICE NOTE</span>}
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-[#10B981] border-[#10B981]' : 'border-[#D4CFC0]'}`}>
                  {done && <Check size={14} color="white" strokeWidth={3} />}
                  {!done && isVoice && <ChevronRight size={14} color="#888" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

// ─── Voice Note Mission ───────────────────────────────────────────────────────
export function VoiceNoteMission() {
  const navigate = useNavigate();
  const { streak } = useApp();
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [elapsed, setElapsed] = useState(0);

  const SAMPLE = '"Hello beta, did you enjoy your school picnic?"';

  useEffect(() => {
    if (recording) {
      let i = 0;
      const t = setInterval(() => {
        setTranscript(SAMPLE.slice(0, i + 1));
        i++;
        if (i >= SAMPLE.length) { clearInterval(t); setDone(true); setRecording(false); }
      }, 35);
      return () => clearInterval(t);
    }
  }, [recording]);

  useEffect(() => {
    if (recording) {
      const t = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(t);
    } else {
      setElapsed(0);
    }
  }, [recording]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <Screen withNav withSaathi className="pt-0">
      {/* Header */}
      <div className={`px-5 pt-10 pb-6 transition-colors duration-500 ${recording ? 'bg-gradient-to-b from-[#1A1A1A] to-[#2D2D2D]' : 'bg-gradient-to-b from-[#7B9EC8] to-[#5B7EA8]'}`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/games/missions')}>
            <ArrowLeft size={22} color="white" />
          </button>
          <StreakBadge streak={streak} />
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl mx-auto mb-3">
            🧒
          </div>
          <h2 className="text-xl font-bold text-white">Ask Priya</h2>
          <p className="text-white/70 text-sm mt-0.5">About her school picnic</p>
          {recording && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
              <span className="text-white/80 text-sm font-bold">Recording {formatTime(elapsed)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-5 pt-5">
        <div className="flex flex-col items-center gap-3 mb-5">
          {!recording && !done && <p className="text-xs tracking-wide font-semibold text-[#888]">TAP TO RECORD</p>}
          {recording && <p className="text-xs tracking-wide font-semibold text-red-500 animate-pulse">TAP TO STOP</p>}
          <RecordingButton
            isRecording={recording}
            onPress={() => !done && setRecording(!recording)}
            size={90}
          />
          {!recording && !done && <p className="text-xs text-[#888] text-center">Hold to record your voice note for Priya</p>}
        </div>

        <AnimatePresence>
          {(recording || done) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border-2 border-[#D4CFC0] p-4 mb-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${recording ? 'bg-[#DC2626] animate-pulse' : 'bg-[#10B981]'}`} />
                <p className="text-xs font-semibold text-[#888]">{recording ? 'Recording…' : 'Recorded'}</p>
              </div>
              <Waveform playing={recording} />
              <p className="text-center text-sm font-semibold text-[#1A1A1A] mt-2 min-h-[20px]">
                {transcript}
                {recording && <span className="inline-block w-0.5 h-4 bg-[#C1622F] ml-0.5 animate-pulse align-middle" />}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {done ? (
          <div className="flex gap-3">
            <button
              onClick={() => { setDone(false); setTranscript(''); }}
              className="flex-1 py-4 rounded-2xl border-2 border-[#D4CFC0] font-bold text-[#1A1A1A] bg-white tracking-wide text-sm hover:border-[#1A1A1A] transition-colors"
            >
              Re-record
            </button>
            <button
              onClick={() => navigate('/games/voice-note/sent')}
              className="flex-1 py-4 rounded-2xl bg-[#1A1A1A] border-2 border-[#1A1A1A] font-bold text-white tracking-wide text-sm hover:bg-[#C1622F] transition-colors"
            >
              Send ✈️
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/games/missions')}
            className="w-full py-4 rounded-2xl border-2 border-[#D4CFC0] font-bold text-[#888] bg-white flex items-center justify-center gap-2 hover:border-[#1A1A1A] transition-colors"
          >
            <ArrowLeft size={18} /> Back to Missions
          </button>
        )}
      </div>
    </Screen>
  );
}

// ─── Voice Note Sent ──────────────────────────────────────────────────────────
export function VoiceNoteSent() {
  const navigate = useNavigate();
  const { streak } = useApp();
  const [hasResponse, setHasResponse] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHasResponse(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Screen withNav withSaathi className="px-5 pt-5">
      <div className="flex items-center justify-end mb-4">
        <StreakBadge streak={streak} />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-3 mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-xl">
          <Check size={36} color="white" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">
          {hasResponse ? '🎉 Priya responded!' : 'Voice note sent!'}
        </h2>
        {!hasResponse && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#7B9EC8]"
                  style={{ animation: `bounceDot 0.7s ${i * 0.15}s infinite alternate` }} />
              ))}
            </div>
            <p className="text-sm text-[#888]">Waiting for Priya…</p>
          </div>
        )}
        <style>{`@keyframes bounceDot { from { transform: translateY(0); } to { transform: translateY(-6px); } }`}</style>
      </motion.div>

      {/* Your voice note */}
      <div className="bg-white rounded-2xl border-2 border-[#D4CFC0] p-4 mb-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <img src="/memora/grandma_pfp.png" alt="Meena" className="w-8 h-8 rounded-full object-cover" />
          <p className="text-xs font-semibold text-[#888]">Your Note</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-[#F5F1E8] border border-[#D4CFC0] flex items-center justify-center flex-shrink-0">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[9px] border-l-[#888] ml-0.5" />
          </button>
          <Waveform />
        </div>
        <p className="text-sm text-[#1A1A1A] mt-2">"Hello beta, did you enjoy your school picnic?"</p>
      </div>

      {/* Their response */}
      <AnimatePresence>
        {hasResponse && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-2xl border-2 border-[#BFDBFE] p-4 mb-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2 flex-row-reverse">
              <img src="/memora/granddaughter_pfp.png" alt="Priya" className="w-8 h-8 rounded-full object-cover" />
              <p className="text-xs font-semibold text-[#888]">Priya's Reply</p>
            </div>
            <div className="flex items-center gap-2 flex-row-reverse">
              <button className="w-8 h-8 rounded-full bg-[#DBEAFE] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0">
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[9px] border-l-[#7B9EC8] ml-0.5" />
              </button>
              <Waveform playing />
            </div>
            <p className="text-sm text-[#1A1A1A] mt-2">"Yes Daadi, the school picnic was so much fun! 🎒"</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={() => navigate('/games/missions')}
          className="w-full py-4 rounded-2xl border-2 border-[#D4CFC0] font-bold tracking-wide text-sm text-[#1A1A1A] bg-white hover:border-[#1A1A1A] transition-colors"
        >
          Check Missions
        </button>
        <button
          onClick={() => hasResponse ? navigate('/games/reward') : undefined}
          disabled={!hasResponse}
          className={`w-full py-4 rounded-2xl border-2 font-bold tracking-wide text-sm transition-all ${hasResponse ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white hover:bg-[#C1622F] hover:border-[#C1622F]' : 'border-[#D4CFC0] text-[#C8C3B4] bg-white cursor-not-allowed'}`}
        >
          {hasResponse ? '🌸 Collect Daily Reward' : 'Collect Daily Reward'}
        </button>
      </div>
    </Screen>
  );
}

// ─── New Flower Bloomed ───────────────────────────────────────────────────────
export function NewFlowerBloomed() {
  const navigate = useNavigate();
  const { gardenFlowers, setGardenFlowers, streak, completedMissions, setCompletedMissions } = useApp();
  const [collected, setCollected] = useState(false);

  const handleCollect = () => {
    setGardenFlowers(gardenFlowers + 1);
    setCompletedMissions([...completedMissions, 'Ask Priya about her picnic']);
    setCollected(true);
    setTimeout(() => navigate('/games'), 1400);
  };

  return (
    <Screen withNav withSaathi className="px-5 pt-5">
      <div className="flex items-center justify-end mb-4">
        <StreakBadge streak={streak} />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-5"
      >
        <div className="text-6xl mb-3 animate-bounce">🌸</div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">A new flower bloomed!</h2>
        <p className="text-[#888] mt-1">Your garden looks amazing</p>
      </motion.div>

      <FlowerGarden count={gardenFlowers + 1} />

      {/* XP celebration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-2xl border border-[#F59E0B] p-4 flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-[#F59E0B] flex items-center justify-center text-2xl shadow-md">⭐</div>
        <div>
          <p className="font-bold text-[#92400E]">+20 XP Earned!</p>
          <p className="text-xs text-[#92400E]/70">You completed today's voice mission</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 mt-5">
        <button
          onClick={handleCollect}
          disabled={collected}
          className={`w-full py-4 rounded-2xl border-2 font-bold tracking-wide text-sm transition-all shadow-md ${collected ? 'bg-[#10B981] border-[#10B981] text-white' : 'bg-[#1A1A1A] border-[#1A1A1A] text-white hover:bg-[#C1622F] hover:border-[#C1622F]'}`}
        >
          {collected ? '✓ Reward Collected! Going back…' : "🌸 Collect Today's Reward"}
        </button>
        <button
          onClick={() => navigate('/games/missions')}
          className="w-full py-4 rounded-2xl border-2 border-[#D4CFC0] font-bold tracking-wide text-sm text-[#1A1A1A] bg-white hover:border-[#1A1A1A] transition-colors"
        >
          Check Missions
        </button>
      </div>
    </Screen>
  );
}

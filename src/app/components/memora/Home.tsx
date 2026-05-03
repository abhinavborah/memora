import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, Puzzle, ChevronRight, Sparkles, Star } from 'lucide-react';
import { Screen, MemoraLogo, StreakBadge } from './Shared';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';

// ─── Welcome / Splash Home ────────────────────────────────────────────────────
export function WelcomeHome() {
  const navigate = useNavigate();
  const { userName, hasSeenWelcome, setHasSeenWelcome } = useApp();

  useEffect(() => {
    if (hasSeenWelcome) {
      navigate('/home/menu', { replace: true });
      return;
    }
    setHasSeenWelcome(true);
    const t = setTimeout(() => navigate('/home/menu'), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Screen className="items-center justify-center px-6 py-10">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#C1622F]/20 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="relative w-24 h-24 rounded-full bg-white border-3 border-[#1A1A1A] flex items-center justify-center shadow-xl">
            <MemoraLogo size={56} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold tracking-wide text-[#888] mb-2">WELCOME BACK</p>
          <h1 className="text-4xl font-bold text-[#8B3A2A]">
            {userName}! 🌸
          </h1>
        </div>
        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#C1622F]"
              style={{ animation: `bounceDot 0.8s ${i * 0.18}s infinite alternate` }}
            />
          ))}
        </div>
        <style>{`@keyframes bounceDot { from { transform: translateY(0); opacity:0.5; } to { transform: translateY(-10px); opacity:1; } }`}</style>
      </div>
    </Screen>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function Dashboard() {
  const navigate = useNavigate();
  const { userName, streak, stories, gardenFlowers } = useApp();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening';

  return (
    <Screen withNav withSaathi className="pt-0">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#8B3A2A] via-[#C1622F] to-[#D97706] px-5 pt-12 pb-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-4 right-4 opacity-20 text-6xl">🌸</div>
        <div className="absolute bottom-2 left-6 opacity-15 text-4xl rotate-12">✨</div>
        <div className="absolute top-8 left-1/2 opacity-10 text-5xl">🌿</div>

        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-white/70 text-sm font-semibold">{greeting}</p>
            <h1 className="text-[28px] font-extrabold text-white leading-tight">{userName}!</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <img
              src="memora/grandma_pfp.png"
              alt="Meena"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
            />
            <StreakBadge streak={streak} />
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 text-center">
            <p className="text-white font-extrabold text-lg">{stories.length}</p>
            <p className="text-white/70 text-xs font-bold">Stories</p>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 text-center">
            <p className="text-white font-extrabold text-lg">{gardenFlowers}</p>
            <p className="text-white/70 text-xs font-bold">Flowers</p>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 text-center">
            <p className="text-white font-extrabold text-lg">{streak}</p>
            <p className="text-white/70 text-xs font-bold">Day Streak</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#1A1A1A]">What would you like to do?</h2>

        {/* Stories card */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => navigate('/stories')}
          className="relative overflow-hidden w-full flex items-center gap-5 px-5 py-5 bg-white rounded-3xl border-2 border-[#D4CFC0] hover:border-[#C1622F] hover:shadow-lg transition-all group text-left shadow-sm"
        >
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FEF3C7]/60 to-transparent rounded-3xl" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FBBF24] flex items-center justify-center shadow-md flex-shrink-0 border border-[#F59E0B]/30">
            <BookOpen size={26} color="#92400E" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1A1A1A] text-lg">Share Stories</p>
            <p className="text-sm text-[#888] mt-0.5">Record memories & wisdom</p>
            {stories.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={10} fill="#F59E0B" color="#F59E0B" />
                <span className="text-xs text-[#888]">{stories.length} stories shared</span>
              </div>
            )}
          </div>
          <ChevronRight size={20} color="#C1622F" className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </motion.button>

        {/* Games card */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/games')}
          className="relative overflow-hidden w-full flex items-center gap-5 px-5 py-5 bg-white rounded-3xl border-2 border-[#D4CFC0] hover:border-[#7B9EC8] hover:shadow-lg transition-all group text-left shadow-sm"
        >
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#EFF6FF]/60 to-transparent rounded-3xl" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DBEAFE] to-[#7B9EC8] flex items-center justify-center shadow-md flex-shrink-0 border border-[#7B9EC8]/30">
            <Puzzle size={26} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1A1A1A] text-lg">Play Games</p>
            <p className="text-sm text-[#888] mt-0.5">Daily missions with family</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-xs text-[#888]">{gardenFlowers} flowers in your garden</span>
            </div>
          </div>
          <ChevronRight size={20} color="#7B9EC8" className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </motion.button>

        {/* Daily tip card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] rounded-2xl border border-[#86EFAC] p-4 flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A] text-sm">Today's Tip</p>
            <p className="text-xs text-[#888] mt-0.5">Sharing just one memory a week can help younger generations feel 3x more connected to their roots 🌱</p>
          </div>
        </motion.div>
      </div>
    </Screen>
  );
}

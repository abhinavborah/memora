import React, { useState, useEffect, useRef } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router';
import { Home, BookOpen, Gamepad2, User, Flame, Mic } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Card as ShadcnCard } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';

// ─── Memora Logo ──────────────────────────────────────────────────────────────
export function MemoraLogo({ size = 64 }: { size?: number }) {
  return (
    <img
      src="memora/memora-logo.svg"
      alt="Memora"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

// ─── Screen Wrapper ───────────────────────────────────────────────────────────
export function Screen({ children, withNav = false, withSaathi = false, className = '' }) {
  return (
    <div className="min-h-screen bg-[#EDE8DC] flex justify-center">
      <div className={`w-full flex flex-col ${withNav ? 'pb-24' : ''} ${className}`}>
        {children}
      </div>
      {withNav && <BottomNav />}
      {withSaathi && <SaathiFab />}
    </div>
  );
}

// ─── Buttons ──────────────────────────────────────────────────────────────────
export function PrimaryBtn({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <Button
      onClick={onClick}
      className={`w-full bg-[#C1622F] hover:bg-[#A85426] text-white font-bold text-base rounded-2xl py-6 h-auto ${className}`}
    >
      {children}
    </Button>
  );
}

export function SecondaryBtn({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className={`w-full bg-[#7B9EC8] hover:bg-[#6A8DB7] text-white font-bold text-base rounded-2xl py-6 h-auto ${className}`}
    >
      {children}
    </Button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ShadcnCard className={`bg-white rounded-2xl shadow-md border-0 ${className}`}>
      {children}
    </ShadcnCard>
  );
}

// ─── Step Item ────────────────────────────────────────────────────────────────
export function StepItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-[#C1622F] text-white flex items-center justify-center font-extrabold text-lg shrink-0">
        {number}
      </div>
      <div>
        <p className="font-bold text-[#1A1A1A] text-base">{title}</p>
        <p className="text-[#888] text-sm mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Streak Badge ─────────────────────────────────────────────────────────────
export function StreakBadge({ streak }: { streak: number }) {
  return (
    <Badge className="bg-[#F4C430] text-[#1A1A1A] font-bold text-xs px-2 py-0.5 rounded-full hover:bg-[#F4C430]">
      <Flame size={14} className="mr-1" />
      {streak} day streak
    </Badge>
  );
}

// ─── Avatar Circle ────────────────────────────────────────────────────────────
export function AvatarCircle({ name, image, size = 48 }: { name: string; image?: string; size?: number }) {
  return (
    <Avatar style={{ width: size, height: size }} className="border-2 border-[#D4CFC0]">
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="bg-[#C1622F] text-white font-bold text-sm">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ progress, className = '' }: { progress: number; className?: string }) {
  return (
    <Progress
      value={progress}
      className={`h-2 bg-[#7B9EC8]/20 ${className}`}
    />
  );
}

// ─── Saathi Avatar ────────────────────────────────────────────────────────────
export function SaathiAvatar({ size = 48 }: { size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden border-2 border-[#7B9EC8] bg-[#7B9EC8]"
      style={{ width: size, height: size }}
    >
      <img
        src="memora/saathi.png"
        alt="Saathi"
        width={size}
        height={size}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// ─── Saathi FAB ───────────────────────────────────────────────────────────────
export function SaathiFab() {
  const navigate = useNavigate();
  const { saathiCorner, setSaathiCorner } = useApp();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [wasDragged, setWasDragged] = useState(false);
  const hasPositioned = useRef(false);

  const buttonSize = 56;
  const padding = 16;
  const bottomOffset = 96; // matches bottom-24, stays above navbar

  const getConstraints = () => {
    if (typeof window === 'undefined') {
      return { left: -300, right: 0, top: -600, bottom: 0 };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
      left: -(vw - buttonSize - padding * 2),
      right: 0,
      top: -(vh - buttonSize - bottomOffset - padding),
      bottom: 0,
    };
  };

  const getCornerPosition = (corner: string) => {
    const c = getConstraints();
    switch (corner) {
      case 'top-left': return { x: c.left, y: c.top };
      case 'top-right': return { x: 0, y: c.top };
      case 'bottom-left': return { x: c.left, y: 0 };
      case 'bottom-right': return { x: 0, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  // Set initial position on mount (no animation on page switches)
  useEffect(() => {
    if (!hasPositioned.current) {
      const target = getCornerPosition(saathiCorner);
      x.set(target.x);
      y.set(target.y);
      hasPositioned.current = true;
    }
  }, [saathiCorner]);

  const handleDrag = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
      setWasDragged(true);
    }
  };

  const handleDragEnd = () => {
    const c = getConstraints();
    const currentX = x.get();
    const currentY = y.get();

    // Find closest corner
    const corners = [
      { name: 'top-left', x: c.left, y: c.top },
      { name: 'top-right', x: 0, y: c.top },
      { name: 'bottom-left', x: c.left, y: 0 },
      { name: 'bottom-right', x: 0, y: 0 },
    ];

    const closest = corners.reduce((best, corner) => {
      const dist = Math.hypot(currentX - corner.x, currentY - corner.y);
      return dist < best.dist ? { ...corner, dist } : best;
    }, { name: 'bottom-right', x: 0, y: 0, dist: Infinity });

    // Animate to closest corner
    animate(x, closest.x, { type: 'spring', stiffness: 300, damping: 30 });
    animate(y, closest.y, { type: 'spring', stiffness: 300, damping: 30 });
    setSaathiCorner(closest.name as any);

    setTimeout(() => setWasDragged(false), 100);
  };

  const handleClick = () => {
    if (!wasDragged) navigate('/saathi');
  };

  return (
    <motion.button
      drag
      dragConstraints={getConstraints()}
      dragElastic={0.1}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{ x, y }}
      whileTap={{ scale: wasDragged ? 1 : 0.9 }}
      className="fixed bottom-24 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 overflow-hidden cursor-grab active:cursor-grabbing bg-[#7B9EC8]"
    >
      <img
        src="memora/saathi.png"
        alt="Saathi"
        className="w-full h-full object-cover pointer-events-none"
      />
    </motion.button>
  );
}

// ─── Recording Button ─────────────────────────────────────────────────────────
export function RecordingButton({ isRecording, onPress, size }: { isRecording: boolean; onPress: () => void; size: number }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onPress}
      className={`rounded-full flex items-center justify-center shadow-lg ${
        isRecording ? 'bg-[#DC2626]' : 'bg-[#C1622F]'
      }`}
      style={{ width: size, height: size }}
    >
      {isRecording ? (
        <div className="bg-white rounded-sm" style={{ width: size * 0.28, height: size * 0.28 }} />
      ) : (
        <Mic size={size * 0.4} color="white" />
      )}
    </motion.button>
  );
}

// ─── Waveform ─────────────────────────────────────────────────────────────────
export function Waveform({ playing = false }: { playing?: boolean }) {
  const [heights, setHeights] = React.useState(() =>
    Array.from({ length: 24 }, () => Math.random() * 20 + 8)
  );

  React.useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setHeights(Array.from({ length: 24 }, () => Math.random() * 20 + 8));
    }, 150);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {heights.map((h, i) => (
        <div
          key={i}
          className="rounded-full bg-[#C1622F]"
          style={{
            width: 3,
            height: h,
            transition: 'height 0.15s ease',
            opacity: 0.6 + (i % 4) * 0.1,
          }}
        />
      ))}
    </div>
  );
}

// ─── Flower Garden ────────────────────────────────────────────────────────────
export function FlowerGarden({ count }: { count: number }) {
  const flowers = ['🌸', '🌼', '🌺', '🌻', '🌷', '💐', '🏵️', '🪷'];
  const positions = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      left: `${(i % 4) * 25 + 10}%`,
      top: `${Math.floor(i / 4) * 33 + 15}%`,
      scale: 0.7 + Math.random() * 0.5,
      rotate: Math.random() * 30 - 15,
    }));
  }, []);

  const flowerImage = count === 3 ? 'memora/flower3.jpg' : count === 4 ? 'memora/flower4.jpg' : null;

  return (
    <div className="relative bg-gradient-to-b from-[#F0F9E8] to-[#E8F5E0] rounded-2xl border-2 border-[#D4CFC0] overflow-hidden">
      {flowerImage ? (
        <img
          src={flowerImage}
          alt={`Garden with ${count} flowers`}
          className="w-full h-auto object-contain"
        />
      ) : (
        positions.map((pos, i) => (
          <div
            key={i}
            className="absolute transition-opacity duration-500"
            style={{
              left: pos.left,
              top: pos.top,
              transform: `scale(${pos.scale}) rotate(${pos.rotate}deg)`,
              opacity: i < count ? 1 : 0.15,
              fontSize: 24,
            }}
          >
            {flowers[i % flowers.length]}
          </div>
        ))
      )}
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home, label: 'Home', path: '/home/menu' },
    { icon: BookOpen, label: 'Stories', path: '/stories' },
    { icon: Gamepad2, label: 'Games', path: '/games' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const active = (path: string) => {
    if (path === '/home/menu') {
      return location.pathname === '/home/menu' || location.pathname === '/home';
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-[#D4CFC0] flex justify-around py-3 pb-6 z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {tabs.map((t) => (
        <button
          key={t.label}
          onClick={() => navigate(t.path)}
          className={`flex flex-col items-center gap-1 transition-colors ${active(t.path) ? 'text-[#C1622F]' : 'text-[#888]'}`}
        >
          <t.icon size={22} strokeWidth={active(t.path) ? 2.5 : 2} />
          <span className="text-xs font-bold">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

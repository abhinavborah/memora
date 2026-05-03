import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Plus, Sparkles, X, Play, Pause, RotateCcw,
  Share2, CheckCircle2, Film, ImagePlus,   Volume2, VolumeX, ChevronRight,
  Mic, Clock, Download, Keyboard,
} from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaCommentDots, FaEnvelope } from 'react-icons/fa';
import { Screen, RecordingButton } from './Shared';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

// ─── Art style constants ───────────────────────────────────────────────────────
const ANIME_IMG = 'https://images.unsplash.com/photo-1599797574782-fd636bdb5cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const PIXAR_IMG = 'https://images.unsplash.com/photo-1637607698822-0d9a86b468c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const SKETCH_IMG = 'https://images.unsplash.com/photo-1735084447468-0b37315c712c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const OIL_IMG   = 'https://images.unsplash.com/photo-1751031388293-f043b8eb9832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';

const ART_STYLES = [
  { id: 'anime',  label: 'Anime',     img: ANIME_IMG,  emoji: '🌸' },
  { id: 'pixar',  label: 'Pixar 3D',  img: PIXAR_IMG,  emoji: '✨' },
  { id: 'sketch', label: 'Sketch',    img: SKETCH_IMG, emoji: '✏️' },
  { id: 'oil',    label: 'Oil Paint', img: OIL_IMG,    emoji: '🎨' },
];
const STYLE_LABEL: Record<string, string> = {
  anime: 'Anime', pixar: 'Pixar 3D', sketch: 'Sketch', oil: 'Oil Paint',
};

const SAMPLE_TRANSCRIPT = `Yesterday, I went on a walk to the nearby garden, where I saw a beautiful flower. As I approached closer to smell it, I see a bee flying towards me. I had to flee from there haha!`;

// ─── Canvas-based video generation ────────────────────────────────────────────

/** Draw a styled background frame on canvas (no external images needed) */
function drawStyledBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  style: string,
  progress: number, // 0-1 animation progress
  sceneIndex: number,
) {
  ctx.clearRect(0, 0, w, h);

  if (style === 'sketch') {
    // Aged paper
    ctx.fillStyle = '#F2ECE0';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(80,60,40,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w + h; i += 12) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(0, i); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(60,40,20,0.25)';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, w - 48, h - 48);
  } else if (style === 'anime') {
    // Pastel sunset gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0,   `hsl(${350 + sceneIndex * 15},70%,78%)`);
    sky.addColorStop(0.55,`hsl(${20  + sceneIndex * 10},80%,65%)`);
    sky.addColorStop(1,   `hsl(${280 + sceneIndex * 10},40%,30%)`);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    // Animated sun
    const sunX = w * (0.5 + progress * 0.2);
    const sunY = h * (0.3 - progress * 0.05);
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 120);
    sunGlow.addColorStop(0, 'rgba(255,250,200,0.95)');
    sunGlow.addColorStop(0.3, 'rgba(255,200,100,0.6)');
    sunGlow.addColorStop(1, 'rgba(255,100,50,0)');
    ctx.fillStyle = sunGlow; ctx.beginPath(); ctx.arc(sunX, sunY, 120, 0, Math.PI * 2); ctx.fill();
    // Ground
    ctx.fillStyle = '#1E3A12'; ctx.fillRect(0, h * 0.72, w, h * 0.28);
    // Trees
    for (let t = 0; t < 6; t++) {
      const tx = w * (0.08 + t * 0.17);
      ctx.fillStyle = '#0F2009';
      ctx.beginPath(); ctx.moveTo(tx, h * 0.72); ctx.lineTo(tx - 35, h * 0.35); ctx.lineTo(tx + 35, h * 0.35); ctx.closePath(); ctx.fill();
    }
  } else if (style === 'pixar') {
    // Bright rolling hills
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, `hsl(${210 + sceneIndex * 8},85%,72%)`);
    sky.addColorStop(1, `hsl(${190 + sceneIndex * 8},60%,90%)`);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    // Clouds
    for (let c = 0; c < 4; c++) {
      const cx = (w * (0.15 + c * 0.25) + progress * 40) % (w + 60);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(cx, h * 0.18, 45, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 50, h * 0.2, 35, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 25, h * 0.12, 40, 0, Math.PI * 2); ctx.fill();
    }
    // Green hills
    ctx.fillStyle = '#5BB542';
    ctx.beginPath(); ctx.moveTo(0, h); ctx.bezierCurveTo(w * 0.3, h * 0.55, w * 0.6, h * 0.65, w, h * 0.58); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4A9E34';
    ctx.beginPath(); ctx.moveTo(0, h * 0.72); ctx.bezierCurveTo(w * 0.25, h * 0.6, w * 0.75, h * 0.68, w, h * 0.62); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
  } else {
    // Oil Paint: warm golden palette
    const oil = ctx.createLinearGradient(0, 0, w * 0.7, h);
    oil.addColorStop(0, `hsl(${35 + sceneIndex * 10},75%,55%)`);
    oil.addColorStop(0.4, `hsl(${20 + sceneIndex * 8},70%,45%)`);
    oil.addColorStop(1, `hsl(${10 + sceneIndex * 5},60%,30%)`);
    ctx.fillStyle = oil; ctx.fillRect(0, 0, w, h);
    // Texture strokes
    ctx.globalAlpha = 0.07;
    for (let s = 0; s < 40; s++) {
      const sx = (s * 137) % w;
      const sy = (s * 97) % h;
      ctx.strokeStyle = s % 2 === 0 ? '#FDE68A' : '#92400E';
      ctx.lineWidth = 6 + (s % 4);
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 80, sy + 15); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

/** Cover-crop helper */
function getCoverCrop(img: HTMLImageElement, tw: number, th: number) {
  const ia = img.naturalWidth / img.naturalHeight;
  const ta = tw / th;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (ia > ta) { sw = img.naturalHeight * ta; sx = (img.naturalWidth - sw) / 2; }
  else         { sh = img.naturalWidth / ta;  sy = (img.naturalHeight - sh) / 2; }
  return { sx, sy, sw, sh };
}

/** Wrap text to fit maxWidth */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

type ProgressCallback = (step: number, pct: number) => void;

/**
 * Generates a real WebM video using HTML5 Canvas + MediaRecorder.
 * Falls back to null if not supported.
 */
async function generateVideoBlob(
  photos: string[],
  artStyle: string,
  transcript: string,
  onProgress: ProgressCallback,
): Promise<string | null> {
  const W = 1280, H = 720, FPS = 24;
  const SEC_PER_SCENE = 3.5; // seconds per photo / scene

  // ── Step 1: Load images ────────────────────────────────────────────────────
  onProgress(0, 5);
  const loadImg = (src: string): Promise<HTMLImageElement> =>
    new Promise(resolve => {
      const img = new Image();
      // data: URLs are always same-origin; no crossOrigin needed
      if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback 1×1 transparent image
        const fb = new Image(); fb.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        resolve(fb);
      };
      img.src = src;
    });

  const photoImages = photos.length > 0 ? await Promise.all(photos.map(loadImg)) : [];
  const sceneCount  = Math.max(photoImages.length, 3); // at least 3 scenes
  onProgress(0, 15);

  // ── Step 2: Prepare canvas ─────────────────────────────────────────────────
  onProgress(1, 20);
  const canvas  = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx     = ctx2d(canvas);
  if (!ctx) return null;

  // ── Step 3: Check MediaRecorder support ───────────────────────────────────
  onProgress(2, 25);
  if (typeof MediaRecorder === 'undefined' || !canvas.captureStream) {
    // Not supported — return null so caller can fall back to slideshow
    return null;
  }

  const mimeType =
    ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
      .find(t => MediaRecorder.isTypeSupported(t)) ?? 'video/webm';

  return new Promise<string | null>(resolve => {
    const stream   = canvas.captureStream(FPS);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_000_000 });
    const chunks: Blob[] = [];

    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(URL.createObjectURL(blob));
    };
    recorder.onerror = () => resolve(null);

    recorder.start(200); // collect data every 200 ms
    onProgress(3, 30);

    const totalFrames = sceneCount * SEC_PER_SCENE * FPS;
    const words = transcript.replace(/["""]/g, '').split(/\s+/);
    const artFilter: Record<string, string> = {
      anime:  'saturate(180%) hue-rotate(12deg)',
      sketch: 'grayscale(75%) contrast(135%)',
      oil:    'saturate(140%) contrast(108%)',
      pixar:  'saturate(155%) brightness(106%)',
    };

    let frame = 0;

    const renderNext = () => {
      const sceneIdx     = Math.min(Math.floor(frame / (SEC_PER_SCENE * FPS)), sceneCount - 1);
      const localT       = (frame % (SEC_PER_SCENE * FPS)) / (SEC_PER_SCENE * FPS); // 0-1
      const photo        = photoImages[sceneIdx % Math.max(photoImages.length, 1)];

      // ── Draw background ──────────────────────────────────────────────────
      if (photo && photo.naturalWidth > 1) {
        // Ken Burns: zoom in + gentle pan
        const zoom = 1.05 + localT * 0.10;
        const panX = (sceneIdx % 2 === 0 ?  localT : 1 - localT) * 30;
        const panY = (sceneIdx % 3  < 2  ?  localT : -localT)    * 15;
        ctx.filter = artFilter[artStyle] ?? 'none';
        ctx.save();
        ctx.translate(W / 2 + panX, H / 2 + panY);
        ctx.scale(zoom, zoom);
        const { sx, sy, sw, sh } = getCoverCrop(photo, W, H);
        ctx.drawImage(photo, sx, sy, sw, sh, -W / 2, -H / 2, W, H);
        ctx.restore();
        ctx.filter = 'none';
      } else {
        drawStyledBackground(ctx, W, H, artStyle, localT, sceneIdx);
      }

      // ── Dark vignette overlay ────────────────────────────────────────────
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

      // ── Bottom gradient for caption ──────────────────────────────────────
      const bg = ctx.createLinearGradient(0, H * 0.60, 0, H);
      bg.addColorStop(0, 'rgba(0,0,0,0)');
      bg.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // ── Transcript caption ───────────────────────────────────────────────
      const pct      = frame / totalFrames;
      const wordIdx  = Math.round(pct * words.length);
      const snippet  = words.slice(Math.max(0, wordIdx - 8), wordIdx + 1).join(' ');
      if (snippet.trim()) {
        ctx.font      = 'bold 38px Arial, Helvetica, sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 14;
        ctx.fillStyle   = '#FFFDE7';
        const lines = wrapText(ctx, `"${snippet}…"`, W - 120);
        lines.forEach((line, li) => ctx.fillText(line, W / 2, H - 60 - li * 46));
        ctx.shadowBlur = 0;
      }

      // ── Memora watermark ─────────────────────────────────────────────────
      ctx.font      = '22px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillText('✨ Memora', W - 24, 40);

      // ── Scene label ──────────────────────────────────────────────────────
      const styleInfo = ART_STYLES.find(s => s.id === artStyle);
      if (styleInfo) {
        ctx.font      = 'bold 20px Arial, Helvetica, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText(`${styleInfo.emoji} ${styleInfo.label}`, 24, 42);
      }

      frame++;
      // Report progress in range 30-95%
      onProgress(3, 30 + Math.round((frame / totalFrames) * 65));

      if (frame < totalFrames) {
        setTimeout(renderNext, 1000 / FPS);
      } else {
        onProgress(5, 98);
        // Give recorder a moment to flush remaining data
        setTimeout(() => recorder.stop(), 400);
      }
    };

    renderNext();
  });
}

function ctx2d(canvas: HTMLCanvasElement) {
  try { return canvas.getContext('2d'); } catch { return null; }
}

// ─── Share Your Wisdom ─────────────────────────────────────────────────────────
export function ShareWisdom() {
  const navigate = useNavigate();
  const { stories, setActiveTranscript } = useApp();
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('create');

  return (
    <Screen withNav withSaathi className="pt-0">
      <div className="relative bg-gradient-to-br from-[#C1622F] via-[#8B3A2A] to-[#1A1A1A] px-5 pt-10 pb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {['✨','🌸','📖','🎙️','💛','🌿'].map((e, i) => (
            <span key={i} className="absolute text-2xl"
              style={{ top: `${10 + i*14}%`, left: `${5 + i*16}%`, transform: `rotate(${i*30}deg)` }}>{e}</span>
          ))}
        </div>
        <h2 className="text-[26px] font-bold text-white leading-tight mt-2">Share Your Wisdom</h2>
        <p className="text-white/70 mt-1 text-sm">Life lessons for your family</p>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'create' | 'library')} className="mt-4">
          <TabsList className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-1 h-auto">
            <TabsTrigger value="create" className="flex-1 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-lg text-white/80 py-2">
              + Create New
            </TabsTrigger>
            <TabsTrigger value="library" className="flex-1 rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-lg text-white/80 py-2">
              My Stories
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 px-5 pt-5 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'create' | 'library')}>
          <TabsContent value="create" className="mt-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="flex flex-col items-center gap-4 py-6">
                <p className="text-xs tracking-wide font-semibold text-[#888]">Tap the mic to start</p>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#C1622F]/20 animate-ping" style={{ animationDuration: '2s' }} />
                  <RecordingButton isRecording={false} onPress={() => navigate('/recording')} size={100} />
                </div>
                <p className="tracking-wide font-bold text-[#1A1A1A] text-sm">Begin recording</p>
                <button
                  onClick={() => { setActiveTranscript(''); navigate('/stories/review'); }}
                  className="flex items-center gap-2 text-sm font-semibold text-[#7B9EC8] hover:text-[#C1622F] transition-colors mt-1"
                >
                  <Keyboard size={16} />
                  Or type your story
                </button>
              </div>
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-[#D4CFC0]" />
                <span className="text-xs font-semibold text-[#888] tracking-wide">OR CONTINUE</span>
                <div className="flex-1 h-px bg-[#D4CFC0]" />
              </div>
              {stories.length > 0 && (
                <button onClick={() => navigate('/stories/review')}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-[#D4CFC0] hover:border-[#C1622F] transition-all shadow-sm hover:shadow-md group">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FCD34D] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles size={24} color="#92400E" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-[#1A1A1A] text-base">{stories[0].title}</p>
                    <p className="text-xs text-[#888] mt-0.5">Draft • {stories[0].daysAgo} days ago</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span className="text-xs text-[#888]">Tap to continue editing</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#C1622F" className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </motion.div>
          </TabsContent>
          <TabsContent value="library" className="mt-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <StoriesLibrary stories={stories} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  );
}

// ─── Stories Library ───────────────────────────────────────────────────────────
function StoriesLibrary({ stories }: { stories: any[] }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3 pb-6">
      {stories.map((story, i) => (
        <motion.button key={story.id}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
          onClick={() => navigate('/stories/preview')}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-[#D4CFC0] hover:border-[#C1622F] transition-all shadow-sm hover:shadow-md text-left group">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
            <img src={ART_STYLES.find(s => s.id === story.artStyle)?.img ?? ANIME_IMG}
              alt={story.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-end p-1">
              <span className="bg-black/50 text-white text-xs px-1 py-0.5 rounded font-semibold backdrop-blur-sm">
                {STYLE_LABEL[story.artStyle ?? 'anime'] ?? 'Anime'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1A1A1A] text-base truncate">{story.title}</p>
            <p className="text-xs text-[#888] mt-0.5">{story.daysAgo} days ago</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {story.videoReady ? (
                <Badge variant="outline" className="flex items-center gap-1 text-xs font-semibold text-[#10B981] bg-[#D1FAE5] border-[#86EFAC] px-2 py-0.5 rounded-full">
                  <Film size={9} /> Video Ready
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1 text-xs font-semibold text-[#F59E0B] bg-[#FEF3C7] border-[#FDE68A] px-2 py-0.5 rounded-full">
                  <Clock size={9} /> Processing
                </Badge>
              )}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#F5F1E8] border border-[#D4CFC0] flex items-center justify-center group-hover:bg-[#C1622F] group-hover:border-[#C1622F] transition-colors">
            <Play size={14} color="#1A1A1A" className="group-hover:hidden" />
            <Play size={14} color="white"   className="hidden group-hover:block" />
          </div>
        </motion.button>
      ))}
      <button className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#C8C3B4] text-[#888] hover:border-[#C1622F] hover:text-[#C1622F] transition-all">
        <Plus size={18} />
        <span className="text-sm font-bold">Record a new story</span>
      </button>
    </div>
  );
}

// ─── Recording Active ──────────────────────────────────────────────────────────
export function RecordingActive() {
  const navigate = useNavigate();
  const { setActiveTranscript } = useApp();
  const [transcript, setTranscript]   = useState('');
  const [charIndex, setCharIndex]     = useState(0);
  const [elapsed, setElapsed]         = useState(0);
  const [bars, setBars]               = useState<number[]>(Array(32).fill(20));

  useEffect(() => {
    if (charIndex < SAMPLE_TRANSCRIPT.length) {
      const t = setTimeout(() => {
        setTranscript(SAMPLE_TRANSCRIPT.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 28);
      return () => clearTimeout(t);
    }
  }, [charIndex]);

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBars(prev => prev.map(() => 15 + Math.random() * 50)), 120);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleStop = () => {
    setActiveTranscript(transcript || SAMPLE_TRANSCRIPT);
    navigate('/stories/review');
  };

  return (
    <Screen withNav withSaathi className="pt-0">
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#2D2D2D] px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/stories')}><ArrowLeft size={22} color="white" /></button>
          <div className="flex items-center gap-2 bg-[#DC2626]/20 border border-[#DC2626]/40 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            <span className="text-white text-xs font-bold">REC {fmt(elapsed)}</span>
          </div>
          <div className="w-6" />
        </div>
        <div className="text-center mb-4">
          <h2 className="text-[22px] font-bold text-white">Share Your Wisdom</h2>
          <p className="text-white/50 text-sm mt-0.5">Life lessons for your family</p>
        </div>
        <div className="flex items-center justify-center gap-[3px] h-16 px-2 mb-4">
          {bars.map((h, i) => (
            <div key={i} className="rounded-full bg-[#C1622F]"
              style={{ width: 4, height: h, transition: 'height 0.1s ease', opacity: 0.7 + (i%3)*0.1 }} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs tracking-wide font-semibold text-white/60">TAP TO STOP RECORDING</p>
          <RecordingButton isRecording={true} onPress={handleStop} size={90} />
        </div>
      </div>
      <div className="flex-1 px-5 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Mic size={14} color="#888" />
          <p className="text-xs font-semibold text-[#888] tracking-wide">LIVE TRANSCRIPT</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#D4CFC0] p-4 min-h-[140px]">
          <p className="text-[#1A1A1A] leading-relaxed text-sm">
            {transcript}
            <span className="inline-block w-0.5 h-4 bg-[#C1622F] ml-0.5 animate-pulse align-middle" />
          </p>
        </div>
        <p className="text-center text-xs text-[#888] mt-2">AI is transcribing in real time…</p>
      </div>
    </Screen>
  );
}

// ─── Transcription Review ──────────────────────────────────────────────────────
export function TranscriptionReview() {
  const navigate = useNavigate();
  const { activeTranscript, setActiveTranscript } = useApp();
  const [text, setText]           = useState(activeTranscript || SAMPLE_TRANSCRIPT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  }, [text]);

  return (
    <Screen withNav withSaathi className="px-5 pt-5">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)}><ArrowLeft size={24} color="#1A1A1A" /></button>
        <div className="text-center">
          <p className="text-xs font-semibold text-[#888] tracking-wide">STEP 2 OF 4</p>
          <p className="text-sm font-bold text-[#1A1A1A]">Review Transcript</p>
        </div>
        <div className="w-6" />
      </div>
      <div className="flex gap-1.5 mb-6">
        {[1,2,3,4].map(n => <div key={n} className={`flex-1 h-1.5 rounded-full ${n<=2?'bg-[#C1622F]':'bg-[#D4CFC0]'}`} />)}
      </div>
      <div className="flex flex-col items-center gap-2 mb-4">
        <p className="text-xs tracking-wide font-semibold text-[#888]">TAP TO RE-RECORD</p>
                <RecordingButton isRecording={false} onPress={() => navigate('/recording')} size={70} />
      </div>
      <div className="bg-white rounded-2xl border-2 border-[#D4CFC0] p-4 mb-3 flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#888] tracking-wide">TRANSCRIPTION</p>
          <span className="text-xs text-[#888]">{wordCount} words</span>
        </div>
        <Textarea value={text} onChange={e => setText(e.target.value)}
          className="w-full h-44 text-sm text-[#1A1A1A] leading-relaxed bg-transparent border-0 shadow-none focus-visible:ring-0 resize-none p-0"
          placeholder="Your transcript will appear here..." />
      </div>
      <div className="bg-[#FEF9EC] border border-[#FCD34D] rounded-xl px-3 py-2 mb-4 flex items-start gap-2">
        <span className="text-base">💡</span>
        <p className="text-xs text-[#92400E]">Edit the text above to fix any mistakes before generating your video.</p>
      </div>
      <div className="flex items-center gap-3 pb-4">
        <button onClick={() => setIsPlaying(!isPlaying)}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isPlaying?'bg-[#C1622F] border-[#C1622F]':'bg-[#F5F1E8] border-[#D4CFC0]'}`}>
          <Volume2 size={20} color={isPlaying?'white':'#888'} />
        </button>
        <button onClick={() => { setActiveTranscript(text); navigate('/stories/style'); }}
          className="flex-1 py-4 rounded-2xl bg-[#1A1A1A] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#C1622F] transition-colors">
          Next: Add Photos <ChevronRight size={16} />
        </button>
      </div>
    </Screen>
  );
}

// ─── Art Style Select (real photo upload) ────────────────────────────────────
export function ArtStyleSelect() {
  const navigate = useNavigate();
  const { uploadedPhotos, setUploadedPhotos, selectedArtStyle, setSelectedArtStyle } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    Promise.all(
      files.map(f => new Promise<string>(res => {
        const r = new FileReader();
        r.onload = ev => res(ev.target?.result as string);
        r.readAsDataURL(f);
      }))
    ).then(results => setUploadedPhotos([...uploadedPhotos, ...results].slice(0, 8)));
    e.target.value = '';
  }, [uploadedPhotos, setUploadedPhotos]);

  const removePhoto = (idx: number) => setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx));

  return (
    <Screen withNav withSaathi className="px-5 pt-5">
      <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate('/stories/review')}><ArrowLeft size={24} color="#1A1A1A" /></button>
        <div className="text-center">
          <p className="text-xs font-semibold text-[#888] tracking-wide">STEP 3 OF 4</p>
          <p className="text-sm font-bold text-[#1A1A1A]">Craft Your Story</p>
        </div>
        <div className="w-6" />
      </div>

      <div className="flex gap-1.5 mb-5">
        {[1,2,3,4].map(n => <div key={n} className={`flex-1 h-1.5 rounded-full ${n<=3?'bg-[#C1622F]':'bg-[#D4CFC0]'}`} />)}
      </div>

      {/* Photo Upload */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-[#1A1A1A]">📸 Add Your Photos</p>
          <p className="text-xs text-[#888]">{uploadedPhotos.length}/8</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {uploadedPhotos.map((src, i) => (
            <div key={i} className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-[#D4CFC0] flex-shrink-0">
              <img src={src} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
              <button onClick={() => removePhoto(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                <X size={10} color="white" />
              </button>
            </div>
          ))}
          {uploadedPhotos.length < 8 && (
            <button onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed border-[#C8C3B4] flex flex-col items-center justify-center gap-1 bg-white hover:border-[#C1622F] hover:bg-[#FFF5F1] transition-colors flex-shrink-0 ${uploadedPhotos.length === 0 ? 'w-[80%] h-32 mx-auto' : 'w-[72px] h-[72px]'}`}>
              <ImagePlus size={uploadedPhotos.length === 0 ? 32 : 20} color="#C8C3B4" />
              <span className={`font-semibold text-[#C8C3B4] ${uploadedPhotos.length === 0 ? 'text-sm' : 'text-xs'}`}>Add</span>
            </button>
          )}
        </div>
        {uploadedPhotos.length === 0 && (
          <p className="text-xs text-[#888] mt-2 italic text-center">
            Photos optional — we'll generate beautiful AI art scenes if you skip ✨
          </p>
        )}
      </div>

      {/* Art Style */}
      <div className="bg-gradient-to-r from-[#FEF9EC] to-[#FFF5F1] rounded-2xl px-4 py-2.5 mb-3 border border-[#F5D88A]">
        <p className="font-bold text-[#1A1A1A] text-sm tracking-wide text-center">🎨 Choose Video Art Style</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {ART_STYLES.map(({ id, label, img }) => (
          <button key={id} onClick={() => setSelectedArtStyle(id)}
            className={`relative flex flex-col p-0.5 rounded-2xl transition-all ${selectedArtStyle===id?'ring-[3px] ring-[#C1622F] ring-offset-1 scale-[1.03] shadow-xl':'opacity-80 hover:opacity-100'}`}>
            <div className="w-full aspect-square rounded-[14px] overflow-hidden">
              <img src={img} alt={label} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-7 left-0 right-0 flex justify-center">
              <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">
                {label}
              </span>
            </div>
            {selectedArtStyle === id && (
              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#C1622F] flex items-center justify-center shadow-lg">
                <CheckCircle2 size={16} color="white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <button onClick={() => { if (selectedArtStyle) navigate('/stories/preview'); }}
        disabled={!selectedArtStyle}
        className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all flex items-center justify-center gap-2 ${selectedArtStyle?'bg-[#1A1A1A] text-white hover:bg-[#C1622F] active:scale-[0.98]':'bg-[#D4CFC0] text-[#888] cursor-not-allowed'}`}>
        <Sparkles size={18} /> Generate My Video
      </button>
    </Screen>
  );
}

// ─── Video Preview: actual video generation ────────────────────────────────────
const GEN_STEPS = [
  { label: 'Analysing your story…',          icon: '🧠' },
  { label: 'Understanding emotions & themes…', icon: '💭' },
  { label: 'Generating scene compositions…',  icon: '🖼️' },
  { label: 'Rendering frames to video…',      icon: '🎬' },
  { label: 'Encoding final video…',           icon: '✨' },
  { label: 'Video ready!',                    icon: '🎉' },
];

export function VideoPreview() {
  const navigate = useNavigate();
  const { uploadedPhotos, selectedArtStyle, setStories, stories, activeTranscript } = useApp();

  const [phase, setPhase]           = useState<'generating'|'ready'|'error'>('generating');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress]     = useState(0);
  const [videoUrl, setVideoUrl]     = useState<string | null>(null);
  const [sharing, setSharing]       = useState(false);
  const blobRef = useRef<string | null>(null);

  // Kick off real video generation
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // Phase 0-2: fake "thinking" steps (so the UI feels alive)
        for (let i = 0; i < 2; i++) {
          if (cancelled) return;
          setCurrentStep(i);
          setProgress(i * 12);
          await delay(900 + i * 400);
        }
        if (cancelled) return;

        // Phase 3+: real canvas encoding
        setCurrentStep(2);
        setProgress(20);
        await delay(600);

        const url = await generateVideoBlob(
          uploadedPhotos,
          selectedArtStyle || 'anime',
          activeTranscript || SAMPLE_TRANSCRIPT,
          (step, pct) => {
            if (cancelled) return;
            setCurrentStep(Math.min(step, 4));
            setProgress(pct);
          },
        );

        if (cancelled) return;

        if (url) {
          blobRef.current = url;
          setVideoUrl(url);
          setCurrentStep(5);
          setProgress(100);
          await delay(700);
          setPhase('ready');
        } else {
          // MediaRecorder not supported — still show player (slideshow fallback)
          setCurrentStep(5);
          setProgress(100);
          await delay(500);
          setPhase('ready');
        }
      } catch (err) {
        console.error('Video generation failed:', err);
        if (!cancelled) setPhase('error');
      }
    };

    run();
    return () => {
      cancelled = true;
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  if (sharing) return <StoryShare videoUrl={videoUrl} onBack={() => setSharing(false)} />;

  if (phase === 'error') {
    return (
      <Screen className="items-center justify-center px-5">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="text-5xl">😢</div>
          <p className="font-bold text-[#1A1A1A] text-xl">Generation failed</p>
          <p className="text-[#888] text-sm">Your browser may not support video encoding.</p>
          <button onClick={() => navigate('/stories/style')}
            className="px-8 py-3 rounded-2xl bg-[#1A1A1A] text-white font-bold">
            Try Again
          </button>
        </div>
      </Screen>
    );
  }

  if (phase === 'generating') {
    return (
      <Screen className="px-5 pt-5">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
          {/* Animated rings */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {[0,1,2].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-[#C1622F]"
                style={{ inset: 8 + i * 14 }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.5 - i * 0.12, 0.15, 0.5 - i * 0.12],
                }}
                transition={{
                  duration: 2 + i * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />
            ))}
            <motion.div
              className="w-16 h-16 rounded-2xl bg-[#1A1A1A] flex items-center justify-center shadow-xl relative z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Film size={30} color="white" />
            </motion.div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Creating Your Video</h2>
            <p className="text-[#888] text-sm mt-1">
              {uploadedPhotos.length > 0
                ? `Encoding ${uploadedPhotos.length} photo${uploadedPhotos.length>1?'s':''} into video…`
                : 'Generating AI art scenes…'}
            </p>
          </div>

          {/* Step list */}
          <div className="w-full flex flex-col gap-2">
            {GEN_STEPS.map((step, i) => {
              const done   = i < currentStep;
              const active = i === currentStep;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: done||active ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                    ${active ? 'bg-[#FFF5F1] border-[#C1622F] shadow-md'
                    : done  ? 'bg-[#F0FDF4] border-[#86EFAC]'
                    : 'bg-white border-[#D4CFC0]'}`}>
                  <span className="text-xl">{done ? '✅' : step.icon}</span>
                  <span className={`text-sm font-bold flex-1 ${active?'text-[#C1622F]':done?'text-[#16A34A]':'text-[#888]'}`}>
                    {step.label}
                  </span>
                  {active && (
                    <motion.div
                      className="w-3.5 h-3.5 rounded-full border-2 border-[#C1622F] border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-[#888] mb-1.5">
              <span>Rendering progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-[#E8E4DA]" />
            {progress > 25 && (
              <p className="text-center text-xs text-[#888] mt-1.5">
                {progress < 95 ? 'Drawing frames…' : 'Finalising encoding…'}
              </p>
            )}
          </div>
        </div>
      </Screen>
    );
  }

  // Ready phase → actual video player
  return (
    <VideoPlayer
      videoUrl={videoUrl}
      photos={uploadedPhotos}
      artStyle={selectedArtStyle}
      transcript={activeTranscript || SAMPLE_TRANSCRIPT}
      onShare={() => {
        setStories([{
          id: Date.now().toString(), title: 'New Memory',
          daysAgo: 0, transcript: activeTranscript || SAMPLE_TRANSCRIPT,
          artStyle: selectedArtStyle, photos: uploadedPhotos, videoReady: true,
        }, ...stories]);
        setSharing(true);
      }}
      onRegenerate={() => navigate('/stories/style')}
      onBack={() => navigate('/stories/style')}
    />
  );
}

// ─── Video Player ─────────────────────────────────────────────────────────────
const DEMO_VIDEO = '/memora/memora_video_gen_demo.mov';

function VideoPlayer({ videoUrl, photos, artStyle, transcript, onShare, onRegenerate, onBack }: {
  videoUrl: string | null;
  photos: string[];
  artStyle: string;
  transcript: string;
  onShare: () => void;
  onRegenerate: () => void;
  onBack: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted]       = useState(true);
  const [videoAspect, setVideoAspect] = useState<number | null>(null);

  const styleData = ART_STYLES.find(s => s.id === artStyle) ?? ART_STYLES[0];

  // Video time tracking
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const fmtTime = (pct: number, dur: number) => {
    const s = Math.round((pct / 100) * (dur || 84));
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  };

  return (
    <Screen withNav withSaathi className="px-5 pt-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack}><ArrowLeft size={24} color="#1A1A1A" /></button>
        <h2 className="text-xl font-bold text-[#1A1A1A]">Your Story is Ready! 🎉</h2>
        <div className="w-6" />
      </div>

      {/* ── Player ── */}
      <div className="bg-[#0D0D0D] rounded-2xl overflow-hidden shadow-2xl mb-3 relative"
        style={{ aspectRatio: videoAspect ? String(videoAspect) : '16/9' }}>
        <video ref={videoRef} src={DEMO_VIDEO} className="w-full h-full object-contain"
          muted={muted}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={() => {
            const v = videoRef.current;
            if (!v) return;
            setDuration(v.duration ?? 0);
            if (v.videoWidth && v.videoHeight) {
              setVideoAspect(v.videoWidth / v.videoHeight);
            }
          }}
          onEnded={() => setPlaying(false)}
          playsInline />
        <button onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center group">
          <AnimatePresence>
            {!playing && (
              <motion.div key="play"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-2xl">
                <Play size={24} color="white" className="ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Style badge */}
        <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold border border-white/15 pointer-events-none">
          {styleData.emoji} {styleData.label}
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => setMuted(m => !m)}
          className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1.5 rounded-full font-semibold border border-white/15 flex items-center gap-1 hover:bg-black/70 transition-colors"
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {muted ? 'Off' : 'On'}
        </button>
      </div>

      {/* ── Timeline ── */}
      <div className="bg-white rounded-xl border border-[#D4CFC0] px-3 py-2.5 flex items-center gap-3 mb-1 shadow-sm">
        <button onClick={togglePlay}
          className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
          {playing ? <Pause size={14} color="white" /> : <Play size={14} color="white" className="ml-0.5" />}
        </button>
        <div className="flex-1 cursor-pointer" onClick={seek}>
          <Progress value={progress} className="h-2 bg-[#E8E4DA]" />
        </div>
        <span className="text-xs text-[#888] font-bold w-10 text-right shrink-0">
          {fmtTime(progress, duration)}
        </span>
      </div>

      <p className="text-center text-xs text-[#888] mb-4">
        {`${styleData.label} style${photos.length > 0 ? ` • ${photos.length} photo${photos.length > 1 ? 's' : ''}` : ' • AI art scenes'}`}
      </p>

      <div className="flex flex-col gap-3 pb-4">
        <button onClick={onRegenerate}
          className="w-full py-3.5 rounded-2xl border-2 border-[#D4CFC0] font-bold text-[#1A1A1A] bg-white text-sm flex items-center justify-center gap-2 hover:border-[#1A1A1A] transition-colors">
          <RotateCcw size={15} /> Regenerate
        </button>
        <div className="flex gap-3">
          <a href={DEMO_VIDEO} download="memora-story.mov"
            className="flex-1 py-3.5 rounded-2xl border-2 border-[#7B9EC8] font-bold text-[#7B9EC8] bg-white text-sm flex items-center justify-center gap-2 hover:bg-[#7B9EC8] hover:text-white transition-colors">
            <Download size={14} /> Download
          </a>
          <button onClick={onShare}
            className="flex-1 py-3.5 rounded-2xl bg-[#1A1A1A] border-2 border-[#1A1A1A] font-bold text-white text-sm flex items-center justify-center gap-2 hover:bg-[#C1622F] hover:border-[#C1622F] transition-colors">
            <Share2 size={15} /> Save & Share
          </button>
        </div>
      </div>
    </Screen>
  );
}

// ─── Story Share ───────────────────────────────────────────────────────────────
function StoryShare({ videoUrl, onBack }: { videoUrl: string | null; onBack: () => void }) {
  const navigate = useNavigate();
  const { uploadedPhotos, selectedArtStyle } = useApp();
  const [shared, setShared] = useState<string | null>(null);
  const [videoAspect, setVideoAspect] = useState<number | null>(null);
  const styleData = ART_STYLES.find(s => s.id === selectedArtStyle) ?? ART_STYLES[0];

  const apps = [
    { id: 'whatsapp',  icon: FaWhatsapp,  label: 'WhatsApp',  color: '#25D366', bg: '#DCFCE7' },
    { id: 'instagram', icon: FaInstagram, label: 'Instagram', color: '#E1306C', bg: '#FCE7F3' },
    { id: 'sms',       icon: FaCommentDots, label: 'SMS',     color: '#3B82F6', bg: '#DBEAFE' },
    { id: 'email',     icon: FaEnvelope,  label: 'Email',     color: '#6B7280', bg: '#F3F4F6' },
  ];

  return (
    <Screen withNav withSaathi className="px-5 pt-5">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack}><ArrowLeft size={24} color="#1A1A1A" /></button>
        <h2 className="text-xl font-bold text-[#1A1A1A]">Share with Family</h2>
        <div className="w-6" />
      </div>

      {/* Mini preview */}
      <div className="bg-[#0D0D0D] rounded-2xl overflow-hidden mb-4 shadow-xl relative"
        style={{ aspectRatio: videoAspect ? String(videoAspect) : '16/9' }}>
        <video
          src={DEMO_VIDEO}
          className="w-full h-full object-contain opacity-90"
          muted
          autoPlay
          loop
          playsInline
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) {
              setVideoAspect(v.videoWidth / v.videoHeight);
            }
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
            <Play size={18} color="white" className="ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full font-semibold pointer-events-none">
          {styleData.emoji} {styleData.label}
        </div>
      </div>

      {shared ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-3 py-6 bg-[#F0FDF4] rounded-2xl border-2 border-[#86EFAC] mb-4">
          <div className="w-14 h-14 rounded-full bg-[#10B981] flex items-center justify-center">
            <CheckCircle2 size={30} color="white" />
          </div>
          <p className="font-bold text-[#1A1A1A] text-lg">Shared Successfully!</p>
          <p className="text-sm text-[#888]">Your family will love this memory 💛</p>
        </motion.div>
      ) : (
        <div className="flex justify-around mb-5">
          {apps.map(({ id, label, bg, color, icon: Icon }) => (
            <button key={id} onClick={() => setShared(id)}
              className="flex flex-col items-center gap-2 hover:scale-110 active:scale-95 transition-transform">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border border-[#D4CFC0]"
                style={{ backgroundColor: bg }}>
                <Icon size={28} color={color} />
              </div>
              <span className="text-xs font-semibold text-[#888]">{label}</span>
            </button>
          ))}
        </div>
      )}

      <a href={DEMO_VIDEO} download="memora-story.mov"
        className="w-full mb-3 py-3.5 rounded-2xl border-2 border-[#7B9EC8] font-bold text-[#7B9EC8] bg-white text-sm flex items-center justify-center gap-2 hover:bg-[#7B9EC8] hover:text-white transition-colors">
        <Download size={16} /> Download Video File
      </a>

      <button onClick={() => navigate('/home/menu')}
        className="w-full py-4 rounded-2xl bg-[#1A1A1A] text-white font-bold tracking-wide text-sm hover:bg-[#C1622F] transition-colors">
        Back to Home
      </button>
    </Screen>
  );
}

// ─── Utility ──────────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

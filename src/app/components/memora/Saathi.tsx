import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Mic } from 'lucide-react';
import { SaathiAvatar } from './Shared';
import { Input } from '../ui/input';

interface Message {
  id: string;
  from: 'user' | 'saathi';
  text: string;
}

const SAATHI_RESPONSES: Record<string, string> = {
  default: "I'm here to help! You can ask me how to record a story, how the garden game works, or how to add family members.",
  record: "To record a story, tap on 'Stories' in the bottom menu, then tap the big red microphone button. Speak clearly and tap again to stop!",
  photo: "To add photos to your video, after recording your story tap 'Generate →', then on the next screen tap 'ADD PHOTOS' to choose pictures from your gallery.",
  video: "After recording your story and adding photos, you can pick an art style (Anime, Pixar, or Sketch) and tap 'Generate' to create your video!",
  garden: "Your garden grows when you complete daily missions! Each completed mission makes a new flower bloom. Keep your streak going to unlock more flowers 🌸",
  family: "To add family members, go to Profile (the person icon at the bottom) and tap '+ ADD FAMILY MEMBER'. You can search your contacts and add them!",
  share: "To share your video, tap 'Save and share' after generating your video, then choose WhatsApp, Email, Instagram, or X to send it to your loved ones!",
  mission: "Daily missions are fun tasks like sending a voice note to a family member. Complete them to grow flowers in your garden. New missions appear every day!",
};

function getSaathiResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('record') || lower.includes('mic') || lower.includes('story')) return SAATHI_RESPONSES.record;
  if (lower.includes('photo') || lower.includes('picture') || lower.includes('image')) return SAATHI_RESPONSES.photo;
  if (lower.includes('video') || lower.includes('generate') || lower.includes('anime') || lower.includes('pixar')) return SAATHI_RESPONSES.video;
  if (lower.includes('garden') || lower.includes('flower') || lower.includes('bloom')) return SAATHI_RESPONSES.garden;
  if (lower.includes('family') || lower.includes('add') || lower.includes('member')) return SAATHI_RESPONSES.family;
  if (lower.includes('share') || lower.includes('whatsapp') || lower.includes('send')) return SAATHI_RESPONSES.share;
  if (lower.includes('mission') || lower.includes('task') || lower.includes('daily')) return SAATHI_RESPONSES.mission;
  return SAATHI_RESPONSES.default;
}

const SUGGESTIONS = [
  'How do I record a story?',
  'How can I add photos to the video?',
  'How does the garden work?',
  'How do I add family members?',
];

export function SaathiScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getSaathiResponse(text);
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now().toString() + 'r', from: 'saathi', text: response }]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black/40 flex items-end justify-center">
      <div className="w-full max-w-[390px] bg-[#EDE8DC] rounded-t-3xl flex flex-col overflow-hidden" style={{ height: '90vh' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#C8C3B4] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#D4CFC0]">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} color="#1A1A1A" />
          </button>
          <SaathiAvatar size={44} />
          <div>
            <p className="font-bold text-[#1A1A1A] text-base">Saathi</p>
            <p className="text-xs text-[#888]">AI assistant • always here to help</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {/* Initial greeting */}
          <div className="flex items-start gap-2">
            <SaathiAvatar size={32} />
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] border border-[#D4CFC0]">
              <p className="font-bold text-[#1A1A1A] text-sm">Hello, how may I help you?</p>
              <p className="text-xs text-[#888] mt-0.5">Ask me any question related to the app!</p>
            </div>
          </div>

          {/* Suggestion chips */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 ml-10">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-[#EEF4FA] border border-[#7B9EC8] text-[#7B9EC8] hover:bg-[#7B9EC8] hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.from === 'saathi' && <SaathiAvatar size={32} />}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[78%] text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-[#7B9EC8] text-white rounded-br-sm'
                    : 'bg-white text-[#1A1A1A] border border-[#D4CFC0] rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-end gap-2">
              <SaathiAvatar size={32} />
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 border border-[#D4CFC0] flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#C8C3B4]" style={{ animation: `bounce 0.7s ${i * 0.15}s infinite alternate` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
          <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }`}</style>
        </div>

        {/* Input area */}
        <div className="px-4 py-3 border-t border-[#D4CFC0] flex gap-2 items-center bg-[#EDE8DC]">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl border-2 border-[#D4CFC0] px-3 py-2 focus-within:border-[#7B9EC8] transition-colors">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask Saathi anything..."
              className="flex-1 text-sm text-[#1A1A1A] placeholder:text-[#C8C3B4] bg-transparent border-0 shadow-none focus-visible:ring-0 h-auto px-0 py-0"
            />
            <button className="text-[#888] hover:text-[#C1622F] transition-colors">
              <Mic size={18} />
            </button>
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-[#7B9EC8] flex items-center justify-center transition-all hover:bg-[#6A8DB7] disabled:opacity-40"
          >
            <Send size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
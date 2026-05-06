import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Settings, Bell, Shield, ChevronRight, Flame, Flower2, Sparkles, User, Check } from 'lucide-react';
import { Screen } from './Shared';
import { useApp } from '../../context/AppContext';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';

const FAMILY = [
  { id: '1', name: 'Priya', relation: 'Granddaughter', status: 'Active now', color: '#FCE7F3', textColor: '#BE185D', avatar: 'memora/granddaughter_pfp.png' },
  { id: '2', name: 'Rajeh', relation: 'Husband', status: 'Last seen yesterday', color: '#DBEAFE', textColor: '#1D4ED8', avatar: 'memora/grandpa_pfp.png' },
  { id: '3', name: 'Raj', relation: 'Grandson', status: 'Active today', color: '#DCFCE7', textColor: '#15803D', avatar: 'memora/grandson_pfp.png' },
];

// ─── Profile Screen ───────────────────────────────────────────────────────────
export function ProfileScreen() {
  const navigate = useNavigate();
  const { userName, streak, stories, gardenFlowers, logout } = useApp();

  const settings = [
    { icon: Bell, label: 'Notifications', sub: 'Daily reminders & updates' },
    { icon: Shield, label: 'Privacy & Security', sub: 'Manage your data' },
    { icon: Settings, label: 'App Settings', sub: 'Language, accessibility' },
  ];

  return (
    <Screen withNav withSaathi className="pt-0">
      {/* Profile header */}
      <div className="relative bg-gradient-to-br from-[#312E81] via-[#4F46E5] to-[#7C3AED] px-5 pt-12 pb-8 overflow-hidden">
        <div className="absolute top-4 right-4 opacity-10"><Flower2 size={48} className="text-white" /></div>
        <div className="absolute bottom-2 left-4 opacity-10 rotate-12"><Sparkles size={32} className="text-white" /></div>

        <div className="flex flex-col items-center gap-3">
          <img
            src="memora/grandma_pfp.png"
            alt="Meena"
            className="rounded-full border-4 border-white/40 shadow-xl object-cover"
            style={{ width: 88, height: 88 }}
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{userName} Sharma</h2>
            <p className="text-white/60 text-sm">Member since 2026</p>
          </div>
          <div className="flex gap-6 mt-1">
            <div className="text-center">
              <p className="font-bold text-white text-lg">{stories.length}</p>
              <p className="text-white/60 text-xs">Stories</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-lg flex items-center justify-center gap-1">
                {streak} <Flame size={18} className="text-white" />
              </p>
              <p className="text-white/60 text-xs">Streak</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-lg flex items-center justify-center gap-1">
                {gardenFlowers} <Flower2 size={18} className="text-white" />
              </p>
              <p className="text-white/60 text-xs">Flowers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 flex flex-col gap-4">
        {/* My Family */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold tracking-wide text-[#1A1A1A]">MY FAMILY</p>
            <button onClick={() => navigate('/profile/contacts')} className="text-xs font-bold text-[#7B9EC8]">
              Manage →
            </button>
          </div>
          <Card className="rounded-2xl border-2 border-[#D4CFC0] overflow-hidden shadow-sm">
            <CardContent className="p-0">
              {FAMILY.map(({ id, name, relation, status, color, avatar }, i) => (
                <div key={id}>
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-11 h-11 rounded-full border-2 border-[#D4CFC0] object-cover flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-[#1A1A1A]">
                        {name}
                        <span className="text-xs font-semibold text-[#888] ml-1.5">({relation})</span>
                      </p>
                      <p className="text-xs text-[#888] flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full inline-block ${
                            status.includes('now')
                              ? 'bg-[#10B981]'
                              : status.includes('today')
                              ? 'bg-[#F59E0B]'
                              : 'bg-gray-300'
                          }`}
                        />
                        {status}
                      </p>
                    </div>

                  </div>
                  {i < FAMILY.length - 1 && <Separator className="mx-4 w-auto bg-[#E8E4DA]" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Add family member */}
        <button
          onClick={() => navigate('/profile/contacts')}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#C8C3B4] flex items-center justify-center gap-2 font-bold text-[#888] hover:border-[#C1622F] hover:text-[#C1622F] transition-colors"
        >
          <Plus size={18} /> Add Family Member
        </button>

        {/* Settings */}
        <div>
            <p className="text-sm font-bold tracking-wide text-[#1A1A1A] mb-3">SETTINGS</p>
          <Card className="rounded-2xl border-2 border-[#D4CFC0] overflow-hidden shadow-sm">
            <CardContent className="p-0">
              {settings.map(({ icon: Icon, label, sub }, i) => (
                <div key={label}>
                  <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F5F1E8] transition-colors text-left">
                    <div className="w-9 h-9 rounded-xl bg-[#F5F1E8] border border-[#D4CFC0] flex items-center justify-center flex-shrink-0">
                      <Icon size={17} color="#888" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#1A1A1A] text-sm">{label}</p>
                      <p className="text-xs text-[#888]">{sub}</p>
                    </div>
                    <ChevronRight size={16} color="#C8C3B4" />
                  </button>
                  {i < settings.length - 1 && <Separator className="mx-4 w-auto bg-[#E8E4DA]" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Log out */}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full py-3.5 rounded-2xl border-2 border-red-200 font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors mb-2"
        >
          Log Out
        </button>
      </div>
    </Screen>
  );
}

// ─── Contacts Screen ──────────────────────────────────────────────────────────
const CONTACTS = ['Aditya', 'Amish', 'Arun', 'Bhaskar', 'Brijesh', 'Chandan', 'Deepika', 'Gopal'];
// Replaced emoji avatars with Lucide User icons below

export function ContactsScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = CONTACTS.filter((c) => c.toLowerCase().includes(search.toLowerCase()));

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <Screen withNav withSaathi className="pt-0">
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#2D2D2D] px-5 pt-10 pb-5">
        <button onClick={() => navigate('/profile')} className="mb-3">
          <ArrowLeft size={22} color="white" />
        </button>
          <h2 className="text-2xl font-bold text-white">Add Family Members</h2>
        <p className="text-white/60 text-sm mt-0.5">Select people to connect with</p>
      </div>

      <div className="flex-1 px-5 pt-4">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="w-full px-4 py-3 rounded-2xl border-2 border-[#D4CFC0] text-[#1A1A1A] mb-4 text-sm focus-visible:ring-0 focus:border-[#7B9EC8] h-auto"
        />

        <Card className="rounded-2xl border-2 border-[#D4CFC0] overflow-hidden shadow-sm">
          <CardContent className="p-0">
            {filtered.map((name, i) => {
              const isSelected = selected.includes(name);
              return (
                <div key={name}>
                  <button
                    onClick={() => toggle(name)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                      isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F5F1E8]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'border-[#7B9EC8] bg-[#DBEAFE]' : 'border-[#D4CFC0] bg-[#F5F1E8]'
                      }`}
                    >
                      <User size={20} className={isSelected ? 'text-[#7B9EC8]' : 'text-[#888]'} />
                    </div>
                    <span className="font-bold text-[#1A1A1A] flex-1">{name}</span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggle(name)}
                      className={`w-6 h-6 rounded-md border-2 ${isSelected ? 'bg-[#7B9EC8] border-[#7B9EC8]' : 'border-[#D4CFC0]'}`}
                    />
                  </button>
                  {i < filtered.length - 1 && <Separator className="mx-4 w-auto bg-[#E8E4DA]" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="px-5 pb-4 pt-3">
        <button
          onClick={() => navigate('/profile')}
          className={`w-full py-4 rounded-2xl font-bold tracking-wide text-sm border-2 transition-all shadow-md ${
            selected.length > 0
              ? 'bg-[#C1622F] border-[#C1622F] text-white hover:bg-[#A85426] hover:border-[#A85426]'
              : 'bg-white border-[#D4CFC0] text-[#888]'
          }`}
        >
          {selected.length > 0
            ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check size={16} /> Add {selected.length} Member{selected.length > 1 ? 's' : ''}
              </span>
            )
            : 'Select Contacts'}
        </button>
      </div>
    </Screen>
  );
}

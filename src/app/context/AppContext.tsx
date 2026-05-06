import React, { createContext, useContext, useState } from 'react';

export interface Story {
  id: string;
  title: string;
  emoji: string;
  daysAgo: number;
  transcript: string;
  artStyle?: string;
  photos?: string[];
  videoReady?: boolean;
}

interface AppState {
  userName: string;
  setUserName: (n: string) => void;
  phoneNumber: string;
  setPhoneNumber: (n: string) => void;
  gardenFlowers: number;
  setGardenFlowers: (n: number) => void;
  streak: number;
  completedMissions: string[];
  setCompletedMissions: (m: string[]) => void;
  stories: Story[];
  setStories: (s: Story[]) => void;
  readAloud: boolean;
  setReadAloud: (v: boolean) => void;
  // Active story creation state
  activeTranscript: string;
  setActiveTranscript: (t: string) => void;
  uploadedPhotos: string[];
  setUploadedPhotos: (p: string[]) => void;
  selectedArtStyle: string;
  setSelectedArtStyle: (s: string) => void;
  saathiCorner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  setSaathiCorner: (s: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => void;
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (v: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppState | null>(null);

const INITIAL_STORIES: Story[] = [
  { id: '1', title: 'Bee in the Garden', emoji: '🐝', daysAgo: 2, transcript: 'Yesterday, I went on a walk to the nearby garden, where I saw a beautiful flower. As I approached closer to smell it, I see a bee flying towards me. I had to flee from there haha!', artStyle: 'anime', videoReady: true },
  { id: '2', title: 'School Days Memories', emoji: '📚', daysAgo: 5, transcript: 'When I was in school, we used to walk 3 miles every morning...', artStyle: 'sketch', videoReady: true },
  { id: '3', title: 'My Wedding Day', emoji: '💍', daysAgo: 12, transcript: 'It was the most beautiful day of my life, surrounded by family...', artStyle: 'pixar', videoReady: true },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('Rajesh');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gardenFlowers, setGardenFlowers] = useState(3);
  const [streak] = useState(5);
  const [completedMissions, setCompletedMissions] = useState<string[]>(['Share a photo of breakfast']);
  const [readAloud, setReadAloud] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [selectedArtStyle, setSelectedArtStyle] = useState('');
  const [saathiCorner, setSaathiCorner] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom-right');
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);

  const logout = () => {
    setGardenFlowers(3);
    setCompletedMissions(['Share a photo of breakfast']);
    setStories(INITIAL_STORIES);
    setActiveTranscript('');
    setUploadedPhotos([]);
    setSelectedArtStyle('');
    setReadAloud(false);
    setPhoneNumber('');
    setHasSeenWelcome(false);
  };

  return (
    <AppContext.Provider value={{
      userName, setUserName,
      phoneNumber, setPhoneNumber,
      gardenFlowers, setGardenFlowers,
      streak,
      completedMissions, setCompletedMissions,
      stories, setStories,
      readAloud, setReadAloud,
      activeTranscript, setActiveTranscript,
      uploadedPhotos, setUploadedPhotos,
      selectedArtStyle, setSelectedArtStyle,
      saathiCorner, setSaathiCorner,
      hasSeenWelcome, setHasSeenWelcome,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
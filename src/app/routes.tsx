import { createHashRouter } from 'react-router';
import { SplashScreen, PhoneEntry, OTPVerify, NameSetup } from './components/memora/Auth';
import { LanguageSelect } from './components/memora/LanguageSelect';
import { HowStoriesWork, HowGamesWork, MeetSaathi } from './components/memora/Onboarding';
import { WelcomeHome, Dashboard } from './components/memora/Home';
import {
  ShareWisdom,
  RecordingActive,
  TranscriptionReview,
  ArtStyleSelect,
  VideoPreview,
} from './components/memora/Stories';
import {
  Garden,
  DailyMissions,
  VoiceNoteMission,
  VoiceNoteSent,
  NewFlowerBloomed,
} from './components/memora/Games';
import { ProfileScreen, ContactsScreen } from './components/memora/Profile';
import { SaathiScreen } from './components/memora/Saathi';

export const router = createHashRouter([
  // Auth flow
  { path: '/', Component: SplashScreen },
  { path: '/language', Component: LanguageSelect },
  { path: '/phone', Component: PhoneEntry },
  { path: '/otp', Component: OTPVerify },
  { path: '/setup', Component: NameSetup },

  // Onboarding
  { path: '/onboarding/stories', Component: HowStoriesWork },
  { path: '/onboarding/games', Component: HowGamesWork },
  { path: '/onboarding/saathi', Component: MeetSaathi },

  // Home
  { path: '/home', Component: WelcomeHome },
  { path: '/home/menu', Component: Dashboard },

  // Stories flow
  { path: '/stories', Component: ShareWisdom },
  { path: '/recording', Component: RecordingActive },
  { path: '/stories/recording', Component: RecordingActive },
  { path: '/stories/review', Component: TranscriptionReview },
  { path: '/stories/style', Component: ArtStyleSelect },
  { path: '/stories/preview', Component: VideoPreview },

  // Games flow
  { path: '/games', Component: Garden },
  { path: '/games/missions', Component: DailyMissions },
  { path: '/games/voice-note', Component: VoiceNoteMission },
  { path: '/games/voice-note/sent', Component: VoiceNoteSent },
  { path: '/games/reward', Component: NewFlowerBloomed },

  // Profile
  { path: '/profile', Component: ProfileScreen },
  { path: '/profile/contacts', Component: ContactsScreen },

  // Saathi
  { path: '/saathi', Component: SaathiScreen },
]);

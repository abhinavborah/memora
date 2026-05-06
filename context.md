# Memora Project Context

> Last updated: 2026-05-06
> This file captures the full project context, architecture decisions, and refactoring history so future sessions can pick up without re-exploration.

---

## 1. Project Overview

**Memora** is a mobile-first React application for preserving family memories through voice recordings, AI-generated videos, and daily engagement missions.

- **App Title**: Memora
- **Tagline**: "Your Voice, Their Treasure"
- **Package Name**: `memora` (was `@figma/my-make-file`)
- **Tech Stack**: React 18 + Vite 6 + Tailwind CSS 4 + Motion (ex-Framer Motion) + shadcn/ui
- **Target**: Mobile-first elderly/child-friendly UX (fills full mobile viewport width)

---

## 2. Directory Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (DO NOT MODIFY STYLES DIRECTLY)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── input-otp.tsx
│   │   │   └── ... (45+ total, see section 5)
│   │   ├── memora/          # Application-specific components
│   │   │   ├── Shared.tsx    # Shared UI primitives (wraps shadcn)
│   │   │   ├── Auth.tsx      # Auth flows (splash, phone, OTP, name)
│   │   │   ├── Home.tsx      # Home dashboard
│   │   │   ├── Profile.tsx   # User profile & settings
│   │   │   ├── Stories.tsx   # Story creation & library (1,118 lines, canvas video gen)
│   │   │   ├── Games.tsx     # Garden, missions, rewards
│   │   │   ├── Onboarding.tsx # First-time onboarding
│   │   │   └── Saathi.tsx    # AI companion chat
│   │   └── figma/           # Figma-related utilities
│   │       └── ImageWithFallback.tsx
│   ├── context/
│   │   └── AppContext.tsx    # Global state (phone, user, progress, etc.)
│   ├── routes.tsx            # Router configuration (HashRouter)
│   ├── App.tsx               # App shell with RouterProvider
│   └── main.tsx              # Entry point
├── styles/
│   ├── index.css             # Global styles + Tailwind directives
│   ├── theme.css             # CSS custom properties (colors)
│   ├── fonts.css             # Typography system variables
│   └── tailwind.css          # Tailwind configuration
├── index.html                # HTML entry (title: "Memora")
```

---

## 3. Color System (Custom Properties)

Located in `src/styles/theme.css` and `src/styles/index.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#EDE8DC` | App background (warm cream) |
| `--foreground` | `#1A1A1A` | Primary text |
| `--primary` | `#C1622F` | Burnt orange - CTAs, active states |
| `--secondary` | `#7B9EC8` | Soft blue - secondary actions |
| `--muted` | `#D4CFC0` | Cards, borders, disabled |
| `--border` | `#D4CFC0` | Dividers, input borders |
| `--ring` | `#7B9EC8` | Focus rings |

---

## 4. Typography Standards

**CRITICAL**: Follow these rules for elderly/child accessibility:

| Rule | Standard | Notes |
|------|----------|-------|
| **Base font size** | 17px | Set on `<html>` in `index.css` |
| **Max font weight** | `font-bold` (700) or `font-extrabold` (800) | NEVER use `font-black` (900) |
| **Min font size** | `text-xs` (12px) | NEVER use `text-[10px]` or smaller |
| **Letter spacing** | `tracking-wide` | NEVER use `tracking-widest` or `[0.2em]` |
| **Text case** | Sentence case | NEVER use ALL CAPS |
| **Font family** | System default via Tailwind | NEVER add inline `font-family` styles |
| **Line height** | `leading-relaxed` (1.625) | For body text readability |

### Typography Scale (from `src/styles/fonts.css`)

```css
--font-xs: 0.75rem;     /* 12px - captions */
--font-sm: 0.875rem;    /* 14px - secondary text */
--font-base: 1.0625rem; /* 17px - body (accessibility) */
--font-lg: 1.125rem;    /* 18px - lead text */
--font-xl: 1.25rem;     /* 20px - subtitles */
--font-2xl: 1.5rem;     /* 24px - small headings */
--font-3xl: 1.875rem;   /* 30px - medium headings */
--font-4xl: 2.25rem;    /* 36px - large headings */
--font-5xl: 3rem;       /* 48px - display */
```

---

## 5. shadcn/ui Components Available

All shadcn components are in `src/app/components/ui/` and use the standard `cn()` utility with `cva` variants.

### Core Components (Already Installed & Used)
- `button` - PrimaryBtn/SecondaryBtn wrappers in Shared.tsx
- `card` - Card wrapper in Shared.tsx, Profile.tsx lists
- `input` - Auth phone/name, Profile search, Saathi chat
- `badge` - StreakBadge, story status badges
- `progress` - ProgressBar, garden progress, mission XP
- `avatar` - AvatarCircle, SaathiAvatar
- `switch` - Read-aloud toggle in Auth
- `checkbox` - Family member selection in Profile
- `tabs` - Create/Library tabs in Stories
- `separator` - List dividers in Profile
- `textarea` - Transcription review in Stories
- `input-otp` - OTP entry in Auth

### Additional Installed Components
`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `breadcrumb`, `calendar`, `carousel`, `chart`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `radio-group`, `resizable`, `scroll-area`, `select`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `table`, `toggle`, `toggle-group`, `tooltip`, `use-mobile`

### Adding New shadcn Components
```bash
npx shadcn add <component-name>
```

---

## 6. Custom Component APIs

### Shared.tsx
These wrap shadcn components to maintain consistent styling:

```tsx
// Logo
<MemoraLogo size={64} />

// Layout
<Screen withNav={false} withSaathi={false} className="">

// Buttons
<PrimaryBtn onClick={() => {}} className="">Label</PrimaryBtn>
<SecondaryBtn onClick={() => {}} className="">Label</SecondaryBtn>

// Cards
<Card className="">Content</Card>

// Feedback
<StreakBadge streak={5} className="" />
<AvatarCircle src="" fallback="AB" size={48} />
<ProgressBar value={50} max={100} label="Label" />
<SaathiAvatar size={48} />
<MemoraMicButton onClick={() => {}} />
<RecordingButton />
```

---

## 7. Completed Refactoring History

### Phase 1: shadcn/ui Migration (COMPLETED)
- ✅ Shared.tsx - All primitives wrapped with shadcn
- ✅ Auth.tsx - Input, InputOTP, Switch
- ✅ Profile.tsx - Card, Separator, Checkbox, Input
- ✅ Stories.tsx - Tabs, Textarea, Progress, Badge
- ✅ Games.tsx - Progress
- ✅ Saathi.tsx - Input

### Phase 2: Typography Accessibility (COMPLETED)
- ✅ Replaced all `font-black` with `font-bold`/`font-extrabold`
- ✅ Replaced all `text-[10px]`/`[9px]` with `text-xs`
- ✅ Replaced all `tracking-widest`/`[0.2em]` with `tracking-wide`
- ✅ Converted ALL CAPS to sentence case across all components
- ✅ Removed inline `font-family` declarations
- ✅ Set 17px base font size
- ✅ Added `antialiased`, `leading-relaxed`, focus styles, `prefers-reduced-motion`

### Phase 3: Cleanup (COMPLETED)
- ✅ Updated app title to "Memora"
- ✅ Updated package.json name to "memora"
- ✅ Added logo files to `/public/memora/`
- ✅ Build passes cleanly
- ⚠️ `react-popper` still present in dependencies

### Phase 4: UI Polish (COMPLETED)
- ✅ Added profile pictures (`grandma_pfp.png`, `grandpa_pfp.png`, `grandson_pfp.png`, `granddaughter_pfp.png`) to `/public/memora/`
- ✅ Replaced Saathi Sparkles icon with `saathi.png` image
- ✅ Renamed family members in Profile.tsx: Rajesh (Son) → Rajeh (Husband), Riya (Daughter) → Raj (Grandson)
- ✅ Updated Profile, Home, and Games components to use real pfp images
- ✅ Draggable Saathi FAB with 2D corner snapping (`saathiCorner` state: 4 corners)
- ✅ Removed back button from Stories landing page (`ShareWisdom`)
- ✅ Removed `max-w-[390px]` constraints so app fills full mobile viewport width

### Phase 5: Feature Expansion (COMPLETED)
- ✅ Full story creation flow with canvas-based video generation (Stories.tsx)
- ✅ Art style selection (Anime, Pixar 3D, Sketch, Oil Paint)
- ✅ Transcription review and editing
- ✅ Photo upload support
- ✅ Social sharing (WhatsApp, Instagram, Messages, Email via react-icons)
- ✅ Games & missions flow with reward screens
- ✅ Voice note mission with sent confirmation
- ✅ Flower blooming reward animation
- ✅ Onboarding flow with 3 screens (Stories, Games, Saathi)
- ✅ Contacts screen in Profile

---

## 8. Image Assets

### App Logo
- **SVG**: `/public/memora/memora-logo.svg` (61KB, works correctly)
- **PNG**: `/public/memora/memora-logo.png` (3.4KB, fallback)
- **Usage**: `<MemoraLogo size={64} />` in Shared.tsx

### Saathi AI Avatar
- **PNG**: `/public/memora/saathi.png`
- **Usage**: `SaathiAvatar` component and draggable `SaathiFab`

### Profile Pictures
- `/public/memora/grandma_pfp.png` — User profile (Meena)
- `/public/memora/grandpa_pfp.png` — Rajeh (Husband)
- `/public/memora/grandson_pfp.png` — Raj (Grandson)
- `/public/memora/granddaughter_pfp.png` — Available asset

### Garden & Demo Assets
- `/public/memora/flower3.jpg` — Garden flower asset
- `/public/memora/flower4.jpg` — Garden flower asset
- `/public/memora/memora_video_gen_demo.mov` — Video generation demo (7.4MB)

---

## 9. State Management

Uses React Context (`AppContext`) with the following state:

| Field | Type | Description |
|-------|------|-------------|
| `phoneNumber` | `string` | User's phone |
| `userName` | `string` | Display name (default: "Meena") |
| `gardenFlowers` | `number` | Number of flowers in garden (default: 3) |
| `streak` | `number` | Current streak count (default: 5, read-only) |
| `completedMissions` | `string[]` | Completed mission IDs |
| `stories` | `Story[]` | User's stories (3 sample stories seeded) |
| `readAloud` | `boolean` | Read-aloud toggle state |
| `activeTranscript` | `string` | Current story transcription being edited |
| `uploadedPhotos` | `string[]` | Photos uploaded for current story |
| `selectedArtStyle` | `string` | Selected art style for video generation |
| `saathiCorner` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | Saathi FAB position |
| `hasSeenWelcome` | `boolean` | Whether user has seen welcome screen |
| `logout` | `() => void` | Reset all state to defaults |

### Story Interface
```ts
interface Story {
  id: string;
  title: string;
  emoji: string;
  daysAgo: number;
  transcript: string;
  artStyle?: string;
  photos?: string[];
  videoReady?: boolean;
}
```

---

## 10. Routing

Defined in `src/app/routes.tsx` using `createHashRouter`:

### Auth Flow
- `/` — Splash screen
- `/phone` — Phone entry
- `/otp` — OTP verification
- `/setup` — Name entry (was `/name`)

### Onboarding
- `/onboarding/stories` — How Stories Work
- `/onboarding/games` — How Games Work
- `/onboarding/saathi` — Meet Saathi

### Home
- `/home` — Welcome Home
- `/home/menu` — Dashboard

### Stories Flow
- `/stories` — Stories landing (ShareWisdom)
- `/recording` — Recording active (alias)
- `/stories/recording` — Recording active
- `/stories/review` — Transcription review
- `/stories/style` — Art style selection
- `/stories/preview` — Video preview

### Games Flow
- `/games` — Garden
- `/games/missions` — Daily missions
- `/games/voice-note` — Voice note mission
- `/games/voice-note/sent` — Voice note sent confirmation
- `/games/reward` — New flower bloomed reward

### Profile
- `/profile` — Profile & settings
- `/profile/contacts` — Contacts screen

### Saathi
- `/saathi` — AI companion chat

---

## 11. Accessibility Guidelines

1. **Contrast**: All text meets WCAG AA (4.5:1 minimum)
2. **Touch targets**: Minimum 44x44px
3. **Motion**: Respect `prefers-reduced-motion`
4. **Focus**: Visible focus rings on all interactive elements
5. **Font**: 17px base, no text smaller than 12px
6. **Case**: Sentence case everywhere (no ALL CAPS)
7. **Weight**: Max font-bold, never font-black

---

## 12. Known Issues / TODO

- [ ] Chunk size warning (522KB JS bundle) - consider lazy loading routes
- [ ] No unit tests currently
- [ ] No error boundaries
- [ ] No offline/PWA support yet
- [ ] `react-popper` still in dependencies but may be unused (check before removing)
- [ ] Canvas-based video generation is client-side only (no server rendering)

---

## 13. Quick Commands

```bash
# Install dependencies
npm install

# Dev server
npm run dev          # http://localhost:5173

# Production build
npm run build

# Add new shadcn component
npx shadcn add <component>
```

---

## 14. Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | React DOM |
| react-router | ^7.13.0 | Routing |
| motion | ^12.23.24 | Animations (formerly Framer Motion) |
| tailwindcss | ^4.1.12 | Styling |
| lucide-react | ^0.487.0 | Icons |
| react-icons | ^5.6.0 | Social media icons (FaWhatsapp, FaInstagram, etc.) |
| canvas-confetti | ^1.9.4 | Celebration animations |
| react-dnd | ^16.0.1 | Drag and drop |
| recharts | ^2.15.2 | Charts |
| sonner | ^2.0.3 | Toast notifications |
| class-variance-authority | ^0.7.1 | shadcn variants |
| clsx / tailwind-merge | latest | Class merging |
| vite | ^6.3.5 | Build tool |
| @tailwindcss/vite | ^4.1.12 | Tailwind Vite integration |

---

*End of context file. For questions, check the component source in `src/app/components/memora/` or shadcn docs at https://ui.shadcn.com*

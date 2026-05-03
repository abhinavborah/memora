# Memora Project Context

> Last updated: 2026-05-03
> This file captures the full project context, architecture decisions, and refactoring history so future sessions can pick up without re-exploration.

---

## 1. Project Overview

**Memora** is a mobile-first React application for preserving family memories through voice recordings, AI-generated videos, and daily engagement missions.

- **App Title**: Memora
- **Tagline**: "Your Voice, Their Treasure"
- **Package Name**: `memora` (was `@figma/my-make-file`)
- **Tech Stack**: React 19 + Vite 6 + Tailwind CSS 4 + Framer Motion + shadcn/ui
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
│   │   │   └── input-otp.tsx
│   │   └── memora/          # Application-specific components
│   │       ├── Shared.tsx    # Shared UI primitives (wraps shadcn)
│   │       ├── Auth.tsx      # Auth flows (splash, phone, OTP, name)
│   │       ├── Home.tsx      # Home dashboard
│   │       ├── Profile.tsx   # User profile & settings
│   │       ├── Stories.tsx   # Story creation & library
│   │       ├── Games.tsx     # Garden, missions, rewards
│   │       ├── Onboarding.tsx # First-time onboarding
│   │       └── Saathi.tsx    # AI companion chat
│   ├── context/
│   │   └── AppContext.tsx    # Global state (phone, user, progress, etc.)
│   ├── App.tsx               # Router setup
│   └── main.tsx              # Entry point
├── index.html                # HTML entry (title: "Memora")
├── index.css                 # Global styles + Tailwind directives
├── theme.css                 # CSS custom properties (colors)
└── fonts.css                 # Typography system variables
```

---

## 3. Color System (Custom Properties)

Located in `theme.css` and `index.css`:

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

### Typography Scale (from `fonts.css`)

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

### Already Installed & Used
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
- ✅ Removed unused `@mui/material`, `@emotion/*`, `@popperjs/core`, `react-popper`
- ✅ Updated app title to "Memora"
- ✅ Updated package.json name to "memora"
- ✅ Added logo files to `/public/memora/`
- ✅ Build passes cleanly

### Phase 4: UI Polish (COMPLETED)
- ✅ Added profile pictures (`grandma_pfp.png`, `grandpa_pfp.png`, `grandson_pfp.png`, `granddaughter_pfp.png`) to `/public/memora/`
- ✅ Replaced Saathi Sparkles icon with `saathi.png` image
- ✅ Renamed family members in Profile.tsx: Rajesh (Son) → Rajeh (Husband), Riya (Daughter) → Raj (Grandson)
- ✅ Updated Profile, Home, and Games components to use real pfp images
- ✅ Draggable Saathi FAB with 2D corner snapping (`saathiCorner` state: 4 corners)
- ✅ Removed back button from Stories landing page (`ShareWisdom`)
- ✅ Removed `max-w-[390px]` constraints so app fills full mobile viewport width

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

---

## 9. State Management

Uses React Context (`AppContext`) with the following state:
- `phoneNumber` - User's phone
- `userName` - Display name
- `selectedMissions` - Daily mission selections
- `familyMembers` - Connected family
- `stories` - User's stories
- `completedMissions` - Mission progress
- `showOnboarding` - First-time flag
- `saathiCorner` - Saathi FAB position (`'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`)

---

## 10. Routing

Defined in `App.tsx`:
- `/` - Splash screen
- `/phone` - Phone entry
- `/otp` - OTP verification
- `/name` - Name entry
- `/home` - Home dashboard
- `/stories` - Stories (create + library)
- `/games` - Games & missions
- `/profile` - Profile & settings
- `/onboarding` - First-time onboarding
- `/saathi` - AI companion

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
| react | ^19.0.0 | UI framework |
| react-router | ^7.0.0 | Routing |
| framer-motion | ^12.0.0 | Animations |
| tailwindcss | ^4.0.0 | Styling |
| lucide-react | ^0.400.0 | Icons |
| class-variance-authority | latest | shadcn variants |
| clsx / tailwind-merge | latest | Class merging |

---

*End of context file. For questions, check the component source in `src/app/components/memora/` or shadcn docs at https://ui.shadcn.com*

# GOLF SQUAD — COMPREHENSIVE GOLF LEAGUE MANAGEMENT APP
## Ralph Autonomous Development Prompt for Claude Code

**Project:** Golf Squad - Golf League Management Application
**Developers:** J Fraser + Friends (Collaborative Build)
**Tech Stack:** React + TypeScript + Tailwind CSS + Firebase/Supabase

---

## PROJECT OVERVIEW

Golf Squad is a mobile-first web application designed to manage recreational golf leagues with friends. It combines scheduling, betting/wagering tracking, attendance management, and social features into a unified platform.

### Core Concept
A group of friends plays golf together regularly (e.g., every Wednesday). They need to:
- Sign up for weekly rounds
- Track individual match bets (1v1)
- Manage WAD (Worst Available Day) pot games
- Handle backout fees for last-minute cancellations
- Track season leaderboards and winnings
- Support multiple golf groups (Wednesday League, Weekend Warriors, etc.)

---

## PAIN POINTS TO SOLVE

### Pain Point 1: Fragmented Communication
**Current State:** "Who's in for Wednesday?" group texts, 20+ message threads to organize rounds
**Solution:** One-tap sign-ups, real-time player list, automated reminders

### Pain Point 2: Manual Bet Tracking
**Current State:** Excel spreadsheets (if lucky), forgotten bets, "Did Mike pay me?" confusion
**Solution:** Digital match tracking, automatic calculations, Venmo integration

### Pain Point 3: Backout Fee Chaos
**Current State:** Last-minute cancellations with no consequences, scrambling to fill spots
**Solution:** Escalating backout fees ($5→$10→$20→$30) that go into group pot

### Pain Point 4: No Historical Record
**Current State:** No season-long tracking, no memory of who owes whom
**Solution:** Season leaderboard, historical stats, settlement tracking

---

## CORE FEATURES

### Feature 1: Multi-Team Support
- Support unlimited golf groups (Wednesday League, Weekend Warriors, etc.)
- Each team has independent settings, members, and leaderboards
- Easy team switching via dropdown
- Cross-team player profiles

### Feature 2: 5 Core + Subs System
- Exactly 5 regular players per group
- 2-3 substitute spots available
- Core players get priority sign-up
- Subs fill remaining spots

### Feature 3: Individual Match Betting
- 1v1 match creation between players
- Custom bet amounts per match
- Track wins/losses automatically
- Season totals per player

### Feature 4: WAD (Worst Available Day) Games
- Group pot where worst score wins the pot
- Configurable pot amounts
- Multiple WAD formats supported
- Historical WAD results

### Feature 5: Smart Backout Fees
- Escalating fees based on withdrawal timing:
  - 48+ hours before: $5
  - 24-48 hours before: $10
  - Less than 24 hours: $20
  - Morning of: $30
- Fees go into group pot
- Creates accountability and fun bonus rounds

### Feature 6: Season Leaderboard
- Track all winnings/losses
- Rankings with medals (🥇🥈🥉)
- Group pot total displayed
- Historical season archives

### Feature 7: Venmo Integration
- Auto-generate Venmo payment links
- Settlement calculations after rounds
- Payment history tracking
- "Who owes whom" clarity

### Feature 8: Mobile-First Design
- Large touch targets (works with golf gloves!)
- High contrast (readable in bright sun)
- Quick actions (minimal taps needed)
- PWA support (install as phone app)

---

## TECH STACK

### Frontend
- **Framework:** React 18+ with TypeScript (strict mode)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State:** Zustand with persist middleware
- **Forms:** React Hook Form + Zod validation

### Backend Options (Choose One)
**Option A: Firebase (Recommended for Real-Time)**
- Firebase Auth (Google, Email/Password)
- Firestore (real-time database)
- Firebase Hosting
- Cloud Functions (optional)

**Option B: Supabase (SQL Alternative)**
- Supabase Auth
- PostgreSQL database
- Supabase Storage
- Edge Functions

### Deployment
- **Hosting:** Netlify or Vercel (free tier)
- **Domain:** Custom domain optional ($12/year for yourgroup.golf)

---

## DESIGN SYSTEM

### Color Palette (Golf-Themed)
```
Primary Green:      #059669  (fairway green)
Secondary Blue:     #0284C7  (sky blue)
Accent Gold:        #D97706  (trophy gold)
Warning Red:        #DC2626  (penalty)
Background Light:   #F9FAFB
Background Dark:    #1F2937
Text Primary:       #111827
Text Muted:         #6B7280
Success:            #10B981
```

### Typography
- **Display:** Inter (clean, modern)
- **Body:** Inter
- **Monospace:** JetBrains Mono (for numbers/stats)

### UI Principles
- Golf-course aesthetic (greens, blues)
- High contrast for outdoor visibility
- Large touch targets (min 44px)
- Clear visual hierarchy
- Progress indicators throughout
- Mobile-first responsive

---

## DATABASE SCHEMA

### Users Table
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  handicap: number;
  venmoHandle?: string;
  avatarUrl?: string;
  role: 'admin' | 'member';
  stats: {
    roundsPlayed: number;
    totalWinnings: number;
    currentSeasonWinnings: number;
  };
  createdAt: Date;
}
```

### Teams Table
```typescript
interface Team {
  id: string;
  name: string;
  description: string;
  type: 'competitive' | 'casual';
  memberIds: string[];
  adminIds: string[];
  backoutFeePool: number;
  settings: {
    maxPlayers: number;
    corePlayers: number;
    regularDay: string;
    regularTime: string;
    regularCourse: string;
    defaultGames: GameType[];
    backoutFeeSchedule: BackoutFeeSchedule;
  };
  createdAt: Date;
}
```

### Rounds Table
```typescript
interface Round {
  id: string;
  teamId: string;
  date: Date;
  course: string;
  teeTime: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  signedUpPlayerIds: string[];
  games: Game[];
  backoutFees: BackoutFee[];
  createdAt: Date;
}
```

### Games Table
```typescript
interface Game {
  id: string;
  roundId: string;
  type: 'individual_match' | 'wad' | 'skins' | 'nassau';
  players: string[];
  amount: number;
  winnerId?: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}
```

### Backout Fees Table
```typescript
interface BackoutFee {
  id: string;
  roundId: string;
  playerId: string;
  amount: number;
  timing: 'moreThan48Hours' | 'moreThan24Hours' | 'lessThan24Hours' | 'morningOf';
  timestamp: Date;
}
```

### Settlements Table
```typescript
interface Settlement {
  id: string;
  roundId: string;
  fromPlayerId: string;
  toPlayerId: string;
  amount: number;
  status: 'pending' | 'paid';
  venmoLink?: string;
  paidAt?: Date;
  createdAt: Date;
}
```

---

## USER STORIES (PRD.JSON FORMAT)

### Phase 0: Foundation (Stories 0.1-0.5)
### Phase 1: Core App (Stories 1.1-1.6)
### Phase 2: Authentication (Stories 2.1-2.4)
### Phase 3: Round Management (Stories 3.1-3.6)
### Phase 4: Games & Betting (Stories 4.1-4.5)
### Phase 5: Leaderboard & Stats (Stories 5.1-5.4)
### Phase 6: Admin Features (Stories 6.1-6.4)
### Phase 7: Real-Time & Notifications (Stories 7.1-7.4)
### Phase 8: Polish & PWA (Stories 8.1-8.4)

---

## PHASE 0: FOUNDATION

```json
{
  "id": "story-0.1",
  "title": "Initialize React + TypeScript Project",
  "phase": "0-foundation",
  "passes": false,
  "acceptance_criteria": [
    "Vite + React 18 project created",
    "TypeScript strict mode enabled",
    "Tailwind CSS configured with custom golf color palette",
    "Inter font loaded from Google Fonts",
    "Base layout component with mobile-first navigation",
    "npm run dev starts without errors",
    "npm run build completes without errors"
  ]
}
```

```json
{
  "id": "story-0.2",
  "title": "Configure Firebase/Supabase Backend",
  "phase": "0-foundation",
  "passes": false,
  "acceptance_criteria": [
    "Backend service connected via environment variables",
    "All database collections/tables created",
    "Security rules configured for each collection",
    "TypeScript types match database schema",
    "Test query to teams collection succeeds",
    "Storage configured for avatars/photos"
  ]
}
```

```json
{
  "id": "story-0.3",
  "title": "Build Core UI Component Library",
  "phase": "0-foundation",
  "passes": false,
  "acceptance_criteria": [
    "Button component with variants (primary, secondary, outline, danger)",
    "Card component with header, body, footer",
    "Input component with label, error state",
    "Badge component for status indicators",
    "Avatar component with fallback initials",
    "Loading spinner and skeleton components",
    "All components use design system tokens"
  ]
}
```

```json
{
  "id": "story-0.4",
  "title": "Create Zustand Store Architecture",
  "phase": "0-foundation",
  "passes": false,
  "acceptance_criteria": [
    "Zustand stores: user, teams, rounds, games",
    "Persist middleware for offline support",
    "Actions for CRUD operations",
    "Optimistic updates with rollback",
    "DevTools integration"
  ]
}
```

```json
{
  "id": "story-0.5",
  "title": "Implement Navigation System",
  "phase": "0-foundation",
  "passes": false,
  "acceptance_criteria": [
    "Bottom tab navigation (Home, Leaderboard, Profile)",
    "Team switcher dropdown in header",
    "Active tab indicator",
    "Smooth transitions between views",
    "Back navigation where appropriate"
  ]
}
```

---

## PHASE 1: CORE APP

```json
{
  "id": "story-1.1",
  "title": "Build Home Dashboard",
  "phase": "1-core",
  "passes": false,
  "acceptance_criteria": [
    "Display current team name with switcher",
    "Show next scheduled round card",
    "Display user's season winnings prominently",
    "Quick sign-up button for next round",
    "Group pot total visible",
    "Mobile responsive layout"
  ]
}
```

```json
{
  "id": "story-1.2",
  "title": "Build Round Sign-Up Card",
  "phase": "1-core",
  "passes": false,
  "acceptance_criteria": [
    "Show round date, time, course",
    "Display signed-up players with avatars",
    "Show spots remaining (X/8)",
    "Sign Me Up button (one-tap)",
    "Withdraw button with fee warning",
    "Core vs Sub player distinction"
  ]
}
```

```json
{
  "id": "story-1.3",
  "title": "Build Player List Component",
  "phase": "1-core",
  "passes": false,
  "acceptance_criteria": [
    "List all signed-up players",
    "Show name, handicap, role (core/sub)",
    "Indicate if player is user (highlighted)",
    "Show sign-up timestamp",
    "Expandable to show contact info"
  ]
}
```

```json
{
  "id": "story-1.4",
  "title": "Build Games Section",
  "phase": "1-core",
  "passes": false,
  "acceptance_criteria": [
    "Display individual matches for this round",
    "Show WAD pot amount",
    "Match cards show: Player A vs Player B, $amount",
    "Visual indicator for user's matches",
    "Add Match button (admin only)"
  ]
}
```

```json
{
  "id": "story-1.5",
  "title": "Build Team Switcher",
  "phase": "1-core",
  "passes": false,
  "acceptance_criteria": [
    "Dropdown shows all user's teams",
    "Team name and icon displayed",
    "Switching updates all dashboard data",
    "Selected team persisted",
    "Create New Team option (admin)"
  ]
}
```

```json
{
  "id": "story-1.6",
  "title": "Build Backout Fee Display",
  "phase": "1-core",
  "passes": false,
  "acceptance_criteria": [
    "Show current backout fee based on timing",
    "Display escalation schedule",
    "Group pot total visible",
    "Recent backout history",
    "Fee goes to pot animation"
  ]
}
```

---

## PHASE 2: AUTHENTICATION

```json
{
  "id": "story-2.1",
  "title": "Build Registration Flow",
  "phase": "2-auth",
  "passes": false,
  "acceptance_criteria": [
    "Email/password registration",
    "Name, handicap, Venmo handle fields",
    "Google OAuth option",
    "Validation with helpful errors",
    "Welcome flow after registration"
  ]
}
```

```json
{
  "id": "story-2.2",
  "title": "Build Login Flow",
  "phase": "2-auth",
  "passes": false,
  "acceptance_criteria": [
    "Email/password login",
    "Google OAuth option",
    "Remember me functionality",
    "Forgot password flow",
    "Redirect to dashboard on success"
  ]
}
```

```json
{
  "id": "story-2.3",
  "title": "Build Profile Page",
  "phase": "2-auth",
  "passes": false,
  "acceptance_criteria": [
    "Display user info (name, email, handicap)",
    "Edit profile functionality",
    "Avatar upload",
    "Venmo handle management",
    "Teams membership list",
    "Logout button"
  ]
}
```

```json
{
  "id": "story-2.4",
  "title": "Implement Protected Routes",
  "phase": "2-auth",
  "passes": false,
  "acceptance_criteria": [
    "Unauthenticated users redirect to login",
    "Auth state persists across refreshes",
    "Loading state while checking auth",
    "Role-based access (admin vs member)"
  ]
}
```

---

## PHASE 3: ROUND MANAGEMENT

```json
{
  "id": "story-3.1",
  "title": "Build Sign-Up Functionality",
  "phase": "3-rounds",
  "passes": false,
  "acceptance_criteria": [
    "One-tap sign-up button",
    "Optimistic UI update",
    "Confirmation toast",
    "Real-time player list update",
    "Capacity enforcement (8 max)"
  ]
}
```

```json
{
  "id": "story-3.2",
  "title": "Build Withdrawal Functionality",
  "phase": "3-rounds",
  "passes": false,
  "acceptance_criteria": [
    "Withdraw button with fee warning",
    "Confirmation modal showing fee amount",
    "Fee automatically added to pot",
    "Player removed from list",
    "Backout logged for history"
  ]
}
```

```json
{
  "id": "story-3.3",
  "title": "Build Round Creation (Admin)",
  "phase": "3-rounds",
  "passes": false,
  "acceptance_criteria": [
    "Admin can create new round",
    "Set date, time, course",
    "Configure games for round",
    "Set custom backout fees (optional)",
    "Round appears for all team members"
  ]
}
```

```json
{
  "id": "story-3.4",
  "title": "Build Round History View",
  "phase": "3-rounds",
  "passes": false,
  "acceptance_criteria": [
    "List of past rounds",
    "Show date, players, games",
    "Expandable to see results",
    "Filter by date range",
    "Link to full round details"
  ]
}
```

```json
{
  "id": "story-3.5",
  "title": "Build Recurring Round Support",
  "phase": "3-rounds",
  "passes": false,
  "acceptance_criteria": [
    "Auto-create weekly rounds",
    "Based on team's regular day/time",
    "Admin can modify generated rounds",
    "Skip weeks (holidays) option"
  ]
}
```

```json
{
  "id": "story-3.6",
  "title": "Build Round Notifications",
  "phase": "3-rounds",
  "passes": false,
  "acceptance_criteria": [
    "Email reminder day before round",
    "Push notification if PWA installed",
    "Sign-up reminder if not signed up",
    "Summary notification after round"
  ]
}
```

---

## PHASE 4: GAMES & BETTING

```json
{
  "id": "story-4.1",
  "title": "Build Individual Match Creator",
  "phase": "4-games",
  "passes": false,
  "acceptance_criteria": [
    "Select two players from signed-up list",
    "Set bet amount",
    "Create match linked to round",
    "Both players see their matches",
    "Admin or players can create"
  ]
}
```

```json
{
  "id": "story-4.2",
  "title": "Build WAD Game Management",
  "phase": "4-games",
  "passes": false,
  "acceptance_criteria": [
    "WAD pot amount configurable",
    "All signed-up players automatically included",
    "Enter results (worst score wins)",
    "Pot distributed to winner",
    "WAD history tracking"
  ]
}
```

```json
{
  "id": "story-4.3",
  "title": "Build Score Entry Interface",
  "phase": "4-games",
  "passes": false,
  "acceptance_criteria": [
    "Enter match results (winner selection)",
    "Enter WAD results (scores for ranking)",
    "Admin or participants can enter",
    "Confirmation before finalizing",
    "Auto-calculate settlements"
  ]
}
```

```json
{
  "id": "story-4.4",
  "title": "Build Settlement Calculator",
  "phase": "4-games",
  "passes": false,
  "acceptance_criteria": [
    "Calculate who owes whom after round",
    "Net calculations (A owes B $20, B owes A $15 = A owes B $5)",
    "Display settlement summary",
    "Generate Venmo payment links",
    "Mark as paid functionality"
  ]
}
```

```json
{
  "id": "story-4.5",
  "title": "Build Venmo Integration",
  "phase": "4-games",
  "passes": false,
  "acceptance_criteria": [
    "Generate Venmo deep links",
    "Pre-fill amount and note",
    "One-tap to open Venmo",
    "Track payment status",
    "Handle missing Venmo handles"
  ]
}
```

---

## PHASE 5: LEADERBOARD & STATS

```json
{
  "id": "story-5.1",
  "title": "Build Season Leaderboard",
  "phase": "5-leaderboard",
  "passes": false,
  "acceptance_criteria": [
    "Ranked list by season winnings",
    "Medal badges for top 3 (🥇🥈🥉)",
    "User's row highlighted",
    "Show rounds played, win rate",
    "Group pot total at bottom"
  ]
}
```

```json
{
  "id": "story-5.2",
  "title": "Build Player Stats Page",
  "phase": "5-leaderboard",
  "passes": false,
  "acceptance_criteria": [
    "Individual player detailed stats",
    "Head-to-head records vs others",
    "Win/loss streaks",
    "WAD wins count",
    "Total money won/lost"
  ]
}
```

```json
{
  "id": "story-5.3",
  "title": "Build Historical Archives",
  "phase": "5-leaderboard",
  "passes": false,
  "acceptance_criteria": [
    "Past season leaderboards",
    "Season champions highlighted",
    "Historical stats trends",
    "Export data option"
  ]
}
```

```json
{
  "id": "story-5.4",
  "title": "Build Group Pot Tracker",
  "phase": "5-leaderboard",
  "passes": false,
  "acceptance_criteria": [
    "Current pot balance",
    "History of contributions (backout fees)",
    "Pot usage history (bonus rounds)",
    "Projections for season end"
  ]
}
```

---

## PHASE 6: ADMIN FEATURES

```json
{
  "id": "story-6.1",
  "title": "Build Team Management",
  "phase": "6-admin",
  "passes": false,
  "acceptance_criteria": [
    "Create new team",
    "Edit team settings",
    "Add/remove members",
    "Assign admin roles",
    "Delete team (with confirmation)"
  ]
}
```

```json
{
  "id": "story-6.2",
  "title": "Build Member Management",
  "phase": "6-admin",
  "passes": false,
  "acceptance_criteria": [
    "Invite new members (email)",
    "Set core vs sub status",
    "Edit member handicaps",
    "Remove members",
    "View member activity"
  ]
}
```

```json
{
  "id": "story-6.3",
  "title": "Build Settings Panel",
  "phase": "6-admin",
  "passes": false,
  "acceptance_criteria": [
    "Edit backout fee schedule",
    "Set default games",
    "Configure regular day/time/course",
    "Notification preferences",
    "Export team data"
  ]
}
```

```json
{
  "id": "story-6.4",
  "title": "Build Audit Log",
  "phase": "6-admin",
  "passes": false,
  "acceptance_criteria": [
    "Log all significant actions",
    "Show who did what when",
    "Filter by action type",
    "Export log data"
  ]
}
```

---

## PHASE 7: REAL-TIME & NOTIFICATIONS

```json
{
  "id": "story-7.1",
  "title": "Implement Real-Time Updates",
  "phase": "7-realtime",
  "passes": false,
  "acceptance_criteria": [
    "Sign-ups update in real-time",
    "Leaderboard updates live",
    "No page refresh needed",
    "Optimistic UI with sync"
  ]
}
```

```json
{
  "id": "story-7.2",
  "title": "Build Push Notifications",
  "phase": "7-realtime",
  "passes": false,
  "acceptance_criteria": [
    "PWA push notification support",
    "Round reminder notifications",
    "New match notifications",
    "Settlement reminder",
    "Opt-in/out controls"
  ]
}
```

```json
{
  "id": "story-7.3",
  "title": "Build Email Notifications",
  "phase": "7-realtime",
  "passes": false,
  "acceptance_criteria": [
    "Round reminder emails",
    "Weekly summary emails",
    "Settlement notifications",
    "Configurable preferences"
  ]
}
```

```json
{
  "id": "story-7.4",
  "title": "Build Offline Support",
  "phase": "7-realtime",
  "passes": false,
  "acceptance_criteria": [
    "App works offline (cached data)",
    "Queue actions when offline",
    "Sync when back online",
    "Offline indicator UI"
  ]
}
```

---

## PHASE 8: POLISH & PWA

```json
{
  "id": "story-8.1",
  "title": "Implement PWA Support",
  "phase": "8-polish",
  "passes": false,
  "acceptance_criteria": [
    "Service worker configured",
    "App manifest with icons",
    "Install prompt on mobile",
    "Works as standalone app",
    "Offline-first architecture"
  ]
}
```

```json
{
  "id": "story-8.2",
  "title": "Performance Optimization",
  "phase": "8-polish",
  "passes": false,
  "acceptance_criteria": [
    "Lighthouse score > 90",
    "Images optimized",
    "Code splitting",
    "Lazy loading routes",
    "Bundle size minimized"
  ]
}
```

```json
{
  "id": "story-8.3",
  "title": "Accessibility Audit",
  "phase": "8-polish",
  "passes": false,
  "acceptance_criteria": [
    "WCAG AA compliant",
    "Keyboard navigation",
    "Screen reader tested",
    "Color contrast verified",
    "Focus indicators visible"
  ]
}
```

```json
{
  "id": "story-8.4",
  "title": "Final QA and Launch",
  "phase": "8-polish",
  "passes": false,
  "acceptance_criteria": [
    "Full feature testing",
    "Cross-browser testing",
    "Mobile device testing",
    "Security review",
    "Deploy to production"
  ]
}
```

---

## FILE STRUCTURE

```
golf-squad/
├── src/
│   ├── app/                    # App entry and routing
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── round/              # Round-related components
│   │   ├── game/               # Game/betting components
│   │   ├── leaderboard/        # Leaderboard components
│   │   └── layout/             # Layout components
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── lib/                    # Utilities and helpers
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## COMMANDS

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## DEPLOYMENT

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### Environment Variables
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

---

## RALPH EXECUTION

```bash
# Navigate to project
cd ~/Desktop/Golf-Squad-App/golf-squad

# Initialize Ralph files (if using)
mkdir -p .ralph

# Run development
npm run dev

# Run autonomous loop
# Use Claude Code with: /ralph-loop
```

---

## SUCCESS METRICS

1. **Adoption:** All group members actively using app within 2 weeks
2. **Engagement:** 100% sign-ups completed via app (no group texts)
3. **Accountability:** Backout rate drops by 50%+
4. **Settlement Speed:** All bets settled within 24 hours of round
5. **Expansion:** At least 2 other golf groups requesting access

---

## COST BREAKDOWN

- **Development:** You're building it! ($0)
- **Hosting:** Netlify/Vercel free tier ($0)
- **Firebase:** Free tier covers small groups ($0)
- **Domain (optional):** $12/year
- **Total:** $0-12/year

Compare to golf league software: $200-500/year per group

---

## BUSINESS OPPORTUNITY

Once proven with your group:
1. Package as "Golf Squad Pro"
2. Offer to other golf groups
3. Charge $50-100/year per group
4. 10 groups = $500-1,000/year passive income
5. 100 groups = $5,000-10,000/year

---

*Built with the Ralph Autonomous Development Workflow*
*Golf Squad — Where Every Wednesday Gets Better*

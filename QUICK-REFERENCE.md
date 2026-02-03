# 🎯 QUICK REFERENCE - GolfSquad

## Your App is LIVE: http://localhost:5173/

---

## ✅ What You Have

**Working Features:**
- ✅ Multi-team support (switch teams in dropdown)
- ✅ 5 core + 3 subs (8 player capacity)
- ✅ Individual match betting system
- ✅ WAD (Worst Available Day) pot games
- ✅ Backout fees (escalating: $5→$10→$20→$30)
- ✅ Group pot tracker ($85 currently)
- ✅ One-tap sign-ups
- ✅ Real-time player list
- ✅ Season leaderboard
- ✅ Profile with stats
- ✅ Mobile-responsive design

---

## 🎮 How To Use It

### Sign Up for Wednesday:
1. Open http://localhost:5173/
2. See "Wednesday League" card
3. Click "Sign Me Up!" button
4. Done!

### Withdraw (with fee):
1. Click "Withdraw" button
2. See backout fee amount (based on timing)
3. Confirm → fee added to group pot

### Switch Teams:
1. Click team name at top ("Wednesday League")
2. Select "Weekend Warriors" or create new team
3. See separate sign-ups/leaderboard

### Check Leaderboard:
1. Tap "Leaderboard" button at bottom
2. See season standings
3. Your row highlighted in green
4. Group pot shown at bottom

---

## 🔧 Quick Customizations

### Add Your Real Players

Edit `/home/claude/golf-squad/src/App.tsx` line 90:

```typescript
{ id: 'p1', name: 'YOUR NAME', email: 'you@email.com', 
  handicap: 12, venmoHandle: 'yourvenmo', role: 'admin' },
{ id: 'p2', name: 'FRIEND 1', email: 'friend1@email.com',
  handicap: 8, venmoHandle: 'friend1venmo', role: 'member' },
// Add 3-6 more players...
```

### Change Backout Fees

Line 126 in App.tsx:

```typescript
backoutFeeSchedule: {
  moreThan48Hours: 5,    // ← Change these
  moreThan24Hours: 10,
  lessThan24Hours: 20,
  morningOf: 30
}
```

### Update Your Regular Info

Line 119:

```typescript
regularDay: 'Wednesday',           // ← Your day
regularTime: '5:30 PM',            // ← Your tee time
regularCourse: 'Meadowbrook Golf Club', // ← Your course
```

### Change Team Capacity

Line 113:

```typescript
maxPlayers: 8,  // ← Change to 6, 10, 12, etc
corePlayers: 5, // ← Your core player count
```

---

## 🚀 Deploy It (15 minutes)

### Step 1: Build for production
```bash
cd /home/claude/golf-squad
npm run build
```

### Step 2: Deploy to Netlify
1. Go to netlify.com
2. Sign up (free)
3. Drag the `/home/claude/golf-squad/dist` folder
4. Done! You get a link like: `random-name.netlify.app`

### Step 3: Share with your group
Send them the link - they can add to home screen on iPhone/Android!

---

## 📱 Install as Phone App

### iPhone:
1. Open link in Safari
2. Tap Share button
3. "Add to Home Screen"
4. Looks like a real app!

### Android:
1. Open link in Chrome
2. Tap Menu (3 dots)
3. "Install App" or "Add to Home Screen"

---

## 💡 Pro Tips

### Backout Fees WORK:
- Escalating fees reduce last-minute cancellations
- Group pot creates fun "bonus" rounds
- $85 pot → special end-of-season round!

### Individual Matches + WAD:
- Everyone has skin in the game (individual match)
- Group element keeps everyone engaged (WAD)
- Mix and match weekly for variety

### Multi-Team is Powerful:
- Same players, different formats
- Weekend = casual, Wednesday = competitive
- Easy to propose "bonus" rounds

---

## 🐛 Troubleshooting

### App won't start?
```bash
cd /home/claude/golf-squad
npm install
npm run dev
```

### Want to restart?
```bash
lsof -ti:5173 | xargs kill
npm run dev
```

### Need help?
Everything's in: [SETUP-GUIDE.md](./SETUP-GUIDE.md)

---

## 📊 What Your Group Will See

**Home Tab:**
- Your season total (green if winning!)
- Next round date & course
- Group pot amount
- Sign-up button (or "You're signed up!")
- Full player list with handicaps
- Games this week (Individual matches + WAD)

**Leaderboard Tab:**
- 1st place gets gold badge 🥇
- 2nd gets silver 🥈
- 3rd gets bronze 🥉
- Your row highlighted
- Group pot displayed

**Profile Tab:**
- Your stats
- Venmo handle
- Teams you're in
- Admin badge if applicable

---

## ⚡ Next Actions

**Today (30 min):**
1. ✅ Replace mock names with your real group
2. ✅ Test sign-up flow
3. ✅ Adjust backout fees if needed
4. ✅ Build and deploy

**This Week:**
1. Share link with your group
2. Get everyone signed up
3. Use it for Wednesday round
4. Collect feedback

**Next Week:**
1. Add Firebase (real-time sync)
2. Add push notifications
3. Add settlement calculator
4. Consider adding admin panel

---

## 💰 Business Idea

Once you prove it works:
- Package as "GolfSquad Pro"
- Offer to other golf groups
- Charge $50-100/year per group
- 10 groups = $500-1k/year passive income

This fits perfectly in your Creative Ventures portfolio!

---

## 🎉 Success Metrics

You'll know it's working when:
- ✅ Sign-ups done by Monday (no group texts!)
- ✅ Backout rate drops to near zero
- ✅ Everyone checks leaderboard regularly
- ✅ Other groups ask "what app is that?"

---

## Files You Care About

```
golf-squad/
├── src/App.tsx           ← EDIT THIS (all your customizations)
├── SETUP-GUIDE.md        ← Full instructions
├── README.md             ← Project overview
└── QUICK-REFERENCE.md    ← This file!
```

**Everything else:** Don't touch unless you know what you're doing!

---

## Commands You'll Use

```bash
# Start app
npm run dev

# Build for deployment
npm run build

# Stop app
Ctrl+C
```

---

**You're ready to go!** 🏌️⛳

Open http://localhost:5173/ and start customizing!
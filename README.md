# 🌙 Ramadan Good Deeds Tracker

A beautiful, kid-friendly web app to track good deeds during Ramadan and earn candy rewards!

## ✨ Features

- **3 User Profiles** — Musa, Rufa (children), and Bilal (Admin)
- **PIN-Protected Admin** — Bilal's panel is locked behind a 4-digit PIN
- **Good Deeds Tracking** — Log predefined deeds and earn candy (max 5/day)
- **Custom Deed Submissions** — Children submit extra deeds for admin approval
- **Candy Store / Trade-In** — Spend saved candy on real rewards
- **Admin Panel** — Approve/reject submissions, manage candy, lock days
- **Full localStorage persistence** — All data saved locally, no backend needed

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# 1. Extract the zip file
unzip ramadan-tracker.zip
cd ramadan-tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

### First Run
1. Open `http://localhost:3000`
2. Click **Bilal (Admin)** — you'll be prompted to set a 4-digit PIN
3. Set your PIN (you'll enter it twice to confirm)
4. You're now in the Admin panel!
5. Go back to the home screen and try **Musa** or **Rufa** — no PIN needed for kids

## 👨‍👩‍👧‍👦 How It Works

### For Kids (Musa & Rufa)
1. Tap your name on the home screen
2. **Deeds Tab** — Tap deeds to log them and earn 🍬 candy
3. **Store Tab** — Spend candy on rewards!
4. **My Deeds Tab** — Submit custom good deeds for Admin approval
5. **History Tab** — See past store trades

### For Bilal (Admin)
1. Tap Bilal on home screen, enter your PIN
2. **Pending Tab** — Review and approve/reject custom deed submissions
3. **Children Tab** — See each child's candy count, add/deduct candy, lock or reset days
4. **History Tab** — See all resolved submissions
5. **Settings Tab** — Change your PIN

## 📋 Rules Built Into the App

- Maximum **5 candies per day** per child
- No **duplicate deeds** in a single day (except Qur'an pages — they're repeatable!)
- **Help Sibling** has a **2-day cooldown**
- Only **1 store trade per day**
- Arguing = **-1 candy penalty** (Admin can apply this)
- Lying = Admin can **lock the day** (no more candy that day)

## 🏪 Candy Store

| Reward | Cost |
|--------|------|
| Ice Cream / Waffle / Cookie | 15 🍬 |
| Popcorn / Smoothie | 20 🍬 |
| Fries | 20 🍬 |
| Pick dinner (after Ramadan) | 30 🍬 |
| Choose Eid dessert | 40 🍬 |
| Pick Eid weekend activity | 50 🍬 |

**Candy Conversion:**
- 1 packaged candy = 3 🍬
- 2 Smarties = 1 🍬

## 🔧 Tech Stack

- **Next.js 14** (React framework)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **localStorage** (data persistence)
- **Nunito + Fredoka One** fonts (Google Fonts)

## 📁 Project Structure

```
ramadan-tracker/
├── pages/
│   ├── _app.js          # App wrapper with auth context
│   ├── _document.js     # HTML document with fonts
│   ├── index.js         # Home / user selection screen
│   ├── user/
│   │   └── [userId].js  # Child dashboard (Musa/Rufa)
│   └── admin/
│       └── index.js     # Admin panel (Bilal)
├── components/
│   ├── CandyBar.js      # Candy progress display
│   ├── DeedCard.js      # Individual deed card
│   ├── PinModal.js      # PIN entry/setup modal
│   ├── RewardCard.js    # Store reward card
│   ├── SubmissionCard.js # Custom deed submission card
│   ├── Toast.js         # Toast notifications
│   └── TopBar.js        # Navigation bar
├── utils/
│   ├── auth.js          # Auth context (React Context)
│   └── storage.js       # All localStorage operations
├── styles/
│   └── globals.css      # Global styles + Tailwind
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── package.json
```

## 🌟 Ramadan Mubarak!

*May Allah accept our good deeds and grant us all a blessed Ramadan.* 🤲

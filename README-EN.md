English | [简体中文](README.md)

# The Regret Mailbox (遗憾信箱)

A warm and healing web app to record regrets and write letters to your future self.

## ✨ Features

### 🖋️ Regret Submission
- Record unsaid words, missed chances, or deep apologies
- Support text, images, tags, and mood logging
- Anonymous or signed submissions to protect privacy
- Multiple mood categories: Regret, Sadness, Nostalgia, Hope, Anger

### ⏰ Time Capsule
- Write to your future self and set an open date
- Add questions for time to answer
- Auto reminders when due—feel the healing power of time
- Safe local storage to protect personal privacy

### 📋 Regret Management
- Multiple views: Grid, List, Timeline
- Powerful search and filtering
- Categorize by mood, tags, and time
- Support delete and detail view

### 🎨 User Experience
- Warm and soothing UI design
- Light/Dark theme switch
- Smooth animations
- Fully responsive, mobile-friendly

### 🔒 Data Security
- All data stored locally in the browser only
- Support data export for backup
- Support data import for restore
- Never uploaded to any server

## 🚀 Tech Stack

- Frontend: Preact + TypeScript
- Build: Vite
- State: @preact/signals
- Icons: Lucide Preact
- Dates: date-fns
- Package manager: pnpm

## 📦 Install & Run

### Prerequisites
- Node.js 16+
- pnpm

### Install dependencies
```bash
pnpm install
```

### Dev mode
```bash
pnpm dev
```

### Build for production
```bash
pnpm build
```

### Preview production
```bash
pnpm preview
```

## 🎯 User Guide

### 1. Submit a Regret
1. Click "Submit Regret"
2. Fill in title and content
3. Choose signature type (anonymous or nickname)
4. Select current mood
5. Add tags (optional)
6. Upload images (optional)
7. Click "Submit"

### 2. Create a Time Capsule
1. Click "Create Time Capsule"
2. Fill in title and words to your future self
3. Set the open time
4. Add questions for your future self (optional)
5. Click "Create"

### 3. View & Manage
- View all records in "Regret List"
- Use search to find quickly
- Filter by mood or tags
- Switch between different view modes
- Click for details or delete

### 4. Data Management
- In "Settings", export data for backup
- Import previous backups
- Clear all data (use cautiously)

## 🔧 Development

### Project Structure
```
src/
├── components/          # Components
│   ├── Header/          # Header
│   ├── Navigation/      # Navigation
│   ├── Home/            # Home
│   ├── RegretSubmission/# Regret submission
│   ├── TimeCapsule/     # Time capsule
│   ├── RegretList/      # Regret list
│   ├── About/           # About page
│   ├── Settings/        # Settings page
│   └── Layout/          # Layout
├── store/               # State management
├── types/               # Type definitions
├── utils/               # Utilities
└── tests/               # Tests
```

### Core
- State: @preact/signals for reactive state
- Storage: localStorage for all data
- Type safety: full TypeScript types
- Responsive: CSS Grid & Flexbox
- Animations: CSS transitions and animations

### Testing
An in-app testing page is built in (accessible from Settings) to verify core functions.

## 🎨 Design Principles

### Warm & Healing
- Warm color palette
- Soft corners and shadows
- Calming animations

### Privacy by Default
- All data stored locally
- Anonymous submissions supported
- No personal information collected

### Emotional Healing
- Record to release emotions
- Time capsules bring hope
- Review growth and change

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- Initial release
- Regret submission
- Time capsule
- Regret management
- Complete UI/UX
- Data security

## 🤝 Contributing

Issues and PRs are welcome to improve this project.

## 📄 License

MIT License

## 💝 Acknowledgements

Thanks to everyone who inspired and supported this project.

May time treat everyone gently.

---

"Record it, let time heal, and let growth answer."

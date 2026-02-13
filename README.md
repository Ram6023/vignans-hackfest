<div align="center">

# 🚀 VIGNAN'S HACKIFY 2026
## *Innovation Meets Execution*

![Hackify Banner](https://capsule-render.vercel.app/api?type=waving&color=7c3aed&height=300&section=header&text=Vignan's%20Hackify%202026&fontSize=60&animation=fadeIn&fontAlignY=38&desc=Build%20·%20Innovate%20·%20Transform&descAlignY=55&descAlign=50)

<a href="">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=statuspage" alt="Status" />
</a>
<a href="">
  <img src="https://img.shields.io/badge/PWA-Enabled-8b5cf6?style=for-the-badge&logo=pwa" alt="PWA" />
</a>
<a href="">
  <img src="https://img.shields.io/badge/Mobile-Optimized-06b6d4?style=for-the-badge&logo=android" alt="Mobile" />
</a>
<a href="">
  <img src="https://img.shields.io/badge/Made%20With-Love-f43f5e?style=for-the-badge&logo=heart" alt="Made With Love" />
</a>

<br/>

**The official innovation portal for Vignan University's premier 24-hour hackathon.**  
*A Progressive Web App that works everywhere — desktop, mobile, and offline.*

[**🌐 Live Demo**](https://vignans-hackify.vercel.app) · [**🐛 Report Bug**](https://github.com/Ram6023/vignans-hackify/issues) · [**✨ Request Feature**](https://github.com/Ram6023/vignans-hackify/issues)

</div>

---

## 📱 **Install as App**

This is a **Progressive Web App (PWA)** — install it on your device for the best experience!

<table>
<tr>
<td width="50%">

### 📲 Mobile (Android/iOS)
1. Open the app in your browser
2. Tap the **"Install Hackify"** banner
3. Or use: **Menu → Add to Home Screen**
4. Enjoy native app experience!

</td>
<td width="50%">

### 💻 Desktop (Chrome/Edge)
1. Visit the app in your browser
2. Click the **install icon** in URL bar
3. Or: **Menu → Install App**
4. Access from desktop anytime!

</td>
</tr>
</table>

---

## 🔥 **Key Features**

| Feature | Description | Status |
| :--- | :--- | :---: |
| **📱 PWA Support** | Install on any device, works **offline**, push notifications ready | ✅ |
| **🎨 Premium UI/UX** | Stunning **Purple & White** theme, glassmorphism, smooth animations | ✅ |
| **⚡ Real-time Updates** | Live announcements & scoring powered by **WebSockets** | ✅ |
| **🔐 Role-Based Auth** | Secure login for **Teams**, **Volunteers**, **Judges** & **Admins** | ✅ |
| **📊 Live Dashboard** | Dynamic stats, leaderboard, and track management | ✅ |
| **🌙 Offline Mode** | Continue working even without internet connection | ✅ |
| **👆 Touch Optimized** | 44px touch targets, safe area support for notched devices | ✅ |

---

## 🛠️ **Tech Stack**

Built with cutting-edge web technologies for maximum performance.

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Workbox](https://img.shields.io/badge/Workbox-FF6D00?style=for-the-badge&logo=google&logoColor=white)

---

## 🚀 **Getting Started**

Ready to hack? Follow these simple steps to get the portal running locally.

### **1. Clone the Repo**
```bash
git clone https://github.com/Ram6023/vignans-hackify.git
cd vignans-hackify
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` and start building! ✨

### **4. Build for Production**
```bash
npm run build
npm run preview
```

---

## 📂 **Project Architecture**

```bash
vignans-hackify/
├── 📂 components/        # 🧩 Reusable UI Components
│   ├── Layout.tsx        # Main app layout
│   ├── Timer.tsx         # Hackathon countdown
│   └── AnnouncementFeed  # Real-time announcements
├── 📂 pages/             # 📄 Dashboard Pages
│   ├── LandingPage.tsx   # Public landing
│   ├── TeamDashboard     # Team management
│   ├── JudgeDashboard    # Judging portal
│   ├── AdminDashboard    # Admin controls
│   └── VolunteerDashboard# Volunteer panel
├── 📂 hooks/             # 🪝 Custom React Hooks
│   ├── usePWA.tsx        # PWA install/offline
│   └── useRealtime.ts    # WebSocket subscriptions
├── 📂 services/          # 🔌 Backend Services
│   ├── websocket.ts      # Real-time connection
│   └── mockDb.ts         # Development database
├── 📂 public/            # 📁 Static Assets
│   ├── icons/            # PWA icons (all sizes)
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service worker
├── 🎨 index.css          # 🖌️ Global Styles
├── ⚛️ App.tsx            # 🧠 Main App Logic
└── ⚙️ vite.config.ts     # ⚡ Build + PWA Config
```

---

## 📱 **PWA Features**

### **Offline Support**
- ✅ Static assets cached automatically
- ✅ Google Fonts cached for 1 year
- ✅ Network-first strategy for dynamic content
- ✅ Offline indicator when disconnected

### **Installation**
- ✅ Custom install prompt banner
- ✅ iOS & Android home screen icons
- ✅ Standalone display mode
- ✅ Splash screen on launch

### **Mobile Optimizations**
- ✅ Safe area insets (iPhone notch support)
- ✅ Touch-optimized 44px targets
- ✅ Responsive grid layouts
- ✅ Landscape mode support

---

## 🎨 **Design System**

Our design philosophy is **"Bold, Clean, & Futuristic"**.

| Element | Value |
| :--- | :--- |
| **Primary Color** | `#7c3aed` (Violet) → `#4f46e5` (Indigo) |
| **Accent Colors** | Cyan `#06b6d4`, Emerald `#10b981`, Rose `#f43f5e` |
| **Display Font** | `Bebas Neue` — Strong & Impactful |
| **Body Font** | `Inter` — Clean & Readable |
| **Code Font** | `JetBrains Mono` — Developer Focused |
| **Effects** | Glassmorphism, Gradient Orbs, Smooth Parallax |

---

## 🔧 **Environment Variables**

Create a `.env.local` file for API configuration:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## 📜 **Available Scripts**

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production with PWA |
| `npm run preview` | Preview production build locally |

---

## 🌐 **Browser Support**

| Browser | Support |
| :--- | :---: |
| Chrome 90+ | ✅ Full PWA |
| Firefox 90+ | ✅ Full PWA |
| Safari 15+ | ✅ Full PWA |
| Edge 90+ | ✅ Full PWA |
| Mobile Chrome | ✅ Install + Offline |
| Mobile Safari | ✅ Install + Offline |

---

<div align="center">

### 🤝 **Contributors**

*We love open source! PRs are welcome.*

<a href="https://github.com/Ram6023/vignans-hackify/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Ram6023/vignans-hackify" />
</a>

<br/>

### ⭐ **Star This Repo**

If you find this useful, please give it a star! It helps others discover the project.

[![GitHub stars](https://img.shields.io/github/stars/Ram6023/vignans-hackify?style=social)](https://github.com/Ram6023/vignans-hackify)

<br/>

**© 2026 VITS**  
*Built with code, caffeine, and chaos.* ☕

![Footer](https://capsule-render.vercel.app/api?type=waving&color=7c3aed&height=100&section=footer)

</div>

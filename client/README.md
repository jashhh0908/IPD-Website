# Sentry — Accident Detection & Alert System

Sentry is a professional, institutional-grade web portal designed for automated traffic accident detection, severity classification, and emergency response coordination. By integrating computer vision telemetry (e.g., YOLOv8 and pose estimation) with the workflows of emergency responders, insurance adjusters, and citizens, Sentry aims to minimize response delays and streamline post-accident procedures.

---

## 🚀 Key Features

*   **Role-Based Access Control (RBAC)**: Secure, role-specific portals for:
    *   **Law Enforcement (Mumbai Police)**: Real-time command dashboard for Bandra PS, searchable/filterable incident databases, statistical analytics, and automated FIR-style printable reports.
    *   **Insurance Providers**: Claim review queue, damage assessment audit logs (repair and medical estimates), and decision controls synced with accident video feeds.
    *   **Citizen / Victim**: Case tracking timeline, camera footage snapshots download/print, and legal appeals dispute submission form.
*   **Warm Design System**: Grounded charcoal backgrounds, gold/amber active accents, and muted earthy status badges designed for readability in institutional command centers.
*   **Centralized Architecture**: Centralized routing, separated mock data modules, and robust mock API services designed for rapid transition to REST/GraphQL backends.

---

## 🛠️ Tech Stack

*   **Core**: React 19, JavaScript (ES6+)
*   **Routing**: React Router v7 (Lazy loaded routes + Protected and Role-based guards)
*   **Build Tool**: Vite
*   **Styling**: Vanilla CSS custom design system (Variables, Flexbox, CSS Grid)
*   **Formatting**: Built-in INR currency and formal date-time formatters

---

## 📂 Folder Structure

```
IPD-SENTRY/
├── docs/                     # Comprehensive architecture documentation
├── public/                   # Public assets
├── src/
│   ├── assets/               # Local images & icons
│   ├── config/               # Telemetry and system config
│   ├── constants/            # Centralized constants (roles, routes, status)
│   ├── context/              # Global state context (AuthContext)
│   ├── data/                 # Segmented mock databases (police, insurance, victim)
│   ├── hooks/                # Reusable React hooks (useAuth, useToast)
│   ├── routes/               # Routing structure (AppRoutes, ProtectedRoute)
│   ├── services/             # Mock API data services
│   ├── styles/               # Global stylesheet and layout tokens
│   ├── utils/                # Helper utilities (currency, date-time formatters)
│   ├── components/           # Reusable UI elements
│   │   ├── common/           # Spinner, Modal, EmptyState, ErrorBoundary
│   │   ├── layout/           # Sidebar, Header, LayoutShell
│   │   ├── ui/               # Button, StatusBadge, Toast
│   │   ├── cards/            # KPI StatCards
│   │   └── charts/           # Plain CSS custom bar/progress charts
│   ├── pages/
│   │   ├── auth/             # LoginPage
│   │   ├── police/           # Police portal dashboards and reports
│   │   ├── insurance/        # Insurance claim reviews
│   │   └── victim/           # Victim tracking timeline and appeals
│   ├── App.jsx               # Root App routing wrapper
│   └── main.jsx              # React entry bootstrap
├── index.html                # Branded main index
├── package.json              # Project script & package dependencies
└── vite.config.js            # Vite configuration
```

---

## 💻 Running Locally

### 1. Pre-requisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Installation
Clone or navigate to the project directory and run:
```bash
npm install
```

### 3. Start Development Server
Start the Vite local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
To build a production bundle and verify compiling:
```bash
npm run build
```
This output is saved to the `/dist` directory.

---

## 🔑 Demo Credentials

To access the different portals, click on a role card and use the credentials below:
*   🚓 **Law Enforcement**: `police01` (Password: `demo`)
*   🏢 **Insurance Provider**: `insurance01` (Password: `demo`)
*   👤 **Citizen / Victim**: `victim01` (Password: `demo`)

---

## 📈 Future Improvements

1.  **Backend Integration**: Swap the mock services (`src/services/`) with live REST or GraphQL endpoints (e.g. Node/Express, Django, or FastAPI).
2.  **Live Video Processing**: Connect the video player placeholders to live RTSP camera feeds or AWS Kinesis Video Streams with YOLOv8 inference running server-side.
3.  **Real-time WebSockets**: Implement socket-based pushes for instant emergency alerts to the dispatcher's overview screen without requiring manual page reloads.
4.  **Database Integration**: Bind police reports to PostgreSQL and citizen data to MongoDB.

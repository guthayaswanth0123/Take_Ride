# 🚗 Take_Ride (GoRide) – Ride Management Platform

> ⚠️ **Development Status**: This project is currently **under active development**. Features, APIs, and UI components are continuously being updated and enhanced.

---

## 📌 About the Project

**Take_Ride** is a full-stack, enterprise-grade ride hailing and management platform designed to deliver seamless transportation workflows for **Riders**, **Drivers**, and **Administrators**.

Built with a modern TypeScript stack, **Take_Ride** handles the complete ride lifecycle—from ride requests, fare estimations, and driver dispatching to real-time location tracking, payment integration, and administrative oversight.

---

## ✨ Key Features

### 👤 Rider Experience
* **Ride Requests & Booking**: Request rides with interactive pickup and destination selection.
* **Real-time Map Tracking**: Live driver location updates using Socket.io and Leaflet / Google Maps.
* **Ride History & Status**: View detailed ride history, receipts, and current ride progress.

### 🚘 Driver Experience
* **Driver Onboarding**: Apply to become a driver with vehicle verification info.
* **Ride Dispatching**: View nearby available requests, accept or reject incoming ride offers.
* **Ride Status Updates**: Transition rides through states (`Picked Up` ➔ `In Transit` ➔ `Completed`).
* **Earnings Analytics**: Monitor trip earnings and ride completion statistics.

### 🛡️ Admin & Control Center
* **User & Driver Management**: Approve driver applications, suspend drivers, or block malicious accounts.
* **Ride Oversight**: Monitor active, completed, and canceled rides across the system.
* **Analytics & Reports**: System-wide revenue, ride metrics, and driver activity reports.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **State & Data Fetching** | Redux Toolkit, RTK Query |
| **Styling & UI** | Tailwind CSS v4, Radix UI, Framer Motion, Lucide Icons |
| **Maps & Realtime** | React-Leaflet, Google Maps API, Socket.io-client |
| **Backend Framework** | Node.js, Express.js, TypeScript |
| **Database & Cache** | MongoDB with Mongoose ODM, Redis |
| **Auth & Security** | JWT (Access & Refresh), Passport.js (Google OAuth2 + Local), bcryptjs |
| **Media & Payments** | Cloudinary, SSLCommerz Payment Gateway, Nodemailer (SMTP) |

---

## 📁 Repository Structure

```
Take_Ride/
├── Go_Ride_Frontend/       # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/     # UI & Feature Components
│   │   ├── redux/          # Redux Store & API Slices
│   │   ├── pages/          # Application Views & Dashboards
│   │   └── routes/         # Router Configuration
│   ├── package.json
│   └── vite.config.ts
│
├── Go_ride_backend/        # Node.js + Express + MongoDB Backend Service
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/    # Auth, User, Driver, Admin, Ride Modules
│   │   │   ├── config/     # Database, Passport, & Redis Configs
│   │   │   └── middlewares/# Auth & Error Handling Middlewares
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js** v18+ 
* **MongoDB** (Local instance or MongoDB Atlas URI)
* **Redis** (Local instance or Cloud Redis - optional fallback enabled)

### 1. Backend Setup

```bash
cd Go_ride_backend

# Install dependencies
npm install

# Start development server
npm run dev
```
> **Note**: On startup, the server automatically seeds the initial Super Admin account into MongoDB.

### 2. Frontend Setup

```bash
cd Go_Ride_Frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend will run at `http://localhost:5000`.

---

## 🔒 Environment Variables

Environment configuration files (`.env`) are kept private and excluded from version control. Example configurations are provided in `.env.example` templates within respective project directories.

---

## 📄 License

This project is licensed under the ISC License.

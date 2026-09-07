# 🚗 GoRide (Take_Ride) – Enterprise Ride-Hailing Platform

> 🌟 **Full-Stack Monorepo**: Modern React 19 + Vite Frontend paired with an Enterprise Java Spring Boot + Netty Socket.IO Real-Time Backend.

---

## 📌 Project Overview

**GoRide (Take_Ride)** is a full-stack, enterprise-grade ride-hailing and fleet management platform designed for **Riders**, **Drivers**, and **Administrators**.

It manages the complete ride lifecycle—from interactive pickup/destination mapping, fare calculations, and automated driver dispatch to real-time Socket.IO location tracking, digital payments (SSLCommerz & Cash), and admin management.

---

## ✨ Core Features

### 👤 Rider Portal
* **Interactive Leaflet Location Picker**: Pickup and drop-off selection with India pincode/address search, quick city chips, and live geocoding (`accept-language=en`).
* **Fare & ETA Calculator**: Dynamic trip estimation based on geographic route distance.
* **Real-Time Driver Tracking**: Live Socket.IO map updates showing driver coordinates and trip status (`ACCEPTED` ➔ `PICKED_UP` ➔ `IN_TRANSIT` ➔ `COMPLETED`).
* **Ride History & Billing**: View completed trips, receipts, and payment status.

### 🚘 Driver Portal
* **Driver Onboarding & Verification**: Register vehicle details, driver license, and view approval status.
* **Live Ride Request Dispatch**: View nearby pending requests, accept rides, and update ride status in real time.
* **Location Broadcasting**: Real-time driver location streaming to riders via Socket.IO.
* **Earnings & Analytics**: Monitor trip metrics and earnings.

### 🛡️ Admin & Control Center
* **User & Driver Management**: Approve driver verification applications, suspend accounts, or manage roles (`RIDER`, `DRIVER`, `ADMIN`).
* **System-wide Ride Oversight**: Monitor active, completed, and canceled rides across the platform.
* **Automated Data Seeding**: Automatic Super Admin account creation on backend startup (`admin@goride.com`).

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Vite | Fast SPA bundling with type safety |
| **State Management** | Redux Toolkit, RTK Query | Cache management and API synchronization |
| **Styling & UI** | Tailwind CSS, Radix UI, Lucide Icons | Responsive UI with Dark & Light mode |
| **Maps & Location** | Leaflet, React-Leaflet, OpenStreetMap | Open-source tile maps & location pickers |
| **Realtime Client** | Socket.IO Client | Real-time WebSocket connection to server |
| **Backend Framework** | Java 8 / 17+ (Spring Boot 2.7.18) | Enterprise Java backend service |
| **Security & Auth** | Spring Security, JWT, BCrypt | Token-based auth & HttpOnly Lax cookies |
| **Realtime Server** | Netty Socket.IO (`netty-socketio`) | Dedicated high-throughput WebSocket server |
| **Database** | MongoDB & Spring Data MongoDB | Scalable NoSQL document store |
| **Payments** | SSLCommerz SDK / Sandbox | Digital gateway and cash payment support |
| **Build Tool** | Apache Maven (`mvnw.cmd`) | Zero-installation wrapper build tool |

---

## 📁 Repository Structure

```
Take_Ride/
├── Go_Ride_Frontend/                # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/              # UI Components, Layout, Navbar, Location Picker
│   │   ├── pages/                   # Rider, Driver & Admin Pages
│   │   ├── redux/                   # Redux Store & RTK Query Slices
│   │   ├── lib/                     # Socket.IO client service
│   │   └── routes/                  # React Router Configuration
│   ├── package.json
│   └── vite.config.ts
│
├── Go_ride_backend/                 # Java Spring Boot Backend Service
│   ├── src/main/java/com/goride/
│   │   ├── config/                  # AdminSeeder & Configuration
│   │   ├── controller/              # Auth, User, Driver, Ride, Payment Controllers
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── model/                   # MongoDB Entity Models (User, Driver, Ride, Payment)
│   │   ├── repository/              # Spring Data Mongo Repositories
│   │   ├── security/                # Spring Security & JWT Filters
│   │   ├── service/                 # Business Logic Services
│   │   └── socket/                  # Netty Socket.IO Server & Event Handlers
│   ├── src/main/resources/
│   │   └── application.yml          # Spring & MongoDB Configuration
│   ├── pom.xml                      # Maven Dependencies
│   └── mvnw.cmd                     # Maven Wrapper Command Script
└── README.md                        # Primary Monorepo Documentation
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Java JDK**: Version 8 or 17+
- **Node.js**: Version 18+ & npm
- **MongoDB**: Running instance on default port `27017` (`mongodb://127.0.0.1:27017/go_ride`)

---

### 2. Backend Setup (Java Spring Boot)

Open terminal in `Go_ride_backend`:

```powershell
cd Go_ride_backend

# Run application using Maven Wrapper
.\mvnw.cmd spring-boot:run
```

* **HTTP REST Server Port**: `5000`
* **Real-time Socket.IO Port**: `5001`
* **Initial Super Admin**: `admin@goride.com` / `admin123` (automatically seeded on first run)

---

### 3. Frontend Setup (React 19 + Vite)

Open terminal in `Go_Ride_Frontend`:

```powershell
cd Go_Ride_Frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

* **Frontend Web App**: `http://localhost:5173`

---

## 🔌 API Endpoints Summary

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User/Driver/Admin Login |
| `POST` | `/api/auth/logout` | Clear HTTP Auth Cookie |
| `GET` | `/api/auth/me` | Fetch Current Authenticated User Profile |

### 👤 Users & Drivers (`/api/user`, `/api/driver`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/user/register` | Register New User |
| `POST` | `/api/driver/apply` | Driver Onboarding Application |
| `GET` | `/api/driver/rides-available` | Fetch Pending Ride Requests |
| `PATCH` | `/api/driver/rides/{id}/accept` | Accept Ride Request |
| `PATCH` | `/api/driver/rides/{id}/status` | Update Trip Status |

### 🚗 Rides (`/api/rides`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/rides/request` | Create New Ride Request |
| `GET` | `/api/rides/my-rides` | Get User Ride History |
| `GET` | `/api/rides/{id}` | Get Ride Details |
| `PATCH` | `/api/rides/{id}/cancel` | Cancel Ride Request |

### ⚡ Real-Time Socket.IO Events (Port 5001)
- `join-ride` : Join ride tracking room
- `leave-ride` : Leave ride tracking room
- `driver-location-update` : Broadcast driver GPS updates
- `ride-status-update` : Broadcast ride state transitions

---

## 📄 License

This project is licensed under the MIT License.

# Go Ride Backend (Java Spring Boot)

Enterprise-ready Java Spring Boot backend for the **Go Ride** Ride Booking System.

## Technology Stack

- **Java**: 8 / 17+ (Spring Boot 2.7.18)
- **Database**: MongoDB (Spring Data MongoDB)
- **Security**: Spring Security + JWT Authentication
- **Real-Time Communication**: Netty Socket.IO (`netty-socketio`)
- **Payment Gateway**: SSLCommerz Integration
- **Build Tool**: Maven (`mvnw.cmd`)

## Running the Application

### 1. Prerequisites
Ensure MongoDB service is running locally on port `27017` (`mongodb://127.0.0.1:27017/go_ride`).

### 2. Start Backend via Maven Wrapper
Run the following command in PowerShell / Command Prompt:

```powershell
cd Go_ride_backend
.\mvnw.cmd spring-boot:run
```

Alternatively, build and run the packaged JAR:

```powershell
.\mvnw.cmd package -DskipTests
java -jar target\go-ride-backend-1.0.0.jar
```

## API Endpoints

- **Server Port**: `5000`
- **Realtime Socket Port**: `5001`
- **Base URL**: `http://localhost:5000/api`

### Main Routes
- `POST /api/auth/login` - User Login
- `POST /api/user/register` - User Registration
- `GET /api/auth/me` - Get Current User Details
- `POST /api/rides/request` - Create Ride Request
- `GET /api/driver/rides-available` - Get Available Rides for Drivers
- `PATCH /api/driver/rides/{id}/accept` - Accept Ride Request
- `PATCH /api/admin/driver/approve/{id}` - Approve Driver Application
- `POST /api/payment/init-ride-payment/{rideId}` - Initialize SSLCommerz Payment

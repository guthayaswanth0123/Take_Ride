import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedAdmin } from "./app/utils/seedAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;
let io: SocketIOServer;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("connected to DB ✅");

    server = app.listen(5000, () => {
      console.log(`Server is listening to port ${envVars.PORT} `);
    });

    // Initialize Socket.IO
    io = new SocketIOServer(server, {
      cors: {
        origin: envVars.FRONTEND_URL,
        methods: ["GET", "POST"]
      }
    });

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join ride room
      socket.on('join-ride', (rideId) => {
        socket.join(`ride-${rideId}`);
        console.log(`User ${socket.id} joined ride ${rideId}`);
      });

      // Leave ride room
      socket.on('leave-ride', (rideId) => {
        socket.leave(`ride-${rideId}`);
        console.log(`User ${socket.id} left ride ${rideId}`);
      });

      // Handle driver location updates
      socket.on('driver-location-update', (data) => {
        const { rideId, location } = data;
        socket.to(`ride-${rideId}`).emit('driver-location-changed', location);
      });

      // Handle ride status updates
      socket.on('ride-status-update', (data) => {
        const { rideId, status, driverInfo } = data;
        io.to(`ride-${rideId}`).emit('ride-status-changed', { status, driverInfo });
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    // Make io available globally
    global.io = io;
  } catch (error) {
    console.log(error);
  }
};

(async () => {
   await connectRedis()
  await startServer();
  await seedAdmin();
})();


process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected...... Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unCaughtException", (err) => {
  console.log("uncaught Exception detected...... Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received...... Server shutting down..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});


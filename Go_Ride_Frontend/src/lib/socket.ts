import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(serverUrl: string = 'http://localhost:5000') {
    if (!this.socket) {
      this.socket = io(serverUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRide(rideId: string) {
    if (this.socket) {
      this.socket.emit('join-ride', rideId);
    }
  }

  leaveRide(rideId: string) {
    if (this.socket) {
      this.socket.emit('leave-ride', rideId);
    }
  }

  updateDriverLocation(rideId: string, location: { lat: number; lng: number }) {
    if (this.socket) {
      this.socket.emit('driver-location-update', { rideId, location });
    }
  }

  updateRideStatus(rideId: string, status: string, driverInfo?: any) {
    if (this.socket) {
      this.socket.emit('ride-status-update', { rideId, status, driverInfo });
    }
  }

  onDriverLocationChanged(callback: (location: { lat: number; lng: number }) => void) {
    if (this.socket) {
      this.socket.on('driver-location-changed', callback);
    }
  }

  onRideStatusChanged(callback: (data: { status: string; driverInfo?: any }) => void) {
    if (this.socket) {
      this.socket.on('ride-status-changed', callback);
    }
  }

  onRideCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('ride-created', callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
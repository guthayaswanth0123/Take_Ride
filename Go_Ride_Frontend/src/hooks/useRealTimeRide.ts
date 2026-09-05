import { useEffect, useState } from 'react';
import { socketService } from '../lib/socket';

interface UseRealTimeRideProps {
  rideId?: string;
  initialDriverLocation?: { lat: number; lng: number };
  initialRideStatus?: string;
}

export const useRealTimeRide = ({ 
  rideId, 
  initialDriverLocation, 
  initialRideStatus 
}: UseRealTimeRideProps) => {
  const [driverLocation, setDriverLocation] = useState(initialDriverLocation);
  const [rideStatus, setRideStatus] = useState(initialRideStatus);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected for ride tracking');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (rideId && isConnected) {
      // Join ride room
      socketService.joinRide(rideId);

      // Listen for driver location updates
      socketService.onDriverLocationChanged((location) => {
        setDriverLocation(location);
      });

      // Listen for ride status changes
      socketService.onRideStatusChanged((data) => {
        setRideStatus(data.status);
      });

      return () => {
        socketService.leaveRide(rideId);
        socketService.off('driver-location-changed');
        socketService.off('ride-status-changed');
      };
    }
  }, [rideId, isConnected]);

  const updateDriverLocation = (location: { lat: number; lng: number }) => {
    if (rideId) {
      socketService.updateDriverLocation(rideId, location);
    }
  };

  const updateRideStatus = (status: string, driverInfo?: any) => {
    if (rideId) {
      socketService.updateRideStatus(rideId, status, driverInfo);
    }
  };

  return {
    driverLocation,
    rideStatus,
    isConnected,
    updateDriverLocation,
    updateRideStatus
  };
};
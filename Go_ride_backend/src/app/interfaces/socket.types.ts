export interface SocketEvents {
  // Client to Server events
  'join-ride': (rideId: string) => void;
  'leave-ride': (rideId: string) => void;
  'driver-location-update': (data: {
    rideId: string;
    location: { lat: number; lng: number };
  }) => void;
  'ride-status-update': (data: {
    rideId: string;
    status: string;
    driverInfo?: any;
  }) => void;

  // Server to Client events
  'driver-location-changed': (location: { lat: number; lng: number }) => void;
  'ride-status-changed': (data: { status: string; driverInfo?: any }) => void;
  'ride-created': (data: any) => void;
}
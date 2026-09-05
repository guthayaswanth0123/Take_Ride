/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import {  Clock, Phone, MessageCircle } from 'lucide-react';
import { socketService } from '../lib/socket';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RealTimeMapProps {
  pickupLocation?: {
    coordinates: [number, number];
    address: string;
  };
  destinationLocation?: {
    coordinates: [number, number];
    address: string;
  };
  driverLocation?: {
    lat: number;
    lng: number;
  };
  rideStatus?: string;
  rideId?: string;
}

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="3"/>
      <path d="M16 8l-3 8h6l-3-8z" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const destinationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="3"/>
      <path d="M16 8l-3 8h6l-3-8z" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const driverIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="#3B82F6" stroke="white" stroke-width="3"/>
      <path d="M12 18h16v8H12v-8zm2-4h12l-2-4H16l-2 4zm6 8a2 2 0 100-4 2 2 0 000 4z" fill="white"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="#8B5CF6" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

export default function RealTimeMap({ 
  pickupLocation, 
  destinationLocation, 
  driverLocation: initialDriverLocation, 
  rideStatus,
  rideId
}: RealTimeMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [driverLocation, setDriverLocation] = useState(initialDriverLocation);
  const [currentRideStatus, setCurrentRideStatus] = useState(rideStatus);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [showDriverInfo, setShowDriverInfo] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string>('15 mins');

  const defaultCenter: [number, number] = [23.8103, 90.4125];

  // Initialize Socket.IO connection
  useEffect(() => {
    socketService.connect();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Join ride room when rideId is available
  useEffect(() => {
    if (rideId) {
      socketService.joinRide(rideId);
      
      return () => {
        socketService.leaveRide(rideId);
      };
    }
  }, [rideId]);

  // Listen for real-time updates
  useEffect(() => {
    // Listen for driver location updates
    socketService.onDriverLocationChanged((location) => {
      setDriverLocation(location);
      console.log('Driver location updated:', location);
    });

    // Listen for ride status changes
    socketService.onRideStatusChanged((data) => {
      setCurrentRideStatus(data.status);
      console.log('Ride status updated:', data.status);
    });

    return () => {
      socketService.off('driver-location-changed');
      socketService.off('ride-status-changed');
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Create simple route line and calculate estimated time
  useEffect(() => {
    if (pickupLocation && destinationLocation && 
        pickupLocation.coordinates && destinationLocation.coordinates &&
        pickupLocation.coordinates[1] && pickupLocation.coordinates[0] &&
        destinationLocation.coordinates[1] && destinationLocation.coordinates[0]) {
      const pickup: [number, number] = [pickupLocation.coordinates[1], pickupLocation.coordinates[0]];
      const destination: [number, number] = [destinationLocation.coordinates[1], destinationLocation.coordinates[0]];
      setRouteCoordinates([pickup, destination]);
      
      // Calculate approximate distance and time
      const distance = Math.sqrt(
        Math.pow(destination[0] - pickup[0], 2) + Math.pow(destination[1] - pickup[1], 2)
      ) * 111; // Rough km conversion
      const estimatedMinutes = Math.max(5, Math.round(distance * 2)); // 2 min per km minimum 5 min
      setEstimatedTime(`${estimatedMinutes} mins`);
    }
  }, [pickupLocation, destinationLocation]);

  // Simulate driver movement for demo (remove in production)
  useEffect(() => {
    if (currentRideStatus === 'ACCEPTED' || currentRideStatus === 'PICKED_UP' || currentRideStatus === 'IN_TRANSIT') {
      const interval = setInterval(() => {
        if (rideId && driverLocation) {
          const newLocation = {
            lat: driverLocation.lat + (Math.random() - 0.5) * 0.001,
            lng: driverLocation.lng + (Math.random() - 0.5) * 0.001
          };
          socketService.updateDriverLocation(rideId, newLocation);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentRideStatus, rideId, driverLocation]);

  const getStatusColor = () => {
    switch (currentRideStatus) {
      case 'REQUESTED': return 'bg-yellow-500';
      case 'ACCEPTED': return 'bg-blue-500';
      case 'PICKED_UP': return 'bg-green-500';
      case 'IN_TRANSIT': return 'bg-purple-500';
      case 'COMPLETED': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (currentRideStatus) {
      case 'REQUESTED': return 'Finding driver...';
      case 'ACCEPTED': return 'Driver is coming';
      case 'PICKED_UP': return 'On the way';
      case 'IN_TRANSIT': return 'Heading to destination';
      case 'COMPLETED': return 'Trip completed';
      default: return 'Unknown status';
    }
  };



  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
            <span className="font-medium text-gray-900">{getStatusText()}</span>
          </div>
          {estimatedTime && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{estimatedTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border h-96">
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {/* Pickup Marker */}
          {pickupLocation && pickupLocation.coordinates && pickupLocation.coordinates[1] && pickupLocation.coordinates[0] && (
            <Marker 
              position={[pickupLocation.coordinates[1], pickupLocation.coordinates[0]]}
              icon={pickupIcon}
            >
              <Popup>Pickup Location</Popup>
            </Marker>
          )}

          {/* Destination Marker */}
          {destinationLocation && destinationLocation.coordinates && destinationLocation.coordinates[1] && destinationLocation.coordinates[0] && (
            <Marker 
              position={[destinationLocation.coordinates[1], destinationLocation.coordinates[0]]}
              icon={destinationIcon}
            >
              <Popup>Destination</Popup>
            </Marker>
          )}

          {/* Driver Marker */}
          {driverLocation && driverLocation.lat && driverLocation.lng && (currentRideStatus === 'ACCEPTED' || currentRideStatus === 'PICKED_UP' || currentRideStatus === 'IN_TRANSIT') && (
            <Marker 
              position={[driverLocation.lat, driverLocation.lng]}
              icon={driverIcon}
              eventHandlers={{
                click: () => setShowDriverInfo(!showDriverInfo)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">Your Driver</h3>
                  <p className="text-sm text-gray-600">Ahmed Khan</p>
                  <p className="text-xs text-gray-500">Toyota Prius • DHK-1234</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      <Phone className="h-3 w-3" />
                      <span>Call</span>
                    </button>
                    <button className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      <MessageCircle className="h-3 w-3" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* User Location Marker */}
          {userLocation && userLocation.lat && userLocation.lng && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>Your Location</Popup>
            </Marker>
          )}

          {/* Route Line */}
          {routeCoordinates.length > 0 && (
            <Polyline 
              positions={routeCoordinates}
              color="#3B82F6"
              weight={4}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>

      {/* Trip Info */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Pickup</p>
            <p className="text-xs text-gray-600 truncate">
              {pickupLocation?.address || 'Setting pickup location...'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Destination</p>
            <p className="text-xs text-gray-600 truncate">
              {destinationLocation?.address || 'Setting destination...'}
            </p>
          </div>
        </div>
      </div>

     
    </div>
  );
}
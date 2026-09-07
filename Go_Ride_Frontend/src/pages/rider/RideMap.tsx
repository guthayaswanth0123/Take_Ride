/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: number;
  name: string;
  address: string;
  coords: { lat: number; lng: number };
}

interface RideMapProps {
  pickup?: Location | null;
  drop?: Location | null;
}

const customMarkerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function RideMap({ pickup, drop }: RideMapProps) {
  const center = pickup?.coords || { lat: 28.6139, lng: 77.2090 }; // India default

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pickup && (
        <Marker position={pickup.coords} icon={customMarkerIcon}>
          <Popup>Pickup: {pickup.name}</Popup>
        </Marker>
      )}
      {drop && (
        <Marker position={drop.coords} icon={customMarkerIcon}>
          <Popup>Drop: {drop.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

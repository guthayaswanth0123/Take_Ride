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


// Fix default marker icon issue in Leaflet
(L.Icon.Default.prototype as any)._getIconUrl = undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function RideMap({ pickup, drop }: RideMapProps) {
  const center = pickup?.coords || { lat: 23.8103, lng: 90.4125 }; // Dhaka default

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pickup && (
        <Marker position={pickup.coords}>
          <Popup>Pickup: {pickup.name}</Popup>
        </Marker>
      )}
      {drop && (
        <Marker position={drop.coords}>
          <Popup>Drop: {drop.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, X, Loader2, Search, Navigation } from "lucide-react";
import ServiceUnavailableModal from "./ServiceUnavailableModal";

interface Location {
  id: number;
  name: string;
  address: string;
  coords: { lat: number; lng: number };
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSelectLocation: (location: Location) => void;
  initialCoords?: { lat: number; lng: number };
}

// Controller to handle center updates and map events
function MapCenterController({ onCenterChange }: { onCenterChange: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    moveend() {
      const center = map.getCenter();
      onCenterChange(center.lat, center.lng);
    },
  });
  return null;
}

// Controller to programmatically fly map when user selects search result
function MapFlyTo({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 15, { animate: true, duration: 1.0 });
    }
  }, [coords, map]);
  return null;
}

const quickHubs = [
  { name: "Delhi NCR", coords: { lat: 28.6139, lng: 77.2090 } },
  { name: "Mumbai", coords: { lat: 19.0760, lng: 72.8777 } },
  { name: "Bengaluru", coords: { lat: 12.9716, lng: 77.5946 } },
  { name: "Hyderabad", coords: { lat: 17.3850, lng: 78.4867 } },
  { name: "Kolkata", coords: { lat: 22.5726, lng: 88.3639 } },
  { name: "Chennai", coords: { lat: 13.0827, lng: 80.2707 } },
  { name: "Pune", coords: { lat: 18.5204, lng: 73.8567 } },
];

export const isLocationInServiceArea = (coords: { lat: number; lng: number }) => {
  if (!coords || !coords.lat || !coords.lng) return false;
  // South Asia & India Service Bounds
  return coords.lat >= 6.0 && coords.lat <= 38.0 && coords.lng >= 68.0 && coords.lng <= 98.0;
};

export default function LocationPickerModal({
  isOpen,
  onClose,
  title,
  onSelectLocation,
  initialCoords = { lat: 28.6139, lng: 77.2090 }, // Default New Delhi / India
}: LocationPickerModalProps) {
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number }>(initialCoords);
  const [flyCoords, setFlyCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addressName, setAddressName] = useState<string>("Fetching location...");
  const [addressDetail, setAddressDetail] = useState<string>("");
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentCenter(initialCoords);
      reverseGeocode(initialCoords.lat, initialCoords.lng);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsResolvingAddress(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data) {
        const name = data.name || data.address?.road || data.address?.suburb || data.address?.neighbourhood || "Selected Location";
        const fullAddress = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setAddressName(name);
        setAddressDetail(fullAddress);
      }
    } catch (e) {
      setAddressName("Selected Coordinates");
      setAddressDetail(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const handleCenterChange = (lat: number, lng: number) => {
    setCurrentCenter({ lat, lng });
    reverseGeocode(lat, lng);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSearchResults(data);
      }
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setFlyCoords({ lat, lng });
    setCurrentCenter({ lat, lng });
    setSearchQuery("");
    setSearchResults([]);
    reverseGeocode(lat, lng);
  };

  const handleConfirm = () => {
    if (!isLocationInServiceArea(currentCenter)) {
      setShowUnavailableModal(true);
      return;
    }
    onSelectLocation({
      id: Date.now(),
      name: addressName,
      address: addressDetail || `${currentCenter.lat.toFixed(4)}, ${currentCenter.lng.toFixed(4)}`,
      coords: currentCenter,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[90vh] md:h-[620px] text-slate-900 dark:text-white">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Drag map to position marker or search address</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Input Section (High Contrast) */}
          <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-3 z-10">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Type area, city or pincode (e.g., Connaught Place, 110001)"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm rounded-xl focus-visible:ring-blue-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {searchQuery && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                {isSearching ? (
                  <div className="p-3 text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSearchResult(item)}
                      className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{item.display_name.split(",")[0]}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-300 truncate">{item.display_name}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-slate-500 text-center">No locations found for "{searchQuery}"</div>
                )}
              </div>
            )}

            {/* Quick Hub Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
              {quickHubs.map((hub, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFlyCoords(hub.coords);
                    setCurrentCenter(hub.coords);
                    reverseGeocode(hub.coords.lat, hub.coords.lng);
                  }}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  📍 {hub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Map View Area */}
          <div className="relative flex-1 w-full bg-slate-100 dark:bg-slate-950 min-h-[260px]">
            {/* Standard OpenStreetMap Tiles without API key watermark */}
            <MapContainer
              center={currentCenter}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapCenterController onCenterChange={handleCenterChange} />
              <MapFlyTo coords={flyCoords} />
            </MapContainer>

            {/* Uber/Rapido Floating Center Pin */}
            <div className="absolute inset-0 pointer-events-none z-[400] flex items-center justify-center -translate-y-5">
              <div className="flex flex-col items-center">
                <div className="bg-slate-900/90 text-white border border-blue-400/50 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 mb-1 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {title.replace("Choose ", "").replace(" on Map", "")}
                </div>
                <MapPin className="h-10 w-10 text-blue-600 dark:text-blue-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]" />
                <div className="w-3 h-1.5 bg-black/40 rounded-full blur-[1px]" />
              </div>
            </div>
          </div>

          {/* Bottom Sheet Info & Confirm Button */}
          <div className="p-4 md:p-5 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-[70%]">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Selected Location</p>
                {isResolvingAddress ? (
                  <div className="flex items-center gap-2 text-slate-500 text-sm py-1">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> Resolving location...
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-base text-slate-900 dark:text-white truncate">{addressName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{addressDetail}</p>
                  </>
                )}
              </div>
              <Button
                className="h-12 px-6 font-bold text-base rounded-2xl shrink-0 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleConfirm}
                disabled={isResolvingAddress}
              >
                Confirm Location
              </Button>
            </div>
          </div>

        </div>
      </div>

      <ServiceUnavailableModal
        isOpen={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
        locationName={addressName}
      />
    </>
  );
}

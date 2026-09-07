/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounce } from "@/components/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchLocationMutation } from "@/redux/features/api/locationService.api";
import { X, LocateFixed, Map, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LocationPickerModal, { isLocationInServiceArea } from "@/components/modules/homepage/LocationPickerModal";
import ServiceUnavailableModal from "@/components/modules/homepage/ServiceUnavailableModal";

interface Location {
  id: number;
  name: string;
  address: string;
  coords: { lat: number; lng: number };
}

interface LocationInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: Location) => void;
  locations?: Location[];
  icon: React.ReactNode;
  inputRef?: React.RefObject<HTMLDivElement | null>;
  hideGps?: boolean;
}

export default function LocationInput({
  id,
  label,
  value,
  onChange,
  onLocationSelect,
  locations = [],
  icon,
  hideGps = false,
}: LocationInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Location[]>(locations);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [unavailableLocationName, setUnavailableLocationName] = useState("");
  const debouncedValue = useDebounce(value, 300);
  const [searchLocation] = useSearchLocationMutation();
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldShowGps = !hideGps && id !== "destination" && !id.toLowerCase().includes("destination") && !id.toLowerCase().includes("drop");

  useEffect(() => {
    let isMounted = true;
    let timeoutId: any;

    const fetchLocations = async () => {
      if (!debouncedValue) {
        if (isMounted) setFilteredSuggestions([]);
        return;
      }

      try {
        const searchResult: any = await searchLocation({ query_text: debouncedValue }).unwrap();

        if (isMounted && searchResult?.statusCode === 200 && Array.isArray(searchResult.data) && searchResult.data.length > 0) {
          const mappedLocations: Location[] = searchResult.data.map((loc: any, idx: number) => ({
            id: loc.place_id || idx,
            name: loc.address_line1 || loc.display_name?.split(",")[0] || "Location",
            address: loc.address_line2 || loc.display_name || "",
            coords: { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) },
          }));
          setFilteredSuggestions(mappedLocations);
        } else {
          // Force English language search
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(debouncedValue)}&limit=5`);
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            const mapped: Location[] = data.map((loc: any, idx: number) => ({
              id: loc.place_id || idx,
              name: loc.display_name.split(",")[0],
              address: loc.display_name,
              coords: { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) },
            }));
            setFilteredSuggestions(mapped);
          } else if (isMounted) {
            setFilteredSuggestions([]);
          }
        }
      } catch (error) {
        if (isMounted) setFilteredSuggestions([]);
      }
    };

    timeoutId = setTimeout(fetchLocations, 300);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [debouncedValue, searchLocation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (location: Location) => {
    if (!isLocationInServiceArea(location.coords)) {
      setUnavailableLocationName(location.name);
      setShowUnavailableModal(true);
      return;
    }
    onLocationSelect(location);
    setShowSuggestions(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        if (!isLocationInServiceArea(coords)) {
          setUnavailableLocationName("Current Location");
          setShowUnavailableModal(true);
          setIsGettingGps(false);
          return;
        }
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const name = data.name || data.address?.road || data.address?.suburb || "Current Location";
          const fullAddress = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          const loc: Location = {
            id: Date.now(),
            name: `📍 ${name}`,
            address: fullAddress,
            coords,
          };
          onLocationSelect(loc);
          onChange(loc.name);
        } catch (e) {
          const loc: Location = {
            id: Date.now(),
            name: "Current Location",
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            coords,
          };
          onLocationSelect(loc);
          onChange(loc.name);
        } finally {
          setIsGettingGps(false);
        }
      },
      (error) => {
        setIsGettingGps(false);
        alert("Unable to fetch current location. Please select on map or type address.");
      }
    );
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="flex items-center gap-2 font-medium">
          {icon}
          {label}
        </Label>
        <div className="flex items-center gap-2 text-xs">
          {shouldShowGps && (
            <>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isGettingGps}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                title="Use current GPS location"
              >
                {isGettingGps ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
                <span>GPS</span>
              </button>
              <span className="text-gray-500">|</span>
            </>
          )}
          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
            title="Choose location on map"
          >
            <Map className="h-3.5 w-3.5" />
            <span>Map</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Input
          id={id}
          placeholder={id === "pickup" ? "Pickup Address or Pincode (e.g. 110001)" : "Drop Address or Pincode (e.g. Connaught Place)"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="pr-8"
        />
        {value && (
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Suggestion Dropdown */}
        {showSuggestions && (
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((location) => (
                <div
                  key={location.id}
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer border-b border-gray-100 dark:border-slate-800 last:border-b-0 transition-colors"
                  onClick={() => handleSelect(location)}
                >
                  <div className="font-medium text-slate-900 dark:text-white text-sm">{location.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{location.address}</div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-gray-400">
                {value ? "No locations found. Try typing address or pincode." : "Type address or pincode to search"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Uber/Rapido Interactive Map Picker Modal */}
      <LocationPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        title={`Choose ${label} on Map`}
        onSelectLocation={(loc) => {
          onLocationSelect(loc);
          onChange(loc.name);
        }}
      />

      {/* Service Unavailable Warning Popup */}
      <ServiceUnavailableModal
        isOpen={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
        locationName={unavailableLocationName}
      />
    </div>
  );
}

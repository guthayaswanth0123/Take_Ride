/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounce } from "@/components/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchLocationMutation } from "@/redux/features/api/locationService.api";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  inputRef: React.RefObject<HTMLDivElement | null>;
}

export default function LocationInput({
  id,
  label,
  value,
  onChange,
  onLocationSelect,
  locations = [],
  icon,
}: LocationInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<Location[]>(locations);
  const debouncedValue = useDebounce(value, 300);
  const [searchLocation] = useSearchLocationMutation();
  const containerRef = useRef<HTMLDivElement>(null);
let timeoutId: NodeJS.Timeout;


useEffect(() => {
  let isMounted = true;
  

  const fetchLocations = async () => {
    if (!debouncedValue) {
      if (isMounted) setFilteredSuggestions([]);
      return;
    }

    if (timeoutId) clearTimeout(timeoutId);

    try {
      const searchResult: any = await searchLocation({
        query_text: debouncedValue,
      }).unwrap();

      if (
        isMounted &&
        searchResult?.statusCode === 200 &&
        Array.isArray(searchResult.data)
      ) {
        const mappedLocations: Location[] = searchResult.data.map((loc: any) => ({
          id: loc.place_id,
          name: loc.address_line1,
          address: loc.address_line2,
          coords: { lat: loc.lat, lng: loc.lon },
        }));
        setFilteredSuggestions(mappedLocations);
      } else if (isMounted) {
        setFilteredSuggestions([]);
      }
    } catch (error) {
      console.log("Location search error:", error);
      if (isMounted) setFilteredSuggestions([]);
    }
  };

   timeoutId = setTimeout(fetchLocations, 300);

  return () => {
    isMounted = false;
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [debouncedValue, searchLocation]);


  // Close dropdown when clicking outside and cleanup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    };
  }, []);

  const handleSelect = (location: Location) => {
    onLocationSelect(location);
    // Animate closing
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          placeholder={`Enter ${label.toLowerCase()}`}
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
        <div
          className={`absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto transition-all duration-300 ease-in-out
                        ${
                          showSuggestions
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
        >
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((location) => (
              <div
                key={location.id}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(location)}
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-gray-600">{location.address}</div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500">No locations found</div>
          )}
        </div>
      </div>
    </div>
  );
}

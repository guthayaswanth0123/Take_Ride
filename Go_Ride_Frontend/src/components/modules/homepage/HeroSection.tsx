import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Shield, Car, MapPin, Navigation } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import LocationInput from "@/pages/rider/LocationInput";

interface LocationData {
  id: number;
  name: string;
  address: string;
  coords: { lat: number; lng: number };
}

const getDistance = (c1: { lat: number; lng: number }, c2: { lat: number; lng: number }) => {
  const R = 6371;
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLon = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((c1.lat * Math.PI) / 180) *
    Math.cos((c2.lat * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const HeroSection: React.FC = () => {
  const [pickupInput, setPickupInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<LocationData | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const pickupRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  const { data: userInfo } = useUserInfoQuery(undefined);
  const navigate = useNavigate();
  const isLoggedIn = !!userInfo?.data?.email;

  const distance = pickupLocation && destinationLocation
    ? getDistance(pickupLocation.coords, destinationLocation.coords)
    : 0;
  const estTime = Math.round(distance * 1.4);
  const price = Math.round(50 + distance * 15);

  const handlePickupSelect = (loc: LocationData) => {
    setPickupLocation(loc);
    setPickupInput(loc.name);
  };

  const handleDestinationSelect = (loc: LocationData) => {
    setDestinationLocation(loc);
    setDestinationInput(loc.name);
  };

  const handleFindRide = () => {
    if (!pickupLocation || !destinationLocation) return;
    setShowSummary(true);
  };

  const handleBook = () => {
    navigate(isLoggedIn ? "/rider/book-ride" : "/login?redirect=/rider/book-ride");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden font-primary"
      style={{
        backgroundImage: "url('/images/img1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 dark:bg-black/70" />

      <div className="container mx-auto px-4 pt-16 relative z-10 mb-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Left Content */}
          <div className="w-1/2">
            <h1 className="text-4xl lg:text-6xl font-primary text-white mb-4 leading-tight font-bold mt-8">
              Arrive in Comfort,<br />Depart with Confidence
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-lg leading-relaxed">
              GoRide connects you with verified professional drivers across Dhaka.
              Safe, affordable, and always on time — wherever you need to go.
            </p>
            <div className="flex flex-wrap gap-6 mt-10 mb-10">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-200 font-medium">Verified Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-200 font-medium">Premium Fleet</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-200 font-medium">Top Rated</span>
              </div>
            </div>
            <Link to="/login">
              <Button className="px-8 py-6 text-lg font-semibold">Book A Ride</Button>
            </Link>
          </div>

          {/* Right Content — Booking Form */}
          <div className="w-1/2 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">Book a Ride</h2>
              <div className="space-y-4 [&_label]:text-white [&_input]:text-white [&_input]:placeholder:text-gray-300 [&_input]:bg-white/10 [&_input]:border-white/30">
                <LocationInput
                  id="pickup"
                  label="Pickup Location"
                  value={pickupInput}
                  onChange={setPickupInput}
                  onLocationSelect={handlePickupSelect}
                  icon={<Navigation className="h-4 w-4 text-blue-500" />}
                  inputRef={pickupRef}
                />
                <LocationInput
                  id="destination"
                  label="Destination"
                  value={destinationInput}
                  onChange={setDestinationInput}
                  onLocationSelect={handleDestinationSelect}
                  icon={<MapPin className="h-4 w-4 text-red-500" />}
                  inputRef={destinationRef}
                />
                <Button
                  className="w-full h-12 text-base font-semibold"
                  onClick={handleFindRide}
                  disabled={!pickupLocation || !destinationLocation}
                >
                  Find a Ride
                </Button>
              </div>

              {/* Inline Trip Summary */}
              {showSummary && pickupLocation && destinationLocation && (
                <div className="mt-5 border-t dark:border-slate-700 pt-5 space-y-3 text-sm">
                  <p className="font-semibold text-white text-base">Trip Summary</p>

                  <div className="flex gap-2">
                    <Navigation className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs">Pickup</p>
                      <p className="font-medium text-white">{pickupLocation.name}</p>
                      <p className="text-xs text-gray-300">{pickupLocation.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs">Destination</p>
                      <p className="font-medium text-white">{destinationLocation.name}</p>
                      <p className="text-xs text-gray-300">{destinationLocation.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center bg-white/10 rounded-xl p-3">
                    <div>
                      <p className="text-gray-400 text-xs">Distance</p>
                      <p className="font-semibold text-white">{distance.toFixed(2)} km</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Est. Time</p>
                      <p className="font-semibold text-white">{estTime} min</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Price</p>
                      <p className="font-semibold text-primary text-base">৳{price}</p>
                    </div>
                  </div>

                  <Button className="w-full h-11 font-semibold" onClick={handleBook}>
                    {isLoggedIn ? "Book Now" : "Login to Book"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

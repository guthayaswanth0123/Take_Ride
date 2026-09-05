/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, User, Car, Clock, Navigation } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetRideDetailsQuery, useCancelRideMutation, useGetMyRidesQuery } from "@/redux/features/rides/rides.api";
import RealTimeMap from "@/components/RealTimeMap";
import SOSButton from "@/components/SOSButton";
import toast from "react-hot-toast";
import { RideCardSkeleton, DashboardCardSkeleton } from "@/components/ui/skeletons";

export default function LiveTracking() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { data: myRidesData, isLoading: ridesLoading } = useGetMyRidesQuery({});
  const { data: rideData, refetch, isLoading: rideLoading } = useGetRideDetailsQuery(rideId!, { skip: !rideId });
  const [cancelRide] = useCancelRideMutation();
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

  const ride = rideData?.data;

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
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

  // Auto refresh ride data every 10 seconds
  useEffect(() => {
    if (rideId && ride) {
      const interval = setInterval(() => {
        refetch();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [rideId, ride, refetch]);

  const handleCancelRide = async () => {
    if (!ride) return;
    
    try {
      await cancelRide(ride._id).unwrap();
      toast.success("Ride cancelled successfully");
      navigate("/rider/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel ride");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP': return 'bg-orange-100 text-orange-800';
      case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'Looking for a driver...';
      case 'ACCEPTED': return 'Driver is on the way to pick you up';
      case 'PICKED_UP': return 'You have been picked up';
      case 'IN_TRANSIT': return 'On the way to destination';
      case 'COMPLETED': return 'Ride completed successfully';
      case 'CANCELLED': return 'Ride has been cancelled';
      default: return 'Unknown status';
    }
  };



  // If no rideId, show active rides list
  if (!rideId) {
    const activeRides = myRidesData?.data?.filter((ride: any) => 
      ['REQUESTED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(ride.status)
    ) || [];

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Live Ride Tracking</h1>
        
        {ridesLoading ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">Loading active rides...</p>
            {Array.from({ length: 3 }).map((_, i) => (
              <RideCardSkeleton key={i} />
            ))}
          </div>
        ) : activeRides.length > 0 ? (
          <div className="space-y-4">
            <p className="text-accent">Select a ride to track:</p>
            {activeRides.map((ride: any) => {
              const pickupAddress = typeof ride.pickupLocation === 'object' 
                ? ride.pickupLocation?.address 
                : ride.pickupLocation;
              const destinationAddress = typeof ride.destinationLocation === 'object' 
                ? ride.destinationLocation?.address 
                : ride.destinationLocation;
              
              return (
                <Card key={ride._id} className="cursor-pointer hover:shadow-md transition-shadow" 
                 onClick={() => navigate(`/rider/live-tracking/${ride._id}`)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{pickupAddress} → {destinationAddress}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(ride.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(ride.status)}>
                          {ride.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">৳{ride.fare}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No active rides to track</p>
              <Button onClick={() => navigate('/rider/book-ride')} className="cursor-pointer">Book a Ride</Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (rideLoading || !ride) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      </div>
    );
  }

  const pickupAddress = typeof ride.pickupLocation === 'object' 
    ? ride.pickupLocation?.address 
    : ride.pickupLocation;
  const destinationAddress = typeof ride.destinationLocation === 'object' 
    ? ride.destinationLocation?.address 
    : ride.destinationLocation;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Live Ride Tracking</h1>
        <Badge className={getStatusColor(ride.status)}>
          {ride.status}
        </Badge>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Ride Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-lg font-medium mb-2">{getStatusMessage(ride.status)}</div>
            <div className="text-sm text-muted-foreground">
              Requested: {new Date(ride.createdAt).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Live Route Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RealTimeMap 
            pickupLocation={ride.pickupLocation}
            destinationLocation={ride.destinationLocation}
            driverLocation={currentLocation || undefined}
            rideStatus={ride.status}
            rideId={ride._id}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trip Details */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">{pickupAddress}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-red-600 mt-1" />
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-sm text-muted-foreground">{destinationAddress}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Fare</p>
                <p className="text-lg font-bold text-green-600">৳{ride.fare}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Details */}
        {ride.driver && (
          <Card>
            <CardHeader>
              <CardTitle>Driver Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{ride.driver.name || 'Driver'}</p>
                  <p className="text-sm text-muted-foreground">Your driver</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Vehicle Info</p>
                  <p className="text-sm text-muted-foreground">
                    {ride.driver.vehicleType || 'Car'} • {ride.driver.vehicleNumber || 'N/A'}
                  </p>
                </div>
              </div>
              
              {ride.driver.phone && (
                <Button className="w-full cursor-pointer" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Driver
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      {ride.status === 'REQUESTED' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button 
                variant="destructive" 
                className="flex-1 cursor-pointer"
                onClick={handleCancelRide}
              >
                Cancel Ride
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 cursor-pointer"
                onClick={() => navigate('/rider/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(ride.status === 'COMPLETED' || ride.status === 'CANCELLED') && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              className="w-full cursor-pointer"
              onClick={() => navigate('/rider/dashboard')}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* SOS Button - Only show during active ride */}
      <SOSButton isVisible={['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(ride.status)} />
    </div>
  );
}
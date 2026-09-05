/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, DollarSign, Clock, ToggleLeft, ToggleRight, Star, TrendingUp, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserInfoQuery, useUpdateDriverStatusMutation } from "@/redux/features/auth/auth.api";
import { useGetDriverStatsQuery, useGetAvailableRidesQuery, useAcceptRideMutation, useRejectRideMutation, useGetActiveRidesQuery, useUpdateRideStatusMutation, useGetDriverEarningsQuery } from "@/redux/features/driver/driver.api";
import toast from "react-hot-toast";
import SOSButton from "@/components/SOSButton";
import { socketService } from "@/lib/socket";

export default function DriverDashboard() {
  const [updateDriverStatus] = useUpdateDriverStatusMutation();
  const [acceptRide] = useAcceptRideMutation();
  const [rejectRide] = useRejectRideMutation();
  const { data: activeRidesData, refetch: refetchActiveRides } = useGetActiveRidesQuery({});
  const [updateRideStatus] = useUpdateRideStatusMutation();
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);
  const locationErrorShownRef = useRef(false);

  
const { data: userInfo } = useUserInfoQuery();
const userId = userInfo?.data?._id;



const { data: statsData } = useGetDriverStatsQuery(userId, { skip: !userId });
const { data: earningsData } = useGetDriverEarningsQuery(userId, { skip: !userId });
  
  const user = userInfo?.data;
  const stats = statsData?.data || {};
  const earnings = earningsData?.data || {};
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);
  
  const { data: availableRidesData, refetch: refetchRides } = useGetAvailableRidesQuery({}, { skip: !isOnline });

  // Initialize Socket.IO connection + listen for new ride requests
  useEffect(() => {
    socketService.connect();

    socketService.onRideCreated(() => {
      if (isOnline) {
        refetchRides();
      }
    });

    return () => {
      socketService.off('ride-created');
      socketService.disconnect();
    };
  }, [isOnline]);

  // Track driver location when online
  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      locationErrorShownRef.current = false;
      
      // Get initial location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          if (!locationErrorShownRef.current) {
            toast.error("Unable to get your location. Please enable location services.");
            locationErrorShownRef.current = true;
          }
        }
      );

      // Watch location changes
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          
          // Update location for all active rides
          if (activeRidesData?.data?.length > 0) {
            activeRidesData.data.forEach((ride: any) => {
              socketService.updateDriverLocation(ride._id, location);
            });
          }
        },
        (error) => {
          console.error("Error watching location:", error);
          if (!locationErrorShownRef.current) {
            toast.error("Unable to get your location. Please enable location services.");
            locationErrorShownRef.current = true;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );
      
      setLocationWatchId(watchId);
    } else if (!isOnline && locationWatchId) {
      // Stop watching location when offline
      navigator.geolocation.clearWatch(locationWatchId);
      setLocationWatchId(null);
      setCurrentLocation(null);
      locationErrorShownRef.current = false;
    }

    return () => {
      if (locationWatchId) {
        navigator.geolocation.clearWatch(locationWatchId);
      }
    };
  }, [isOnline]);

  useEffect(() => {
    if (user?.isOnline !== undefined) {
      setIsOnline(user.isOnline);
    }
  }, [user?.isOnline]);

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      await updateDriverStatus({ isOnline: newStatus }).unwrap();
      setIsOnline(newStatus);
      
      if (newStatus) {
        refetchRides(); 
        toast.success("You are now online and ready to receive rides!");
      } else {
        toast.success("You are now offline");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId).unwrap();
      toast.success("Ride accepted successfully!");
      
      socketService.joinRide(rideId);
      
      // Emit ride status update
      socketService.updateRideStatus(rideId, 'ACCEPTED', {
        driverLocation: currentLocation,
        driverInfo: {
          name: user?.name,
          phone: user?.phone,
          vehicleType: user?.vehicleInfo?.type,
          vehicleNumber: user?.vehicleInfo?.licensePlate
        }
      });
      
      refetchRides();
      refetchActiveRides();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to accept ride");
    }
  };

  const handleRejectRide = async (rideId: string) => {
    try {
      await rejectRide(rideId).unwrap();
      toast.success("Ride rejected");
      refetchRides();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject ride");
    }
  };

  const handleUpdateRideStatus = async (rideId: string) => {
    try {
      await updateRideStatus(rideId).unwrap();
      toast.success("Ride status updated successfully!");
      
      // Emit status update via socket
      const ride = activeRidesData?.data?.find((r: any) => r._id === rideId);
      if (ride) {
        let newStatus = '';
        switch (ride.status) {
          case 'ACCEPTED': newStatus = 'PICKED_UP'; break;
          case 'PICKED_UP': newStatus = 'IN_TRANSIT'; break;
          case 'IN_TRANSIT': newStatus = 'COMPLETED'; break;
        }
        
        if (newStatus) {
          socketService.updateRideStatus(rideId, newStatus, {
            driverLocation: currentLocation
          });
        }
      }
      
      refetchActiveRides();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update ride status");
    }
  };

  const getNextStatusText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'ACCEPTED': return 'Mark as Picked Up';
      case 'PICKED_UP': return 'Start Trip';
      case 'IN_TRANSIT': return 'Complete Trip';
      default: return 'Update Status';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-primary">Driver Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge className="dark:text-foreground" variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          {currentLocation && isOnline && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</span>
            </div>
          )}
          <Button
            onClick={toggleOnlineStatus}
            variant={isOnline ? "destructive" : "default"}
            className="flex items-center gap-2 cursor-pointer"
          >
            {isOnline ? (
              <>
                <ToggleRight className="h-4 w-4" />
                Go Offline
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4" />
                Go Online
              </>
            )}
          </Button>
        </div>
      </div>

      {!isOnline && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="">
            <p className="text-red-800 text-sm">
              You're currently offline. Go online to start receiving ride requests from passengers.
            </p>
            
          </CardContent>
        </Card>
      )}

      {isOnline && !currentLocation && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="">
            <p className="text-red-800 text-sm">
               Getting your location... Please ensure location services are enabled for real-time tracking.
            </p>
          
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{earnings.todayEarnings?.toFixed(2) || stats.todayEarnings?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {earnings.todayRides || stats.todayRides || 0} rides completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{earnings.weeklyEarnings?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {earnings.weeklyRides || 0} rides
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{earnings.monthlyEarnings?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {earnings.monthlyRides || 0} rides
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{stats.averageRating?.toFixed(1) || '0.0'}</div> */}
            <p className="text-xs text-muted-foreground">
              Based on {stats.totalRides || 0} rides
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Rides Section g */}
      <Card>
        <CardHeader>
          <CardTitle>Active Rides: {activeRidesData?.data?.length || 0}</CardTitle>
        </CardHeader>
        <CardContent>
          {activeRidesData?.data?.length > 0 ? (
            <div className="space-y-4">
              {activeRidesData.data.map((ride: any) => {
                const pickupAddress = typeof ride.pickupLocation === 'object' 
                  ? ride.pickupLocation?.address 
                  : ride.pickupLocation;
                const destinationAddress = typeof ride.destinationLocation === 'object' 
                  ? ride.destinationLocation?.address 
                  : ride.destinationLocation;
                
                return (
                  <div key={ride._id} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-950">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{pickupAddress} → {destinationAddress}</p>
                        <p className="text-sm text-muted-foreground">
                          Rider: {ride.rider?.name || ride.rider?.email || 'Loading...'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: {ride.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">৳{ride.fare}</p>
                        <Badge className={`${
                          ride.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                          ride.status === 'PICKED_UP' ? 'bg-orange-100 text-orange-800' :
                          ride.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ride.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {ride.status !== 'COMPLETED' && ride.status !== 'CANCELLED' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleUpdateRideStatus(ride._id)}
                        >
                          {getNextStatusText(ride.status)}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No active rides found. Accept a ride to see it here.
            </p>
          )}
        </CardContent>
      </Card>
      


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isOnline ? (
          <Card>
            <CardHeader>
              <CardTitle>Incoming Ride Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableRidesData?.data?.length > 0 ? (
                  availableRidesData.data.map((ride: any) => {
                    const pickupAddress = typeof ride.pickupLocation === 'object' 
                      ? ride.pickupLocation?.address 
                      : ride.pickupLocation;
                    const destinationAddress = typeof ride.destinationLocation === 'object' 
                      ? ride.destinationLocation?.address 
                      : ride.destinationLocation;
                    
                    return (
                      <div key={ride._id} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-950">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">{pickupAddress} → {destinationAddress}</p>
                            <p className="text-sm text-muted-foreground">
                              Requested: {new Date(ride.createdAt).toLocaleTimeString()}
                            </p>
                            
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">৳{ride.fare}</p>
                            <p className="text-xs text-muted-foreground">Fare</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleAcceptRide(ride._id)}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleRejectRide(ride._id)}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No ride requests available. Waiting for new requests...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentRides?.length > 0 ? (
                  stats.recentRides.slice(0, 3).map((ride: any) => {
                    const pickupAddress = typeof ride.pickupLocation === 'object' 
                      ? ride.pickupLocation?.address 
                      : ride.pickupLocation;
                    const destinationAddress = typeof ride.destinationLocation === 'object' 
                      ? ride.destinationLocation?.address 
                      : ride.destinationLocation;
                    
                    return (
                      <div key={ride._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{pickupAddress || 'Unknown'} to {destinationAddress || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{new Date(ride.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">৳{ride.fare}</p>
                          <p className={`text-sm ${
                            ride.status === 'COMPLETED' ? 'text-green-600' : 
                            ride.status === 'CANCELLED' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {ride.status}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent rides. Start accepting rides to build your history!
                  </p>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4 cursor-pointer" asChild>
                <Link to="/driver/ride-history">View All Rides</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start cursor-pointer" 
              onClick={toggleOnlineStatus}
              variant={isOnline ? "destructive" : "default"}
            >
              {isOnline ? (
                <>
                  <ToggleRight className="h-4 w-4 mr-2" />
                  Go Offline
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Go Online
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full justify-start cursor-pointer" asChild>
              <Link to="/driver/earnings">
                <DollarSign className="h-4 w-4 mr-2" />
                View Earnings
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start cursor-pointer" asChild>
              <Link to="/driver/ride-history">
                <Clock className="h-4 w-4 mr-2" />
                Ride History
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start cursor-pointer" asChild>
              <Link to="/driver/profile">
                <Car className="h-4 w-4 mr-2" />
                Vehicle & Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SOS Button - Only show when driver has active rides */}
      <SOSButton isVisible={activeRidesData?.data?.length > 0} />
    </div>
  );
}
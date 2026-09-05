/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Clock, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetMyRidesQuery, useCancelRideMutation } from "@/redux/features/rides/rides.api";
import toast from "react-hot-toast";
import { DashboardCardSkeleton } from "@/components/ui/skeletons";

export default function RiderDashboard() {
  const { data: ridesData, isLoading } = useGetMyRidesQuery({});
  const [cancelRide] = useCancelRideMutation();
  const rides = ridesData?.data || [];
  
  const totalRides = rides.length;
  const activeRidesData = rides.filter((ride: any) => ride.status === 'REQUESTED' || ride.status === 'ACCEPTED');
 
  const completedRides = rides.filter((ride: any) => ride.status === 'COMPLETED');
  const averageRating = completedRides.length > 0 
    ? (completedRides.reduce((sum: number, ride: any) => sum + (ride.rating || 0), 0) / completedRides.length).toFixed(1)
    : 0;
  
  const recentRides = rides.slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 dark:bg-black">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rider Dashboard</h1>
        <Button asChild className="cursor-pointer">
          <Link to="/rider/book-ride">Book a Ride</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRides}</div>
            <p className="text-xs text-muted-foreground">All time rides</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Rides</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRides.length}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Rides Section */}
      {activeRidesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRidesData.map((ride: any) => {
                const canCancel = ride.status === 'REQUESTED';
                const requestTime = new Date(ride.timestamps?.requestedAt || ride.createdAt);
                const now = new Date();
                const timeDiff = (now.getTime() - requestTime.getTime()) / (1000 * 60); // minutes
                const withinCancelWindow = timeDiff <= 5; // 5 minutes window
                
                const handleCancel = async () => {
                  try {
                    await cancelRide(ride._id).unwrap();
                    toast.success('Ride cancelled successfully');
                  } catch (error) {
                    toast.error('Failed to cancel ride');
                    console.log(error)
                  }
                };
                
                return (
                  <div key={ride._id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{ride.pickupLocation?.address}</p>
                        <p className="text-sm text-gray-600">to {ride.destinationLocation?.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Requested: {requestTime.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">৳{ride.fare}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          ride.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {ride.status}
                        </span>
                      </div>
                    </div>
                    
                    {canCancel && withinCancelWindow && (
                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500">
                          Cancel within {Math.max(0, 5 - Math.floor(timeDiff))} minutes
                        </p>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleCancel}
                          className="cursor-pointer"
                        >
                          Cancel Ride
                        </Button>
                      </div>
                    )}
                    
                    {canCancel && !withinCancelWindow && (
                      <p className="text-xs text-gray-400 mt-2 pt-2 border-t">
                        Cancel window expired
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRides.length > 0 ? recentRides.map((ride: any) => {
                const pickupText = typeof ride.pickupLocation === 'object' ? ride.pickupLocation?.address : ride.pickupLocation;
                const dropoffText = typeof ride.destinationLocation === 'object' ? ride.destinationLocation?.address : ride.destinationLocation;
                
                return (
                  <div key={ride._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{pickupText || 'Unknown'} to {dropoffText || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{new Date(ride.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{ride.fare || 0}</p>
                      <p className={`text-sm ${
                        ride.status === 'COMPLETED' ? 'text-green-600' : 
                        ride.status === 'CANCELLED' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {ride.status.charAt(0) + ride.status.slice(1).toLowerCase()}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-center text-muted-foreground py-4">No rides yet</p>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4 cursor-pointer" asChild>
              <Link to="/rider/ride-history">View All Rides</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start cursor-pointer" asChild>
              <Link to="/rider/book-ride">
                <Car className="h-4 w-4 mr-2" />
                Book a New Ride
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start cursor-pointer" asChild>
              <Link to="/rider/ride-history">
                <Clock className="h-4 w-4 mr-2" />
                View Ride History
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start cursor-pointer" asChild>
              <Link to="/rider/profile">
                <MapPin className="h-4 w-4 mr-2" />
                Manage Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
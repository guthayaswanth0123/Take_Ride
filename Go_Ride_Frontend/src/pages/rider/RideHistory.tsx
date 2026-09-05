/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Car, MapPin, Search, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetMyRidesQuery, useGetSingleRideQuery } from "@/redux/features/rides/rides.api";
import { TableRowSkeleton } from "@/components/ui/skeletons";

export default function RideHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [minFare, setMinFare] = useState("");
  const [maxFare, setMaxFare] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const { data: ridesData, isLoading: ridesLoading } = useGetMyRidesQuery({});
  const rides = ridesData?.data || [];

  const { data: selectedRideData } = useGetSingleRideQuery(selectedRideId!, {
    skip: !selectedRideId,
  });
  const selectedRide = selectedRideData?.data;

  const filteredRides = rides.filter((ride: any) => {
    const pickupText =
      typeof ride.pickupLocation === "object"
        ? ride.pickupLocation?.address
        : ride.pickupLocation;
    const dropoffText =
      typeof ride.destinationLocation === "object"
        ? ride.destinationLocation?.address
        : ride.destinationLocation;

    const matchesSearch =
      pickupText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dropoffText?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ride.status.toLowerCase() === statusFilter;
    const rideDate = new Date(ride.createdAt).toISOString().split("T")[0];
    const matchesDate = !dateFilter || rideDate === dateFilter;
    const fare = ride.fare || 0;
    const matchesFare =
      (!minFare || fare >= parseFloat(minFare)) &&
      (!maxFare || fare <= parseFloat(maxFare));
    return matchesSearch && matchesStatus && matchesDate && matchesFare;
  });

  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRides = filteredRides.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Ride History</h1>
        <Button asChild size="sm" className="cursor-pointer">
          <Link to="/rider/book-ride">Book New Ride</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by pickup or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min fare"
                  value={minFare}
                  onChange={(e) => setMinFare(e.target.value)}
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="Max fare"
                  value={maxFare}
                  onChange={(e) => setMaxFare(e.target.value)}
                  className="w-24"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className="cursor-pointer"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("completed")}
                  className="cursor-pointer"
                >
                  Completed
                </Button>
                <Button
                  variant={statusFilter === "cancelled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("cancelled")}
                  className="cursor-pointer"
                >
                  Cancelled
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Ride ID</th>
                  <th className="text-left p-4 font-medium text-sm">From</th>
                  <th className="text-left p-4 font-medium text-sm">To</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Fare</th>
                  <th className="text-left p-4 font-medium text-sm">Date</th>
                  <th className="text-left p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ridesLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))
                ) : (
                  paginatedRides.map((ride: any) => (
                    <tr
                      key={ride._id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <td className="p-4 font-mono text-xs sm:text-sm">
                        #{ride._id.slice(-6)}
                      </td>
                      <td className="p-4 max-w-[150px] sm:max-w-[200px] truncate text-xs sm:text-sm">
                        {typeof ride.pickupLocation === "object"
                          ? ride.pickupLocation?.address
                          : ride.pickupLocation}
                      </td>
                      <td className="p-4 max-w-[150px] sm:max-w-[200px] truncate text-xs sm:text-sm">
                        {typeof ride.destinationLocation === "object"
                          ? ride.destinationLocation?.address
                          : ride.destinationLocation}
                      </td>
                      <td className="p-4">
                        <Badge
                          className={getStatusColor(ride.status.toLowerCase())}
                        >
                          {ride.status.charAt(0).toUpperCase() +
                            ride.status.slice(1).toLowerCase()}
                        </Badge>
                      </td>
                      <td className="p-4 font-semibold text-xs sm:text-sm">৳{ride.fare || 0}</td>
                      <td className="p-4 text-xs sm:text-sm">
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRideId(ride._id)}
                              className="cursor-pointer"
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Ride Details</DialogTitle>
                            </DialogHeader>
                            {selectedRide && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs sm:text-sm text-gray-600">
                                    Ride ID:
                                  </span>
                                  <span className="font-mono text-xs sm:text-sm">
                                    #{selectedRide._id.slice(-8)}
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-green-600 mt-1" />
                                    <div>
                                      <p className="font-medium text-xs sm:text-sm">
                                        Pickup Location
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-600">
                                        {selectedRide.pickupLocation?.address ||
                                          selectedRide.pickupLocation}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Navigation className="h-4 w-4 text-red-600 mt-1" />
                                    <div>
                                      <p className="font-medium text-xs sm:text-sm">
                                        Destination
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-600">
                                        {selectedRide.destinationLocation
                                          ?.address ||
                                          selectedRide.destinationLocation}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                                  <div>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                      Status
                                    </p>
                                    <Badge
                                      className={getStatusColor(
                                        selectedRide.status.toLowerCase()
                                      )}
                                    >
                                      {selectedRide.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                      Fare
                                    </p>
                                    <p className="font-semibold text-xs sm:text-sm">
                                      ৳{selectedRide.fare || 0}
                                    </p>
                                  </div>
                                  {selectedRide.driver && (
                                    <div className="col-span-2">
                                      <p className="text-xs sm:text-sm text-muted-foreground">Driver Info</p>
                                      <div className="space-y-1">
                                        <p className="font-medium text-xs sm:text-sm text-muted-foreground">
                                          Name: {selectedRide.driver.user?.name || 'N/A'}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                          Phone: {selectedRide.driver.user?.phone || 'N/A'}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                          Vehicle: 
                                          {selectedRide.driver.vehicleType} - {selectedRide.driver.vehicleNumber}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4 p-4">
            {ridesLoading ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : (
              paginatedRides.map((ride: any) => (
                <Card key={ride._id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs">
                        #{ride._id.slice(-6)}
                      </span>
                      <Badge
                        className={getStatusColor(ride.status.toLowerCase())}
                      >
                        {ride.status.charAt(0).toUpperCase() +
                          ride.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-green-600 mt-1" />
                        <div>
                          <p className="text-xs font-medium">From</p>
                          <p className="text-xs text-gray-600">
                            {typeof ride.pickupLocation === "object"
                              ? ride.pickupLocation?.address
                              : ride.pickupLocation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation className="h-4 w-4 text-red-600 mt-1" />
                        <div>
                          <p className="text-xs font-medium">To</p>
                          <p className="text-xs text-gray-600">
                            {typeof ride.destinationLocation === "object"
                              ? ride.destinationLocation?.address
                              : ride.destinationLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600">Fare</p>
                        <p className="font-semibold text-xs">৳{ride.fare || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Date</p>
                        <p className="text-xs">
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRideId(ride._id)}
                          className="cursor-pointer"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw]">
                        <DialogHeader>
                          <DialogTitle>Ride Details</DialogTitle>
                        </DialogHeader>
                        {selectedRide && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-600">
                                Ride ID:
                              </span>
                              <span className="font-mono text-xs">
                                #{selectedRide._id.slice(-8)}
                              </span>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-green-600 mt-1" />
                                <div>
                                  <p className="font-medium text-xs">
                                    Pickup Location
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {selectedRide.pickupLocation?.address ||
                                      selectedRide.pickupLocation}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Navigation className="h-4 w-4 text-red-600 mt-1" />
                                <div>
                                  <p className="font-medium text-xs">
                                    Destination
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {selectedRide.destinationLocation?.address ||
                                      selectedRide.destinationLocation}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                              <div>
                                <p className="text-xs text-gray-600">Status</p>
                                <Badge
                                  className={getStatusColor(
                                    selectedRide.status.toLowerCase()
                                  )}
                                >
                                  {selectedRide.status}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Fare</p>
                                <p className="font-semibold text-xs">
                                  ৳{selectedRide.fare || 0}
                                </p>
                              </div>
                              {selectedRide.driver && (
                                <div className="col-span-2">
                                  <p className="text-xs text-muted-foreground">Driver Info</p>
                                  <div className="space-y-1">
                                    <p className="font-medium text-xs text-muted-foreground">
                                      Name: {selectedRide.driver.user?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Phone: {selectedRide.driver.user?.phone || 'N/A'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Vehicle: 
                                      {selectedRide.driver.vehicleType} - {selectedRide.driver.vehicleNumber}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredRides.length)} of{" "}
          {filteredRides.length} rides
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <span className="text-xs sm:text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>

      {filteredRides.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No rides found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't taken any rides yet"}
            </p>
            <Button asChild size="sm" className="cursor-pointer">
              <Link to="/rider/book-ride">Book Your First Ride</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
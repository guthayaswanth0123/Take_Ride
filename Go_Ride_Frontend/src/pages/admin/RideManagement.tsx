/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Car,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Navigation,
  User,
  Clock,
} from "lucide-react";
import { useGetAllRidesQuery } from "@/redux/features/admin/admin.api";

export default function RideManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const itemsPerPage = 10;

  const { data: ridesData } = useGetAllRidesQuery({});
  const rides = ridesData?.data || [];

  const filteredRides = rides.filter((ride: any) => {
    const riderName = ride.rider?.name || "";
    const driverName = ride.driver?.user?.name || "";
    const pickupText =
      typeof ride.pickupLocation === "object"
        ? ride.pickupLocation?.address
        : ride.pickupLocation;
    const dropoffText =
      typeof ride.destinationLocation === "object"
        ? ride.destinationLocation?.address
        : ride.destinationLocation;
    const matchesSearch =
      riderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickupText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dropoffText?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ride.status === statusFilter;
    const rideDate = new Date(ride.createdAt).toISOString().split("T")[0];
    const matchesDate = !dateFilter || rideDate === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRides = filteredRides.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "IN-PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800";
        case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ride Management</h1>
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {filteredRides.length} rides found
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by rider, driver, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border  rounded-md dark:bg-gray-900 dark:text-gray-200 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
                <option value="requested">Requested</option>
              </select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ride ID</TableHead>
                <TableHead>Rider</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRides.map((ride: any) => (
                <TableRow key={ride._id}>
                  <TableCell className="font-medium">
                    #{ride._id.slice(-6)}
                  </TableCell>
                  <TableCell>{ride.rider?.name || "Unknown"}</TableCell>
                  <TableCell>
                    {ride.driver?.user?.name || "Not assigned"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {typeof ride.pickupLocation === "object"
                      ? ride.pickupLocation?.address
                      : ride.pickupLocation}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {typeof ride.destinationLocation === "object"
                      ? ride.destinationLocation?.address
                      : ride.destinationLocation}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ride.status)}>
                      {ride.status.charAt(0).toUpperCase() +
                        ride.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>৳{ride.fare || 0}</TableCell>
                  <TableCell>
                    {new Date(ride.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRide(ride)}
                            className="cursor-pointer border-blue-600 dark:border-blue text-blue-600 hover:border-blue-600 dark:hover:border-white hover:text-blue-600 dark:hover:text-white"
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Ride Details</DialogTitle>
                          </DialogHeader>
                          {selectedRide && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Ride ID
                                  </p>
                                  <p className="font-mono">
                                    #{selectedRide._id.slice(-8)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Status
                                  </p>
                                  <Badge
                                    className={getStatusColor(
                                      selectedRide.status
                                    )}
                                  >
                                    {selectedRide.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <User className="h-4 w-4 text-blue-600 mt-1" />
                                  <div>
                                    <p className="font-medium text-sm">Rider</p>
                                    <p className="text-sm text-gray-600">
                                      {selectedRide.rider?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {selectedRide.rider?.email}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <User className="h-4 w-4 text-purple-600 mt-1" />
                                  <div>
                                    <p className="font-medium text-sm">
                                      Driver
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {selectedRide.driver?.user?.name ||
                                        "Not assigned"}
                                    </p>
                                    {selectedRide.driver?.user?.email && (
                                      <p className="text-xs text-gray-500">
                                        {selectedRide.driver.user.email}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <MapPin className="h-4 w-4 text-green-600 mt-1" />
                                  <div>
                                    <p className="font-medium text-sm">
                                      Pickup Location
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {typeof selectedRide.pickupLocation ===
                                      "object"
                                        ? selectedRide.pickupLocation?.address
                                        : selectedRide.pickupLocation}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <Navigation className="h-4 w-4 text-red-600 mt-1" />
                                  <div>
                                    <p className="font-medium text-sm">
                                      Destination
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {typeof selectedRide.destinationLocation ===
                                      "object"
                                        ? selectedRide.destinationLocation
                                            ?.address
                                        : selectedRide.destinationLocation}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                                <div>
                                  <p className="text-sm text-gray-600">Fare</p>
                                  <p className="font-semibold text-lg">
                                    ৳{selectedRide.fare || 0}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Payment
                                  </p>
                                  <p className="text-sm">
                                    {selectedRide.isPaid ? "Paid" : "Pending"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 pt-3 border-t">
                                <Clock className="h-4 w-4 text-gray-600" />
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Requested At
                                  </p>
                                  <p className="text-sm">
                                    {new Date(
                                      selectedRide.createdAt
                                    ).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(
                                      selectedRide.createdAt
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {ride.status === "REQUESTED" && (
                        <Button variant="destructive" size="sm">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
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
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {paginatedRides.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No rides found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
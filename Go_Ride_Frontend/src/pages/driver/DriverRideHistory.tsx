/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useGetDriverRideHistoryQuery } from "@/redux/features/driver/driver.api";

export default function DriverRideHistory() {
  const {
    data: rideHistoryData,
    isLoading,
    error,
  } = useGetDriverRideHistoryQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  const rideHistory = rideHistoryData?.data || {};
  const allRides = rideHistory.rides || [];

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");
  const ridesPerPage = 10;

  // Filter rides based on status, search, and date
  const filteredRides = allRides.filter((ride: any) => {
    const matchesStatus =
      statusFilter === "ALL" || ride.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      ride.rider?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.pickupLocation?.address
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      ride.destinationLocation?.address
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== "ALL") {
      const rideDate = new Date(ride.createdAt);
      const now = new Date();

      switch (dateFilter) {
        case "TODAY": {
          matchesDate = rideDate.toDateString() === now.toDateString();
          break;
        }
        case "WEEK": {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = rideDate >= weekAgo;
          break;
        }
        case "MONTH": {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = rideDate >= monthAgo;
          break;
        }
      }
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRides.length / ridesPerPage);
  const startIndex = (currentPage - 1) * ridesPerPage;
  const paginatedRides = filteredRides.slice(
    startIndex,
    startIndex + ridesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setStatusFilter("ALL");
    setSearchQuery("");
    setDateFilter("ALL");
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REJECTED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-primary">Ride History</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Rides
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allRides.filter((r: any) => r.status === "COMPLETED").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Rides
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {allRides.filter((r: any) => r.status === "REJECTED").length}
            </div>
            <p className="text-xs text-muted-foreground">Declined by driver</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cancelled Rides
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {allRides.filter((r: any) => r.status === "CANCELLED").length}
            </div>
            <p className="text-xs text-muted-foreground">Cancelled rides</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{rideHistory.totalEarnings || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed rides
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search rides..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateFilter}
              onValueChange={(value) => {
                setDateFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Time</SelectItem>
                <SelectItem value="TODAY">Today</SelectItem>
                <SelectItem value="WEEK">This Week</SelectItem>
                <SelectItem value="MONTH">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters} className="cursor-pointer">
              Clear Filters
            </Button>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {paginatedRides.length} of {filteredRides.length} rides
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ride History</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedRides.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Date & Time</th>
                    <th className="text-left p-3 font-medium">Route</th>
                    <th className="text-left p-3 font-medium">Rider</th>
                    <th className="text-left p-3 font-medium">Fare</th>
                    <th className="text-left p-3 font-medium">Status</th>
                 
                  </tr>
                </thead>
                <tbody>
                  {paginatedRides.map((ride: any) => {
                    const pickupAddress =
                      typeof ride.pickupLocation === "object"
                        ? ride.pickupLocation?.address
                        : ride.pickupLocation;
                    const destinationAddress =
                      typeof ride.destinationLocation === "object"
                        ? ride.destinationLocation?.address
                        : ride.destinationLocation;

                    return (
                      <tr
                        key={ride._id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="font-medium">
                              {new Date(ride.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(ride.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="font-medium flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-green-600" />
                              {pickupAddress || "Unknown"}
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-red-600" />
                              {destinationAddress || "Unknown"}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm font-medium">
                            {ride.rider?.name ||
                              ride.rider?.email ||
                              "Loading..."}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm font-bold">৳{ride.fare}</div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(ride.status)}>
                            {ride.status}
                          </Badge>
                        </td>
                       
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {isLoading
                  ? "Loading rides..."
                  : error
                  ? "Error loading rides. Please try again."
                  : filteredRides.length === 0 && allRides.length > 0
                  ? "No rides match your current filters"
                  : "No rides yet. Start accepting ride requests to build your history!"}
              </p>
              {filteredRides.length === 0 && allRides.length > 0 && (
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredRides.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0 cursor-pointer"
                      >
                        {page}
                      </Button>
                    );
                  })}

                  {totalPages > 10 && (
                    <>
                      <span className="px-2 py-1 text-sm text-muted-foreground">
                        ...
                      </span>
                      <Button
                        variant={
                          currentPage === totalPages ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 p-0 cursor-pointer"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

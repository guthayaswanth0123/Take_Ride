/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, DollarSign, TrendingUp, UserCheck } from "lucide-react";
import { useGetAdminReportQuery, useGetAllUsersQuery } from "@/redux/features/admin/admin.api";

import AdminChart from "./AdminChart";

export default function AdminDashboard() {
  const { data: reportData } = useGetAdminReportQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  // const [approveDriver] = useApproveDriverMutation();
  // const [blockUser] = useBlockUserMutation();
  
  const report = reportData?.data;
  const users = usersData?.data || [];
  
  const pendingDrivers = users.filter((user: any) => 
    user.role === 'DRIVER' && !user.isApproved
  );
  
  const recentUsers = users.slice(-4).reverse();

  // const handleApproveDriver = async (driverId: string) => {
  //   try {
  //     await approveDriver(driverId).unwrap();
  //     toast.success("Driver approved successfully");
  //   } catch (error) {
  //     toast.error("Failed to approve driver");
  //     console.error("Error approving driver:", error);
  //   }
  // };

  // const handleBlockDriver = async (driverId: string) => {
  //   try {
  //     await blockUser(driverId).unwrap();
  //     toast.success("Driver blocked successfully");
  //   } catch (error) {
  //     toast.error("Failed to block driver");
  //     console.error(error);
  //   }
  // };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.totalDrivers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered drivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{report?.totalEarnings || 0}</div>
            <p className="text-xs text-muted-foreground">From completed rides</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.totalRides || 0}</div>
            <p className="text-xs text-muted-foreground">All time rides</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            
            <div className="space-y-4">
              {recentUsers.map((user: any) => (
                <div key={user._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {user.role === "RIDER" && <Users className="h-5 w-5 text-primary" />}
                    {user.role === "DRIVER" && <Car className="h-5 w-5 text-primary" />}
                    {user.role === "ADMIN" && <UserCheck className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">Registered as {user.role}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Driver Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDrivers.slice(0, 3).map((driver: any) => (
                <div key={driver._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Car className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">{driver.email}</p>
                    </div>
                  </div>
                </div>
              ))}
              {pendingDrivers.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No pending driver applications
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminChart />
        </CardContent>
      </Card>
    </div>
  );
}
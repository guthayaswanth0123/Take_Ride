/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useApproveDriverMutation,
  useSuspendDriverMutation,
} from "@/redux/features/admin/admin.api";
import toast from "react-hot-toast";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  const { data: usersData } = useGetAllUsersQuery({});
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [approveDriver] = useApproveDriverMutation();
  const [suspendDriver] = useSuspendDriverMutation();

  const users = usersData?.data || [];

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const isBlocked = user.isBlock === "BLOCK";
    const isPending = user.role === "DRIVER" && !user.isApproved;
    const status = isBlocked ? "BLOCKED" : isPending ? "PENDING" : "";
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "BLOCKED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "RIDER":
        return "bg-blue-100 text-blue-800";
      case "DRIVER":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await blockUser(userId).unwrap();
      toast.success("User blocked successfully");
    } catch (error) {
      toast.error("Failed to block user");
      console.log(error);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await unblockUser(userId).unwrap();
      toast.success("User unblocked successfully");
    } catch (error) {
      toast.error("Failed to unblock user");
      console.log(error);
    }
  };

  const handleApproveDriver = async (userId: string) => {
    try {
      await approveDriver(userId).unwrap();
      toast.success("Driver approved successfully");
    } catch (error) {
      toast.error("Failed to approve driver");
      console.log(error);
    }
  };

  const handleSuspendDriver = async (userId: string) => {
    try {
      await suspendDriver(userId).unwrap();
      toast.success("Driver suspended successfully");
    } catch (error) {
      toast.error("Failed to suspend driver");
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {filteredUsers.length} users found | Page {currentPage} of{" "}
            {totalPages}
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="dark:bg-gray-900 dark:text-white px-3 py-2 border rounded-md cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="RIDER">Riders</option>
                <option value="DRIVER">Drivers</option>
                <option value="ADMIN">Admins</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="BLOCKED">Blocked</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {paginatedUsers.map((user: any) => {
          const isBlocked = user.isBlock === "BLOCK";
          const isPending = user.role === "DRIVER" && !user.isApproved;
          const status = isBlocked ? "BLOCKED" : isPending ? "PENDING" : "";

          return (
            <Card key={user._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary dark:text-blue-200" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      {status && (
                        <Badge className={getStatusColor(status)}>{status}</Badge>
                      )}
                      {user.role === "DRIVER" && user.isApproved && (
                        <Badge className="bg-green-100 text-green-800">
                          Approved
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {user.role === "DRIVER" && (
                      !user.isApproved && isPending ? (
                        <Button
                          size="sm"
                          onClick={() => handleApproveDriver(user._id)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <UserCheck className="h-4 w-4" />
                          Approve Driver
                        </Button>
                      ) : user.isApproved ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendDriver(user._id)}
                          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 cursor-pointer"
                        >
                          <UserX className="h-4 w-4" />
                          Suspend Driver
                        </Button>
                      ) : null
                    )}

                    {user.role === "RIDER" && (
                      isBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnblockUser(user._id)}
                          className="flex items-center gap-2 cursor-pointer text-green-600 hover:text-green-700"
                        >
                          <UserCheck className="h-4 w-4" />
                          Unblock Rider
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBlockUser(user._id)}
                          className="flex items-center gap-2 cursor-pointer dark:bg-red-700"
                        >
                          <UserX className="h-4 w-4" />
                          Block Rider
                        </Button>
                      )
                    )}
                  </div> 
                </div>
                <div className="flex justify-between gap-4 mt-3 text-sm text-muted-foreground">
                  <span>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                 
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </Button>
                  )
                )}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
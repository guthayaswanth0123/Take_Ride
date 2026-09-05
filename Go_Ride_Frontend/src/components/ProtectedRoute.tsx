import { Navigate, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: userInfo, isLoading, error } = useUserInfoQuery();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle 401 Forbidden error as blocked/suspended user

if (error instanceof Object && "status" in error && error.status === 401) {
    return <Navigate to="/account-status" state={{ from: location, isBlockedOrSuspended: true }} replace />;
  }

  if (error || !userInfo?.data) {
    console.error("UserInfoQuery error:", error);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = userInfo.data;

  // Check if user is blocked or driver is not approved/suspended
  if (
    user.isBlock === "BLOCK" ||
    (user.role === "DRIVER" && (!user.isApproved || user.isSuspended))
  ) {
    return <Navigate to="/account-status" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
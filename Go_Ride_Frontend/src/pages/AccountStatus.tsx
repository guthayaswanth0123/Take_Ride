import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Mail, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";


export default function AccountStatus() {
  const { data: userInfo, isLoading, error } = useUserInfoQuery();
  const { state } = useLocation();

  if (isLoading) return <LoadingSpinner />;

  // Handle error case (e.g., 401Forbidden)
  if (error || !userInfo?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="mt-4 text-xl font-semibold text-gray-900">
              Account Restricted
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {state?.isBlockedOrSuspended
                ? "Your account is blocked or suspended. Please contact support to resolve this issue."
                : "Unable to fetch account status. Please try again or contact support."}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">To resolve this issue:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Contact our support team</li>
                <li>• Provide your account details</li>
                <li>• Wait for review process</li>
              </ul>
            </div>
            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full cursor-pointer">
                <a href="mailto:support@goride.com" className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full cursor-pointer">
                <a href="tel:+1234567890" className="flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </a>
              </Button>
            </div>
            <div className="pt-4 border-t">
              <Button variant="ghost" asChild className="cursor-pointer">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = userInfo.data;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-xl font-semibold text-gray-900">
            {user.isBlock === "BLOCK"
              ? "Account Blocked"
              : user.role === "DRIVER" && (!user.isApproved || user.isSuspended)
              ? "Driver Account Issue"
              : "Account Status"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {user.isBlock === "BLOCK"
              ? "Your account has been blocked due to policy violations or security concerns."
              : user.role === "DRIVER" && user.isSuspended
              ? "Your driver account is suspended. Please contact support to resolve this issue."
              : "There is an issue with your account that needs to be resolved."}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h4 className="font-medium text-gray-900 mb-2">To resolve this issue:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Contact our support team</li>
              <li>• Provide your account details</li>
              <li>• Wait for review process</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <a href="mailto:support@goride.com" className="flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <a href="tel:+1234567890" className="flex items-center justify-center">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </a>
            </Button>
          </div>
          <div className="pt-4 border-t">
            <Button variant="ghost" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
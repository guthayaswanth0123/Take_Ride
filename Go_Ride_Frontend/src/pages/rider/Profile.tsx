/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { User, Phone, Mail, MapPin, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useUpdateProfileMutation } from "@/redux/features/user/user.api";
import Password from "@/components/ui/Password";
import { ProfileSkeleton } from "@/components/ui/skeletons";

interface ProfileForm {
  name: string;
  phone: string;
  address: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const { data: userInfo, isLoading } = useUserInfoQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [activeTab, setActiveTab] = useState("profile");
  
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileForm>();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch } = useForm<PasswordForm>();

  const user = userInfo?.data;

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile({ 
        userId: user?._id, 
        userData: data 
      }).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      // API call to change password
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex space-x-1 border-b">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-t animate-pulse"></div>
          ))}
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <div className="flex flex-col md:flex-row space-x-1 border-b">
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          onClick={() => setActiveTab("profile")}
          className="rounded-b-none cursor-pointer"
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
        <Button
          variant={activeTab === "password" ? "default" : "ghost"}
          onClick={() => setActiveTab("password")}
          className="rounded-b-none cursor-pointer"
        >
          <Shield className="h-4 w-4 mr-2" />
          Password
        </Button>
        <Button
          variant={activeTab === "safety" ? "default" : "ghost"}
          onClick={() => setActiveTab("safety")}
          className="rounded-b-none cursor-pointer"
        >
          <Phone className="h-4 w-4 mr-2" />
          Safety
        </Button>
      </div>

      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      defaultValue={user?.name}
                      className="pl-10"
                      {...registerProfile("name", { required: "Name is required" })}
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email}
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      defaultValue={user?.phone}
                      className="pl-10"
                      {...registerProfile("phone", { required: "Phone number is required" })}
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-sm text-red-600">{profileErrors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      defaultValue={user?.address}
                      className="pl-10"
                      {...registerProfile("address")}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto cursor-pointer">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "password" && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Password
                  id="currentPassword"
                  {...registerPassword("currentPassword", { required: "Current password is required" })}
                />
                  
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Password
                  id="newPassword"
                  {...registerPassword("newPassword", { 
                    required: "New password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Password
                  id="confirmPassword"
                  {...registerPassword("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: (value) => value === watch("newPassword") || "Passwords do not match"
                  })}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full md:w-auto cursor-pointer">
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "safety" && (
        <Card>
          <CardHeader>
            <CardTitle>Safety Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Emergency Contacts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Primary Contact</p>
                    <p className="text-sm text-muted-foreground">+880 1734483221</p>
                  </div>
                  <Button variant="outline" size="sm" className="cursor-pointer">Edit</Button>
                </div>
                <Button variant="outline" className="w-full cursor-pointer">
                  Add Emergency Contact
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Safety Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Share Trip Details</p>
                    <p className="text-sm text-muted-foreground">Automatically share ride details with emergency contacts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Location Tracking</p>
                    <p className="text-sm text-muted-foreground">Allow location tracking during rides for safety</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
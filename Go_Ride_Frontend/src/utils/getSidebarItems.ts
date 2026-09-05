import { 
  Home, 
  Car, 
  DollarSign, 
  Clock, 
  Users, 
  Navigation, 
  Shield,
  UserCheck
} from "lucide-react";
import { role } from "@/constants/role";
import type { TRole } from "@/types";


export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
}

export const getSidebarItems = (userRole: TRole): SidebarItem[] => {
  const baseUrl = `/${userRole?.toLowerCase()}`;
  
  switch (userRole) {
    case role.rider:
      return [
        { href: `${baseUrl}/dashboard`, label: 'Dashboard', icon: Home },
        { href: `${baseUrl}/book-ride`, label: 'Book Ride', icon: Car },
        { href: `${baseUrl}/live-tracking`, label: 'Live Tracking', icon: Navigation },
        { href: `${baseUrl}/ride-history`, label: 'Ride History', icon: Clock },
        { href: `${baseUrl}/profile`, label: 'Profile', icon: UserCheck },
        { href: `${baseUrl}/safety`, label: 'Safety', icon: Shield },
      ];
    
    case role.driver:
      return [
        { href: `${baseUrl}/dashboard`, label: 'Dashboard', icon: Home },
        { href: `${baseUrl}/earnings`, label: 'Earnings', icon: DollarSign },
        { href: `${baseUrl}/history`, label: 'Ride History', icon: Clock },
        { href: `${baseUrl}/profile`, label: 'Profile', icon: UserCheck },
      ];
    
    case role.admin:
      return [
        { href: `${baseUrl}/dashboard`, label: 'Dashboard', icon: Home },
        { href: `${baseUrl}/users`, label: 'User Management', icon: Users },
        { href: `${baseUrl}/rides`, label: 'Ride Management', icon: Car },
        { href: `${baseUrl}/profile`, label: 'Profile', icon: UserCheck },
      ];
    
    default:
      return [];
  }
};
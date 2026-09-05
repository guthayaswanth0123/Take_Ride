"use client"

import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation, Navigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useUserInfoQuery, useLogoutMutation } from "@/redux/features/auth/auth.api"

import { Menu } from "lucide-react"
import Logo from "@/assets/icons/Logo"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./ModeToggler"
import { getSidebarItems } from "@/utils/getSidebarItems"
import LoadingSpinner from "../LoadingSpinner"

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const { data: userInfo, isLoading, error } = useUserInfoQuery()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  if (isLoading) return <LoadingSpinner />

  if (error instanceof Object && "status" in error && error.status === 401) {

 
    return <Navigate to="/account-status" state={{ from: location, isBlockedOrSuspended: true }} replace />;
  }

  if (error || !userInfo?.data) {
    toast.error(error ? "Failed to fetch user information" : "User not found");
    navigate("/login");
    return null;
  }

  const user = userInfo?.data
  const sidebarItems = getSidebarItems(user?.role)

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      localStorage.removeItem("token")
      toast.success("Logged out successfully")
      navigate("/")
    } catch (err) {
      toast.error("Logout failed")
      console.error(err)
    }
  }

  const currentItem = sidebarItems.find((item) => location.pathname.startsWith(item.href))

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-black">
      {/* Sidebar for md+ */}
      <aside className={cn("w-64 bg-white dark:bg-black shadow-sm border-r hidden md:flex flex-col")}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-foreground font-semibold text-xl">GoRide</span>
          </Link>
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto">
          <div className="px-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 w-64 h-full bg-white dark:bg-black shadow-lg z-50 p-6">
            <div className="flex justify-between items-center mb-6">
              <Link to="/" className="flex items-center gap-2">
                <Logo />
                <span className="text-foreground font-semibold text-xl">GoRide</span>
              </Link>
              <Button variant="ghost" onClick={() => setSidebarOpen(false)}>
                ✕
              </Button>
            </div>
            <nav>
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 text-muted-foreground hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-black shadow-sm border-b px-4 py-3 flex items-center justify-between md:justify-between">
           <h3 className="text-lg font-primary font-semibold">Welcome, {user?.name}</h3>
          <div className="flex items-center space-x-4 md:hidden">
            <Button variant="ghost" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {currentItem && <span className="text-foreground font-semibold">{currentItem.label}</span>}
          </div>
          <div className="flex items-center space-x-4">
             <ModeToggle />
           <Button onClick={handleLogout} variant="destructive" className="cursor-pointer">Logout</Button>
            
           
          </div>
        </header>

        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

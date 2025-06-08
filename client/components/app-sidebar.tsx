"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/app/context/AuthContext"
import {
  Home,
  Search,
  Settings,
  LogOut,
  Vote,
  PlusCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Create Poll",
    url: "/dashboard/create-poll",
    icon: PlusCircle,
  },
  {
    title: "View polls",
    url: "/dashboard/polls",
    icon: Vote,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    toast.success("You have been successfully logged out.")
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title} className={isActive ? "bg-gray-200 rounded-md" : ""}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={`flex items-center gap-2 px-2 py-1 ${isActive ? "text-gray-900 font-semibold" : "text-gray-900 hover:text-gray-900"}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

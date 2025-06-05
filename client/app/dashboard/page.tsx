"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  UserCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProtectedRoute } from "@/app/utils/withAuth"
import { useAuth } from "@/app/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner" 

interface UserData {
  username: string
  roles: string[]
}

export default function DashboardPage() {
  useProtectedRoute()

  const { logout } = useAuth()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Unauthorized")

        const data = await res.json()
        setUser({ username: data.username, roles: data.roles })
      } catch (err) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    logout()
    toast.success("You have been successfully logged out.")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
      {/* Header with Dropdown Menu */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">eVote Dashboard</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white">
              <UserCircle className="w-5 h-5" />
              {user?.username}
              <Menu className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-white/10 text-white">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem disabled>
              Role: <span className="ml-1 italic">{user?.roles.join(", ")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-500">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-purple-400" />
              Welcome, {user?.username}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>This dashboard is part of the <strong>Cryptography & Blockchain</strong> module.</p>
            <p>Your account roles: <code>{user?.roles.join(", ")}</code></p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              Secure Voting Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>Explore zero-knowledge voting, end-to-end encryption, and verifiable election results in future updates.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

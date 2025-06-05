"use client"
import { useAuth } from "@/app/context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export const useProtectedRoute = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])
}

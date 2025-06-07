// app/dashboard/layout.tsx

"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserContextType {
  user: {
    id?: string;
    username: string;
    roles: string[];
  } | null;
  publicKey: string;
}

const DashboardUserContext = createContext<UserContextType | null>(null);
export const useDashboardUser = () => useContext(DashboardUserContext);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserContextType["user"]>(null);
  const [publicKey, setPublicKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        const currentUser = {
          id: data.id || data._id,
          username: data.username,
          roles: data.roles,
        };

        setUser(currentUser);

        // Fetch public key
        const pubRes = await fetch(`http://localhost:3001/api/users/${currentUser.id}/public-key`);
        const pubData = await pubRes.json();
        if (pubRes.ok) setPublicKey(pubData.publicKey || "No public key found.");
        else console.error("Error:", pubData.message);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <DashboardUserContext.Provider value={{ user, publicKey }}>
      <SidebarProvider>
        <div className="flex min-h-screen min-w-full text-white">
          <AppSidebar />
          <main className="p-6 w-full">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </DashboardUserContext.Provider>
  );
}

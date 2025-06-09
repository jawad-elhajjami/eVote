import React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Url } from "next/dist/shared/lib/router/router";

export default function DashboardError({error, btnText, link}: { error: string, btnText?: string, link: Url }) {
  return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading poll
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <Link href={link}>
            <Button variant="destructive" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {btnText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

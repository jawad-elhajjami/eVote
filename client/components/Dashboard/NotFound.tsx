import React from "react";
import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Url } from "next/dist/shared/lib/router/router";
export default function NotFound({notFoundMessage, description, btnText, link}: { notFoundMessage?: string, description?: string, btnText?: string, link: Url }) {
  return (
    <div className="p-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              {notFoundMessage || "404 Not Found"}
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              {description || "The page you are looking for does not exist."}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Link href={link}>
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {btnText || "Go back"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

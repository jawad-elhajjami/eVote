import React from 'react'
import { RefreshCw } from 'lucide-react'

export default function Loading({loadingMessage}: { loadingMessage?: string }) {
  return (
    <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">{loadingMessage}</span>
        </div>
      </div>
  )
}

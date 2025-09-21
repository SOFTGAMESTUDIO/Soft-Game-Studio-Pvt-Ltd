import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-600 dark:bg-neutral-950 transition-colors duration-300">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-purple-200 dark:border-neutral-700 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
        
        {/* Inner ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-purple-100 dark:border-neutral-600 border-t-transparent dark:border-t-transparent rounded-full animate-spin animation-delay-500"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-50 dark:bg-neutral-400 rounded-full"></div>
        
        {/* Text */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4">
          <p className="text-purple-100 dark:text-neutral-300 font-medium text-sm">Loading...</p>
        </div>
      </div>
    </div>
  )
}

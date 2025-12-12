'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface NavigationContextType {
  isNavigating: boolean
  setNavigating: (_navigating: boolean) => void
  navigationTarget: string | null
  setNavigationTarget: (_target: string | null) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationTarget, setNavTarget] = useState<string | null>(null)

  const setNavigating = useCallback((navigating: boolean) => {
    setIsNavigating(navigating)
    if (!navigating) {
      setNavTarget(null)
    }
  }, [])

  const setNavigationTarget = useCallback((target: string | null) => {
    setNavTarget(target)
  }, [])

  return (
    <NavigationContext.Provider value={{
      isNavigating,
      setNavigating,
      navigationTarget,
      setNavigationTarget
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

'use client'

import Link from 'next/link'
import { useNavigation } from '@/context/navigationContext'
import { useEffect } from 'react'

interface NavigationLinkProps {
  href: string
  onClick?: () => void
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  component?: unknown
  active?: boolean
  py?: string
  leftSection?: React.ReactNode
  description?: React.ReactNode
  [key: string]: unknown // For other props like component, active, etc.
}

export function NavigationLink({ href, onClick, children, ...props }: NavigationLinkProps) {
  const { setNavigating, setNavigationTarget } = useNavigation()

  const handleClick = () => {
    // Check if this is a different page navigation
    const currentPath = window.location.pathname
    if (href !== currentPath) {
      setNavigating(true)
      setNavigationTarget(href)
    }

    if (onClick !== undefined) {
      onClick()
    }
  }

  // Clear navigation state when component unmounts or href changes
  useEffect(() => {
    return () => {
      setNavigating(false)
    }
  }, [href, setNavigating])

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  )
}

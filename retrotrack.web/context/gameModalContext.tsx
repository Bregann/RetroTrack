'use client'

import { LoggedInGameModal } from '@/components/shared/LoggedInGameModal'
import { LoggedOutGameModal } from '@/components/shared/LoggedOutGameModal'
import { createContext, useContext, useState } from 'react'
import { useAuth } from './authContext'

type GameModalContextType = {
  showModal: (_gameId: number) => void
}

const GameModalContext = createContext<GameModalContextType | undefined>(undefined)

export const GameModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameId, setGameId] = useState<number | null>(null)
  const auth = useAuth()

  const showModal = (id: number) => {
    setGameId(id)
  }

  return (
    <GameModalContext.Provider value={{ showModal }}>
      {children}
      {gameId !== null && auth.user == null && <LoggedOutGameModal gameId={gameId} onClose={() => setGameId(null)} />}
      {gameId !== null && auth.user != null && <LoggedInGameModal gameId={gameId} onClose={() => setGameId(null)} />}
    </GameModalContext.Provider>
  )
}

export const useGameModal = () => {
  const context = useContext(GameModalContext)
  if (context === undefined) {
    throw new Error('useGameModal must be used within a GameModalProvider')
  }
  return context
}

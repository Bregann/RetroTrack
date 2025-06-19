'use client'

import { LoggedInGameModal } from '@/components/shared/LoggedInGameModal'
import { createContext, useContext, useState } from 'react'

type GameModalContextType = {
  showModal: (gameId: number) => void
}

const GameModalContext = createContext<GameModalContextType | undefined>(undefined)

export const GameModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameId, setGameId] = useState<number | null>(null)

  const showModal = (id: number) => {
    setGameId(id)
  }

  return (
    <GameModalContext.Provider value={{ showModal }}>
      {children}
      {gameId !== null && <LoggedInGameModal gameId={gameId} onClose={() => setGameId(null)} />}
    </GameModalContext.Provider>
  )
}

export const useGameModal = () => {
  const context = useContext(GameModalContext)
  if (!context) {
    throw new Error('useGameModal must be used within a GameModalProvider')
  }
  return context
}

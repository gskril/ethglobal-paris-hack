import { useContext } from 'react'

import { GlobalContext } from '@/context'

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error('useGlobalContext must be used within a ContextProvider')
  }

  return context
}

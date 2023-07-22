import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useAccount } from 'wagmi'

type GlobalContextValue = {
  address: string | undefined
  token: string | undefined
  setToken: (token: string) => void
}

export const GlobalContext = createContext<GlobalContextValue | undefined>(
  undefined
)

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount()
  const [storedToken, setStoredToken] = useLocalStorage('firebase-token', '')

  useAccount({
    onDisconnect: () => {
      setStoredToken('')
    },
  })

  return (
    <GlobalContext.Provider
      value={{
        address,
        token: storedToken,
        setToken: setStoredToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

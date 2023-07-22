import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Address, useAccount } from 'wagmi'

type GlobalContextValue = {
  address: Address | undefined
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
      // remove token from localStorage
      window.localStorage.removeItem('firebase-token')
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

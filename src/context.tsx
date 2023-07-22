import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Address, useAccount } from 'wagmi'

type GlobalContextValue = {
  address: Address | undefined
  token: string | undefined
  setToken: (token: string) => void
  firebaseToken: string | undefined
  setFirebaseToken: (token: string) => void
}

export const GlobalContext = createContext<GlobalContextValue | undefined>(
  undefined
)

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount()
  const [token, setToken] = useLocalStorage('token', '')
  const [firebaseToken, setFirebaseToken] = useLocalStorage(
    'firebase-token',
    ''
  )

  useAccount({
    onDisconnect: () => {
      // remove token from localStorage
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('firebase-token')
    },
  })

  return (
    <GlobalContext.Provider
      value={{
        address,
        token: token,
        setToken: setToken,
        firebaseToken: firebaseToken,
        setFirebaseToken: setFirebaseToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

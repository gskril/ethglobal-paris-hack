import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Address, useAccount } from 'wagmi'
import { User } from '@/lib/db/interfaces/user'

type GlobalContextValue = {
  address: Address | undefined
  token: string | undefined
  setToken: (token: string) => void
  firebaseToken: string | undefined
  setFirebaseToken: (token: string) => void
  user: User | undefined
  setUser: (user: User) => void
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
  const [user, setUser] = useState<User | undefined>(undefined)

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
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

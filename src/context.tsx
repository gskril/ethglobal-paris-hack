import React, { ReactNode, createContext } from 'react'
import { useSessionStorage } from 'usehooks-ts'
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

const emptyUser: User = {
  address: '',
}

export const GlobalContext = createContext<GlobalContextValue | undefined>(
  undefined
)

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount()
  const [token, setToken] = useSessionStorage('token', '')
  const [user, setUser] = useSessionStorage('user', emptyUser)
  const [firebaseToken, setFirebaseToken] = useSessionStorage(
    'firebase-token',
    ''
  )

  useAccount({
    onDisconnect: () => {
      // remove token from localStorage
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('firebase-token')
      window.localStorage.removeItem('user')
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

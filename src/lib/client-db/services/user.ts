import {
  createFirestoreCollectionDocument,
  getFirestoreCollectionDocumentById,
  getFirstFirestoreCollectionDocumentByWhereConditions,
  getWhereConditionObject,
} from '@/lib/client-db/firestore'
import { User } from '@/lib/db/interfaces/user'
import { formatAddress } from '@/lib/utils'

const COLLECTION_NAME = 'users'
export async function getUserById(id: string): Promise<User | null> {
  return await getFirestoreCollectionDocumentById<User>(COLLECTION_NAME, id)
}

export async function getUserByAddress(address: string): Promise<User | null> {
  return await getFirstFirestoreCollectionDocumentByWhereConditions<User>(
    COLLECTION_NAME,
    [getWhereConditionObject('address', '==', address.toLowerCase())]
  )
}

export async function createUser(user: User): Promise<string> {
  return await createFirestoreCollectionDocument(COLLECTION_NAME, user)
}

export function getUserName(user: User | undefined): string {
  if (!user) return ''
  return (
    user?.ensLabel ||
    user?.farcasterFName ||
    user?.lensHandle ||
    formatAddress(user?.address)
  )
}

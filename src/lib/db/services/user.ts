import { auth } from '@/lib/db/firebase'
import {
  createFirestoreCollectionDocument,
  getFirestoreCollectionDocumentById,
  getFirstFirestoreCollectionDocumentByWhereConditions,
  getWhereConditionObject,
} from '@/lib/db/firestore'
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

export function getUserName(user: User): string {
  return (
    user.ensLabel ||
    user.farcasterFName ||
    user.lensHandle ||
    formatAddress(user.address)
  )
}

export async function getCurrentUser(): Promise<User | null> {
  const firebaseUser = auth.currentUser
  return getUserById(firebaseUser?.uid as string)
}

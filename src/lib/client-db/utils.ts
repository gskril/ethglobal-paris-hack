import { auth } from '@/lib/client-db/index'
import { User } from '@/lib/db/interfaces/user'
import { getUserById } from '@/lib/client-db/services/user'

export async function loginWithToken(
  firebaseToken: string
): Promise<User | null> {
  await auth.signInWithCustomToken(firebaseToken)
  return getUserById(auth.currentUser!.uid)
}

import { auth } from '@/lib/client-db/index'

export async function loginWithToken(firebaseToken: string) {
  await auth.signInWithCustomToken(firebaseToken)
}

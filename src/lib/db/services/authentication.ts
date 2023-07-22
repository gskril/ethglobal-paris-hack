import { auth } from '@/lib/db/firebase'

export async function loginWithToken(firebaseToken: string) {
  await auth.signInWithCustomToken(firebaseToken)
}

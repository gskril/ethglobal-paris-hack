import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY
  const FIREBASE_CLIENT_EMAIL = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL

  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    throw new Error(
      'Missing Firebase environment variables. Check your .env file.'
    )
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: FIREBASE_CLIENT_EMAIL,
    }),
  })
  admin.firestore().settings({ ignoreUndefinedProperties: true, merge: true })
}

export const auth = admin.auth()
export const firestoreAdmin = admin.firestore()

export default admin

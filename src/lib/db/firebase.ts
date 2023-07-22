import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'

const config = {
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
}

const getFirebase = () => {
  if (typeof window !== undefined && !firebase.apps.length) {
    return firebase.initializeApp(config)
  }

  return firebase.app()
}

const database = getFirebase().database()
const auth = getFirebase().auth()
const firestore = getFirebase().firestore()

export default database
export { firestore, firebase, auth }

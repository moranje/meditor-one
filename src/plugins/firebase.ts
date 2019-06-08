import firebase from 'firebase/app'

// Add additional services that you want to use
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: 'meditor-one.firebaseapp.com',
  databaseURL: 'https://meditor-one.firebaseio.com',
  projectId: 'meditor-one',
  storageBucket: 'meditor-one.appspot.com',
  messagingSenderId: '821857467011',
}

const firebaseApp = firebase.initializeApp(config)

export { firebase }
export const db = firebaseApp.firestore()

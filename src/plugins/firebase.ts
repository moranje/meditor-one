import firebase from 'firebase/app'

// Add additional services that you want to use
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  // Needs not be hidden
  apiKey: 'AIzaSyCWn_A-3XbZTI40rsvjOTuG0I1VKq2O8nI',
  authDomain: 'meditor-one.firebaseapp.com',
  databaseURL: 'https://meditor-one.firebaseio.com',
  projectId: 'meditor-one',
  storageBucket: 'meditor-one.appspot.com',
  messagingSenderId: '821857467011',
}

const firebaseApp = firebase.initializeApp(config)

export { firebase }
export const db = firebaseApp.firestore()

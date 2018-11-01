import firebase from 'firebase';

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: 'meditor-one.firebaseapp.com',
  databaseURL: 'https://meditor-one.firebaseio.com',
  projectId: 'meditor-one',
  storageBucket: 'meditor-one.appspot.com',
  messagingSenderId: '821857467011'
};

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.database();

export const dbFoldersRef = db.ref('owner/folders');
export const dbFilesRef = db.ref('owner/files');
export const dbCompletionsRef = db.ref('completions');
export const dbUsersRef = db.ref('users');

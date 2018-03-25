import firebase from "firebase";

let config = {
  apiKey: "AIzaSyCWn_A-3XbZTI40rsvjOTuG0I1VKq2O8nI",
  authDomain: "meditor-one.firebaseapp.com",
  databaseURL: "https://meditor-one.firebaseio.com",
  projectId: "meditor-one",
  storageBucket: "meditor-one.appspot.com",
  messagingSenderId: "821857467011"
};

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.database();

export const dbFoldersRef = db.ref("folders");
export const dbFilesRef = db.ref("files");

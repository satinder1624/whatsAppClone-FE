import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDXU9XTT2K-xQq4fhdrGghccwMGMRUa4no",
  authDomain: "whatsappclone-1dfc1.firebaseapp.com",
  projectId: "whatsappclone-1dfc1",
  storageBucket: "whatsappclone-1dfc1.appspot.com",
  messagingSenderId: "499886129645",
  appId: "1:499886129645:web:ac4447f0e294dc510427e4",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };

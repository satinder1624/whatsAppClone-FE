// import firebase from "firebase";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXU9XTT2K-xQq4fhdrGghccwMGMRUa4no",
  authDomain: "whatsappclone-1dfc1.firebaseapp.com",
  projectId: "whatsappclone-1dfc1",
  storageBucket: "whatsappclone-1dfc1.appspot.com",
  messagingSenderId: "499886129645",
  appId: "1:499886129645:web:ac4447f0e294dc510427e4",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

export { auth, provider };

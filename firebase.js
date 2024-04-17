import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7Wrm9tcE7J3oujKvmXDMsbuTG7O71d-w",
  authDomain: "noww-d5ce2.firebaseapp.com",
  projectId: "noww-d5ce2",
  storageBucket: "noww-d5ce2.appspot.com",
  messagingSenderId: "306704748489",
  appId: "1:306704748489:web:cc76ee29a10370edea2218",
  measurementId: "G-1B3B0BPKJL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
const facebookProvider = new FacebookAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, auth, provider, appleProvider, facebookProvider, storage };

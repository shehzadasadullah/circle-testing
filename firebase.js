// import * as firebase from "firebase/app";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   OAuthProvider,
//   FacebookAuthProvider,
// } from "firebase/auth";

// //production
// const firebaseConfig = {
//   apiKey: "AIzaSyA7Wrm9tcE7J3oujKvmXDMsbuTG7O71d-w",
//   authDomain: "noww-d5ce2.firebaseapp.com",
//   projectId: "noww-d5ce2",
//   storageBucket: "noww-d5ce2.appspot.com",
//   messagingSenderId: "306704748489",
//   appId: "1:306704748489:web:cc76ee29a10370edea2218",
//   measurementId: "G-1B3B0BPKJL",
// };

// const app = initializeApp(firebaseConfig);

// // const db = getFirestore(app);
// const db = getFirestore();
// const auth = getAuth();
// const provider = new GoogleAuthProvider();
// const appleProvider = new OAuthProvider("apple.com");
// const facebookProvider = new FacebookAuthProvider();

// export { db, auth, provider, appleProvider, facebookProvider };
// // Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7Wrm9tcE7J3oujKvmXDMsbuTG7O71d-w",
  authDomain: "noww-d5ce2.firebaseapp.com",
  projectId: "noww-d5ce2",
  storageBucket: "noww-d5ce2.appspot.com",
  messagingSenderId: "306704748489",
  appId: "1:306704748489:web:cc76ee29a10370edea2218",
  measurementId: "G-1B3B0BPKJL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
const facebookProvider = new FacebookAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { db, auth, provider, appleProvider, facebookProvider, storage };

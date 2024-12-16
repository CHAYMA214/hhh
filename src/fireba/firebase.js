// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase,ref, push, set ,get } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvehnRx7jE6hw76LSa4XFQWdf_ZI3aTsA",
  authDomain: "uphabit-38b11.firebaseapp.com",
  databaseURL: "https://uphabit-38b11-default-rtdb.firebaseio.com",
  projectId: "uphabit-38b11",
  storageBucket: "uphabit-38b11.firebasestorage.app",
  messagingSenderId: "994684030435",
  appId: "1:994684030435:web:70f6915d857b3df64f24d6",
  measurementId: "G-YDPPP7BXPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
export { app, auth, db, database,ref,push,set,get};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc5HJ3SIwrWKJGRjn67JDXjuP_sSb_Gp4",
  authDomain: "cheat-sheet-62dad.firebaseapp.com",
  projectId: "cheat-sheet-62dad",
  storageBucket: "cheat-sheet-62dad.appspot.com",
  messagingSenderId: "689405364498",
  appId: "1:689405364498:web:e50209c5e2f0b18c180bcb",
  measurementId: "G-GBXK6YQPZJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

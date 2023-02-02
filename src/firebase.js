// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./firebase-config";

// Initialize Firebase
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

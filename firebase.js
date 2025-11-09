// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjcy9i3qxcFG5S3SOSbpGVPbc0zfJJiyM",
  authDomain: "snout-scout-cb03d.firebaseapp.com",
  projectId: "snout-scout-cb03d",
  storageBucket: "snout-scout-cb03d.firebasestorage.app",
  messagingSenderId: "246461195343",
  appId: "1:246461195343:web:77afee029d149648ba763a",
  measurementId: "G-32JS8QHGLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
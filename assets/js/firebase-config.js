// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey : "AIzaSyBUBbt3KY14oGSYGD45b4C2pZK0OIdfpyY" , 
  authDomain : "fir-webdevelopment.firebaseapp.com" , 
  projectId : "fir-webdevelopment" , 
  storageBucket : "fir-webdevelopment.firebasestorage.app" , 
  messagingSenderId : "781668512389" , 
  appId : "1:781668512389:web:2813b1f6663720bea3afec" , 
  measurementId : "G-JEEC5B6SS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

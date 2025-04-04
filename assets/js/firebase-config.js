import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey : "AIzaSyBUBbt3KY14oGSYGD45b4C2pZK0OIdfpyY" , 
  authDomain : "fir-webdevelopment.firebaseapp.com" , 
  projectId : "fir-webdevelopment" , 
  storageBucket : "fir-webdevelopment.firebasestorage.app" , 
  messagingSenderId : "781668512389" , 
  appId : "1:781668512389:web:2813b1f6663720bea3afec" , 
  measurementId : "G-JEEC5B6SS3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

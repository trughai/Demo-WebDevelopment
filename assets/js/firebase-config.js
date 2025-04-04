// Import các module cần thiết từ Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey : "AIzaSyBUBbt3KY14oGSYGD45b4C2pZK0OIdfpyY" , 
  authDomain : "fir-webdevelopment.firebaseapp.com" , 
  projectId : "fir-webdevelopment" , 
  storageBucket : "fir-webdevelopment.firebasestorage.app" , 
  messagingSenderId : "781668512389" , 
  appId : "1:781668512389:web:2813b1f6663720bea3afec" , 
  measurementId : "G-JEEC5B6SS3"
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo các service Firestore, Auth và Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

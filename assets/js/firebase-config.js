import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"; // Import Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUBbt3KY14oGSYGD45b4C2pZK0OIdfpyY",
  authDomain: "fir-webdevelopment.firebaseapp.com",
  projectId: "fir-webdevelopment",
  storageBucket: "fir-webdevelopment.firebasestorage.app",
  messagingSenderId: "781668512389",
  appId: "1:781668512389:web:2813b1f6663720bea3afec",
  measurementId: "G-JEEC5B6SS3"
};

// Khởi tạo Firebase app
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ Firebase
const auth = getAuth(app);
const db = getFirestore(app);  // Khởi tạo Firestore

export { auth, db }; // Xuất auth và db

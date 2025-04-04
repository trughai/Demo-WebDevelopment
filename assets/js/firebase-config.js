import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyBUBbt3KY14oGSYGD45b4C2pZK0OIdfpyY",
  authDomain: "fir-webdevelopment.firebaseapp.com",
  projectId: "fir-webdevelopment",
  storageBucket: "fir-webdevelopment.firebasestorage.app",
  messagingSenderId: "781668512389",
  appId: "1:781668512389:web:2813b1f6663720bea3afec",
  measurementId: "G-JEEC5B6SS3"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

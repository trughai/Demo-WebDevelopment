// Firebase cấu hình
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const productList = document.getElementById("product-list");

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.name}" />
      <h3>${data.name}</h3>
      <p>Giá: ${data.price}đ</p>
      <button>Thêm vào giỏ</button>
    `;
    productList.appendChild(card);
  });
}

fetchProducts();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const cartItemsDiv = document.getElementById("cart-items");
const userInfoDiv = document.getElementById("user-info");
const usernameSpan = document.getElementById("username");
const logoutBtn = document.getElementById("logoutBtn");
const cartCountSpan = document.getElementById("cart-count");

let currentUserEmail = "";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserEmail = user.email;
    usernameSpan.textContent = user.displayName || user.email;
    userInfoDiv.style.display = "flex";
    loadCart();
  } else {
    alert("Bạn chưa đăng nhập. Đang chuyển hướng...");
    window.location.href = "login.html";
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

async function loadCart() {
  const q = query(collection(db, "cart"), where("user", "==", currentUserEmail));
  const querySnapshot = await getDocs(q);
  cartItemsDiv.innerHTML = "";

  let count = 0;

  if (querySnapshot.empty) {
    cartItemsDiv.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
  }

  querySnapshot.forEach((docSnap) => {
    const item = docSnap.data();
    count++;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>Giá: ${item.price}</p>
        <button class="delete-btn" data-id="${docSnap.id}">Xóa</button>
      </div>
    `;

    cartItemsDiv.appendChild(itemDiv);
  });

  cartCountSpan.textContent = count;

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await deleteDoc(doc(db, "cart", id));
      loadCart();
    });
  });
}

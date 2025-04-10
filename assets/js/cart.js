// cart.js
import { auth, db } from "./firebase-config.js";
import {
  doc,
  updateDoc,
  arrayRemove,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const cartList = document.getElementById("cart-list");
const totalPriceEl = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    displayCart();
  } else {
    cartList.innerHTML = "<li>Vui lòng đăng nhập để xem giỏ hàng</li>";
    totalPriceEl.textContent = "Tổng tiền: 0 đ";
  }
});

async function displayCart() {
  const userRef = doc(db, "users", currentUser.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) return;

  const cartItems = userDoc.data().cart || [];
  cartList.innerHTML = "";
  let total = 0;

  for (const itemId of cartItems) {
    const productRef = doc(db, "products", itemId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const product = productDoc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${product.name}</strong> - ${product.price.toLocaleString("vi-VN")} đ
        <button class="remove-btn" data-id="${itemId}">Xoá</button>
      `;
      cartList.appendChild(li);
      total += product.price;
    }
  }

  totalPriceEl.textContent = `Tổng tiền: ${total.toLocaleString("vi-VN")} đ`;

  // Gắn sự kiện xoá sau khi render xong
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await removeFromCart(productId);
    });
  });
}

async function removeFromCart(productId) {
  const userRef = doc(db, "users", currentUser.uid);
  try {
    await updateDoc(userRef, {
      cart: arrayRemove(productId),
    });
    alert("Đã xoá sản phẩm khỏi giỏ hàng.");
    displayCart();
  } catch (err) {
    console.error("Lỗi khi xoá sản phẩm:", err);
  }
}

checkoutBtn.addEventListener("click", async () => {
  const userRef = doc(db, "users", currentUser.uid);
  try {
    await updateDoc(userRef, {
      cart: [],
    });
    alert("Bạn đã mua hàng thành công!");
    displayCart();
  } catch (err) {
    console.error("Lỗi khi thanh toán:", err);
  }
});

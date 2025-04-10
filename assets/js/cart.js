import { db } from "./firebase-config.js";
import {
  doc, updateDoc, arrayUnion, arrayRemove, getDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const auth = getAuth();
let currentUser = null;

// Theo dõi trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    displayCart(); // Chỉ gọi khi user đã xác thực xong
  } else {
    document.getElementById("cart-list").innerHTML = "<li>Vui lòng đăng nhập để xem giỏ hàng</li>";
    document.getElementById("total-price").textContent = "Tổng tiền: 0 đ";
  }
});

async function displayCart() {
  const userRef = doc(db, "users", currentUser.uid);
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const cartItems = userDoc.data().cart || [];
      const cartList = document.getElementById("cart-list");
      cartList.innerHTML = '';
      let totalPrice = 0;

      for (const itemId of cartItems) {
        const productRef = doc(db, "products", itemId);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const product = productDoc.data();
          const li = document.createElement("li");
          li.textContent = `Sản phẩm: ${product.name}, Giá: ${product.price.toLocaleString("vi-VN")} đ`;

          const removeButton = document.createElement("button");
          removeButton.textContent = "Xoá";
          removeButton.onclick = () => removeFromCart(itemId);

          li.appendChild(removeButton);
          cartList.appendChild(li);

          totalPrice += product.price;
        }
      }

      document.getElementById("total-price").textContent =
        `Tổng tiền: ${totalPrice.toLocaleString("vi-VN")} đ`;
    }
  } catch (err) {
    console.error("Lỗi khi tải giỏ hàng:", err);
  }
}

async function removeFromCart(productId) {
  const userRef = doc(db, "users", currentUser.uid);
  try {
    await updateDoc(userRef, {
      cart: arrayRemove(productId),
    });
    alert("Sản phẩm đã được xoá khỏi giỏ hàng!");
    displayCart();
  } catch (err) {
    console.error("Lỗi khi xoá sản phẩm:", err);
  }
}

async function checkout() {
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
}

// Gắn hàm mua hàng vào window để HTML gọi được
window.checkout = checkout;

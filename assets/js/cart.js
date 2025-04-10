import { db } from "./firebase-config.js";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const auth = getAuth();
let currentUser = null;

// Theo dõi trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    displayCart(); // Gọi khi đã đăng nhập
  } else {
    document.getElementById("cart-list").innerHTML =
      "<li>Vui lòng đăng nhập để xem giỏ hàng</li>";
    document.getElementById("total-price").textContent = "Tổng tiền: 0 đ";
  }
});

async function displayCart() {
  const userRef = doc(db, "users", currentUser.uid);
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const cartItems = userDoc.data().cart || [];
      console.log("🛒 Danh sách ID sản phẩm trong giỏ hàng:", cartItems);

      const cartList = document.getElementById("cart-list");
      cartList.innerHTML = "";
      let totalPrice = 0;

      if (cartItems.length === 0) {
        cartList.innerHTML = "<li>Giỏ hàng trống</li>";
        document.getElementById("total-price").textContent = "Tổng tiền: 0 đ";
        return;
      }

      for (const productId of cartItems) {
        try {
          const productRef = doc(db, "products", productId);
          const productDoc = await getDoc(productRef);

          if (productDoc.exists()) {
            const product = productDoc.data();
            console.log("✅ Tìm thấy sản phẩm:", product);

            const li = document.createElement("li");
            li.classList.add("cart-item");

            li.innerHTML = `
              <img src="${product.imageUrl}" alt="${product.name}" width="80" />
              <div class="info">
                <h3>${product.name}</h3>
                <p>Giá: ${Number(product.price).toLocaleString("vi-VN")} đ</p>
              </div>
            `;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Xoá";
            removeButton.classList.add("remove-button");
            removeButton.onclick = () => removeFromCart(productId);

            li.appendChild(removeButton);
            cartList.appendChild(li);

            totalPrice += Number(product.price);
          } else {
            console.warn(`⚠️ Không tìm thấy sản phẩm với ID: ${productId}`);
          }
        } catch (err) {
          console.error(`❌ Lỗi khi lấy thông tin sản phẩm ${productId}:`, err);
        }
      }

      document.getElementById("total-price").textContent =
        `Tổng tiền: ${totalPrice.toLocaleString("vi-VN")} đ`;
    }
  } catch (err) {
    console.error("❌ Lỗi khi tải giỏ hàng:", err);
  }
}

async function removeFromCart(productId) {
  const userRef = doc(db, "users", currentUser.uid);
  try {
    await updateDoc(userRef, {
      cart: arrayRemove(productId),
    });
    alert("Sản phẩm đã được xoá khỏi giỏ hàng!");
    displayCart(); // Refresh lại
  } catch (err) {
    console.error("❌ Lỗi khi xoá sản phẩm:", err);
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
    console.error("❌ Lỗi khi thanh toán:", err);
  }
}

// ✅ Cho HTML gọi được hàm thanh toán
window.checkout = checkout;

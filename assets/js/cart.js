import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

async function getCartItems() {
  const user = firebase.auth().currentUser;

  if (user) {
    const cartRef = doc(db, "carts", user.uid); // Truy cập giỏ hàng của người dùng
    try {
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        displayCartItems(cartData.items); // Hiển thị giỏ hàng
      } else {
        console.log("Giỏ hàng trống");
      }
    } catch (err) {
      console.error("Lỗi tải giỏ hàng:", err);
    }
  } else {
    console.log("Chưa đăng nhập!");
  }
}

// Hiển thị sản phẩm trong giỏ hàng
function displayCartItems(items) {
  const cartList = document.getElementById("cart-list");
  const totalPriceElem = document.getElementById("total-price");
  let totalPrice = 0;

  cartList.innerHTML = ''; // Xóa danh sách giỏ hàng hiện tại

  items.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("cart-item");

    li.innerHTML = `
      <div class="cart-item-details">
        <img src="${item.imageUrl}" alt="${item.name}" />
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>Giá: ${item.price}₫</p>
          <p>Số lượng: ${item.quantity}</p>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="remove-item" onclick="removeFromCart('${item.id}')">Xóa</button>
      </div>
    `;

    cartList.appendChild(li);
    totalPrice += item.price * item.quantity; // Cập nhật tổng tiền
  });

  totalPriceElem.textContent = `Tổng tiền: ${totalPrice}₫`;
}

// Lấy giỏ hàng khi trang được tải
window.onload = getCartItems;

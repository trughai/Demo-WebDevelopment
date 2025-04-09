import { db, auth } from "./firebase-config.js";
import { collection, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const cartList = document.getElementById("cart-list");
  const totalAmountElem = document.getElementById("total-amount");
  const user = auth.currentUser;

  if (!user) {
    alert("Bạn cần đăng nhập để xem giỏ hàng.");
    window.location.href = "index.html"; // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return;
  }

  try {
    const cartRef = query(collection(db, "carts"), where("userId", "==", user.uid));
    const cartSnapshot = await getDocs(cartRef);
    let totalAmount = 0;

    if (cartSnapshot.empty) {
      cartList.innerHTML = "<p>Giỏ hàng của bạn trống.</p>";
      return;
    }

    cartSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const totalItemPrice = data.quantity * data.price;
      totalAmount += totalItemPrice;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.name}" width="100">
        <h4>${data.name}</h4>
        <p>${Number(data.price).toLocaleString()}đ</p>
        <p>Số lượng: ${data.quantity}</p>
        <button data-id="${docSnap.id}" class="remove-from-cart-btn">Xóa</button>
      `;
      cartList.appendChild(cartItem);
    });

    totalAmountElem.innerHTML = `Tổng tiền: ${totalAmount.toLocaleString()}đ`;

    // Xử lý sự kiện xóa sản phẩm trong giỏ hàng
    document.querySelectorAll(".remove-from-cart-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const cartId = event.target.getAttribute("data-id");
        await deleteDoc(doc(db, "carts", cartId));
        window.location.reload(); // Làm mới trang giỏ hàng sau khi xóa
      });
    });
  } catch (err) {
    console.error("Lỗi tải giỏ hàng:", err);
    cartList.innerHTML = "<p>Lỗi tải giỏ hàng.</p>";
  }
});

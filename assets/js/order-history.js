import { db, auth } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const orderList = document.getElementById("order-list");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  currentUser = user;
  await loadOrderHistory();
});

async function loadOrderHistory() {
  const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    orderList.innerHTML = "<p>Bạn chưa có đơn hàng nào.</p>";
    return;
  }

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const orderItemList = data.orderItems.map(item => `
      <div class="order-item">
        <img src="${item.imageUrl}" alt="${item.name}" />
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>Số lượng: ${item.quantity}</p>
          <p>Giá: ${item.price.toLocaleString()}đ</p>
        </div>
      </div>
    `).join("");

    const order = document.createElement("div");
    order.className = "order";
    order.innerHTML = `
      <h3>Đơn hàng #${docSnap.id}</h3>
      <p>Trạng thái: ${data.status}</p>
      <div class="order-items">${orderItemList}</div>
      <p>Tổng cộng: ${data.totalAmount.toLocaleString()}đ</p>
    `;

    orderList.appendChild(order);
  });
}

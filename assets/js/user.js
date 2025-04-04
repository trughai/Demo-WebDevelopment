import { auth, db } from "./firebase-config.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Hiển thị danh sách sản phẩm
async function loadProducts() {
  const productsRef = collection(db, "products");
  const querySnapshot = await getDocs(productsRef);
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.name}</strong><br>
      Price: ${data.price} <br>
      <img src="${data.imageUrl}" alt="${data.name}" width="100" />
      <button class="order-btn" data-id="${docSnap.id}" data-name="${data.name}" data-price="${data.price}" data-image="${data.imageUrl}">Order</button>
    `;
    productList.appendChild(li);
  });

  // Gán sự kiện cho các nút "Order"
  document.querySelectorAll(".order-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productId = btn.getAttribute("data-id");
      const productName = btn.getAttribute("data-name");
      const productPrice = btn.getAttribute("data-price");
      const productImage = btn.getAttribute("data-image");

      await placeOrder(productId, productName, productPrice, productImage);
    });
  });
}

// Đặt hàng
async function placeOrder(productId, productName, productPrice, productImage) {
  const user = auth.currentUser;

  if (!user) {
    alert("You need to be logged in to place an order.");
    return;
  }

  try {
    // Tạo đơn hàng
    const orderData = {
      userId: user.uid,
      productId,
      productName,
      productPrice,
      productImage,
      status: "pending",  // Trạng thái đơn hàng
      createdAt: new Date()
    };

    // Lưu đơn hàng vào Firestore
    await addDoc(collection(db, "orders"), orderData);

    alert("Your order has been placed successfully!");
    loadOrders();
  } catch (error) {
    alert("Failed to place the order: " + error.message);
  }
}

// Hiển thị đơn hàng của người dùng
async function loadOrders() {
  const user = auth.currentUser;

  if (!user) return;

  const ordersRef = collection(db, "orders");
  const querySnapshot = await getDocs(ordersRef);
  const orderList = document.getElementById("order-list");
  orderList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.userId === user.uid) {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${data.productName}</strong><br>
        Price: ${data.productPrice} <br>
        Status: ${data.status} <br>
        <img src="${data.productImage}" alt="${data.productName}" width="100" />
      `;
      orderList.appendChild(li);
    }
  });
}

// Gọi hàm loadProducts khi trang được tải
loadProducts();
loadOrders();

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});

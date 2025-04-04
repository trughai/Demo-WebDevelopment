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

      openOrderModal(productId, productName, productPrice, productImage);
    });
  });
}

// Hiển thị modal để người dùng nhập địa chỉ
function openOrderModal(productId, productName, productPrice, productImage) {
  const orderModal = document.getElementById("order-modal");
  const orderInfo = document.getElementById("order-info");
  
  // Hiển thị thông tin sản phẩm trong modal
  orderInfo.innerHTML = `
    <strong>${productName}</strong><br>
    Price: ${productPrice}<br>
    <img src="${productImage}" alt="${productName}" width="100" />
  `;

  orderModal.style.display = "block";

  // Lưu lại thông tin sản phẩm vào data-modal
  orderModal.setAttribute("data-product-id", productId);
  orderModal.setAttribute("data-product-name", productName);
  orderModal.setAttribute("data-product-price", productPrice);
  orderModal.setAttribute("data-product-image", productImage);
}

// Đóng modal khi nhấn "Cancel"
document.getElementById("cancel-order-btn").addEventListener("click", () => {
  document.getElementById("order-modal").style.display = "none";
});

// Đặt hàng
document.getElementById("place-order-btn").addEventListener("click", async () => {
  const orderModal = document.getElementById("order-modal");
  const address = document.getElementById("shipping-address").value.trim();

  if (!address) {
    alert("Please enter your shipping address.");
    return;
  }

  const productId = orderModal.getAttribute("data-product-id");
  const productName = orderModal.getAttribute("data-product-name");
  const productPrice = orderModal.getAttribute("data-product-price");
  const productImage = orderModal.getAttribute("data-product-image");

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
      shippingAddress: address,
      status: "pending",  // Trạng thái đơn hàng
      createdAt: new Date()
    };

    // Lưu đơn hàng vào Firestore
    const orderDoc = await addDoc(collection(db, "orders"), orderData);

    alert("Your order has been placed successfully!");

    // Cập nhật lại danh sách đơn hàng ngay lập tức mà không cần tải lại trang
    const newOrder = {
      id: orderDoc.id,
      ...orderData
    };
    displayOrder(newOrder);

    // Đóng modal
    orderModal.style.display = "none";

  } catch (error) {
    alert("Failed to place the order: " + error.message);
  }
});

// Hiển thị đơn hàng của người dùng
function displayOrder(order) {
  const orderList = document.getElementById("order-list");
  const li = document.createElement("li");

  li.innerHTML = `
    <strong>${order.productName}</strong><br>
    Price: ${order.productPrice} <br>
    Shipping Address: ${order.shippingAddress}<br>
    Status: ${order.status} <br>
    <img src="${order.productImage}" alt="${order.productName}" width="100" />
  `;

  orderList.appendChild(li);
}

// Hiển thị tất cả đơn hàng của người dùng
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
      const order = {
        id: docSnap.id,
        ...data
      };
      displayOrder(order);
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

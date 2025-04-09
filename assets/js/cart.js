import { db, auth } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const cartContainer = document.getElementById("cart-container");
const checkoutBtn = document.getElementById("checkout-btn");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  currentUser = user;
  await loadCartItems();
});

async function loadCartItems() {
  cartContainer.innerHTML = "";
  const q = query(collection(db, "carts"), where("userId", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    cartContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
    return;
  }

  let totalPrice = 0;

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const quantity = data.quantity || 1;
    const price = Number(data.price);
    const itemTotal = quantity * price;
    totalPrice += itemTotal;

    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.name}" />
      <div class="item-info">
        <h3>${data.name}</h3>
        <p>Giá: ${price.toLocaleString()}đ</p>
        <div class="quantity-control">
          <button class="decrease">−</button>
          <span class="quantity">${quantity}</span>
          <button class="increase">+</button>
        </div>
        <p class="item-total">Thành tiền: ${itemTotal.toLocaleString()}đ</p>
        <button class="remove">Xóa khỏi giỏ</button>
      </div>
    `;

    // Nút xoá
    item.querySelector(".remove").addEventListener("click", async () => {
      await deleteDoc(doc(db, "carts", docSnap.id));
      await loadCartItems();
    });

    // Nút tăng
    item.querySelector(".increase").addEventListener("click", async () => {
      const newQty = quantity + 1;
      await updateDoc(doc(db, "carts", docSnap.id), { quantity: newQty });
      await loadCartItems();
    });

    // Nút giảm
    item.querySelector(".decrease").addEventListener("click", async () => {
      if (quantity > 1) {
        const newQty = quantity - 1;
        await updateDoc(doc(db, "carts", docSnap.id), { quantity: newQty });
        await loadCartItems();
      }
    });

    cartContainer.appendChild(item);
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "cart-total";
  totalDiv.innerHTML = `<h3>Tổng cộng: ${totalPrice.toLocaleString()}đ</h3>`;
  cartContainer.appendChild(totalDiv);

  // Hiển thị nút thanh toán
  checkoutBtn.style.display = "block";
}

// Thanh toán
checkoutBtn.addEventListener("click", async () => {
  const cartSnapshot = await getDocs(query(collection(db, "carts"), where("userId", "==", currentUser.uid)));

  if (cartSnapshot.empty) {
    alert("Giỏ hàng trống, không thể thanh toán!");
    return;
  }

  const orderItems = [];
  let totalAmount = 0;

  cartSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const quantity = data.quantity || 1;
    const price = Number(data.price);
    totalAmount += quantity * price;

    orderItems.push({
      name: data.name,
      price: data.price,
      quantity,
      imageUrl: data.imageUrl
    });
  });

  const orderId = Date.now().toString();
  const orderData = {
    userId: currentUser.uid,
    orderItems,
    totalAmount,
    status: "Pending",
    createdAt: new Date()
  };

  // Lưu đơn hàng vào Firestore
  await setDoc(doc(db, "orders", orderId), orderData);

  // Xoá tất cả sản phẩm trong giỏ
  const batch = db.batch();
  cartSnapshot.forEach((docSnap) => {
    batch.delete(doc(db, "carts", docSnap.id));
  });
  await batch.commit();

  alert("Thanh toán thành công!");

  // Đưa người dùng về trang chủ hoặc trang lịch sử đơn hàng
  window.location.href = "order-history.html"; // Bạn có thể thay đổi để dẫn đến trang Lịch sử Đơn hàng
});

import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const cartList = document.getElementById("cart-list");
const totalPrice = document.getElementById("total-price");

document.addEventListener("DOMContentLoaded", () => {
  const user = auth.currentUser;
  if (user) {
    loadCart(user.uid);  // Tải giỏ hàng của người dùng
  } else {
    window.location.href = "login.html";  // Nếu chưa đăng nhập, chuyển hướng tới trang login
  }
});

// Hàm tải giỏ hàng từ Firestore
async function loadCart(userId) {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);  // Lấy document giỏ hàng của user

  // Nếu giỏ hàng chưa có, tạo mới
  if (!cartSnap.exists()) {
    await setDoc(cartRef, { products: [] });  // Tạo giỏ hàng trống
  }

  // Lấy dữ liệu giỏ hàng sau khi đảm bảo document đã tồn tại
  const cartData = cartSnap.data();

  // Hiển thị các sản phẩm trong giỏ hàng
  cartList.innerHTML = '';
  let total = 0;
  cartData.products.forEach((product, index) => {
    const productItem = document.createElement("li");
    productItem.innerHTML = `
      <div>${product.name} - ${product.price.toLocaleString()}đ</div>
      <div>Số lượng: <input type="number" value="${product.quantity}" data-index="${index}" class="quantity" min="1" /></div>
      <button class="remove" data-index="${index}">Xóa</button>
    `;
    cartList.appendChild(productItem);

    total += product.price * product.quantity;  // Tính tổng tiền
  });

  totalPrice.innerHTML = `Tổng tiền: ${total.toLocaleString()} đ`;

  // Thêm sự kiện tăng/giảm số lượng sản phẩm
  document.querySelectorAll(".quantity").forEach(input => {
    input.addEventListener("change", async (e) => {
      const index = e.target.getAttribute("data-index");
      const newQuantity = parseInt(e.target.value, 10);

      if (newQuantity < 1) return;

      cartData.products[index].quantity = newQuantity;
      await updateCart(userId, cartData);
    });
  });

  // Xóa sản phẩm khỏi giỏ hàng
  document.querySelectorAll(".remove").forEach(button => {
    button.addEventListener("click", async (e) => {
      const index = e.target.getAttribute("data-index");
      cartData.products.splice(index, 1);  // Xóa sản phẩm khỏi mảng
      await updateCart(userId, cartData);
      loadCart(userId);  // Tải lại giỏ hàng
    });
  });
}

// Cập nhật giỏ hàng vào Firestore
async function updateCart(userId, cartData) {
  const cartRef = doc(db, "carts", userId);
  await setDoc(cartRef, cartData);  // Cập nhật document giỏ hàng
}

// Hàm thêm sản phẩm vào giỏ
async function addToCart(product) {
  const user = auth.currentUser;
  if (!user) {
    alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ!");
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  let cartData = { products: [] };
  if (cartSnap.exists()) {
    cartData = cartSnap.data();
  }

  // Kiểm tra xem sản phẩm đã có trong giỏ chưa
  const existingProductIndex = cartData.products.findIndex(p => p.name === product.name);
  if (existingProductIndex >= 0) {
    cartData.products[existingProductIndex].quantity += 1;  // Tăng số lượng nếu sản phẩm đã có
  } else {
    cartData.products.push({ ...product, quantity: 1 });  // Thêm sản phẩm mới vào giỏ
  }

  await updateCart(user.uid, cartData);
  alert("Sản phẩm đã được thêm vào giỏ hàng!");
}

import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Lấy user đã đăng nhập
const auth = getAuth();
const user = auth.currentUser;

// Hiển thị danh sách sản phẩm
async function displayProducts() {
  const productsCollection = collection(db, "products"); // Truy cập collection sản phẩm
  const productList = document.getElementById("product-list");

  try {
    // Lấy tất cả sản phẩm từ Firestore
    const querySnapshot = await getDocs(productsCollection);
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productElement = document.createElement("div");
      productElement.classList.add("product");

      productElement.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image"/>
        <h2>${product.name}</h2>
        <p>Giá: ${product.price} đ</p>
        <button onclick="addToCart('${doc.id}')">Thêm vào giỏ hàng</button>
      `;

      productList.appendChild(productElement);
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", err);
  }
}

// Thêm sản phẩm vào giỏ hàng
async function addToCart(productId) {
  if (user) {
    const userRef = doc(db, "users", user.uid); // Truy cập tài liệu người dùng

    try {
      // Cập nhật giỏ hàng của người dùng bằng cách thêm ID sản phẩm vào
      await updateDoc(userRef, {
        cart: arrayUnion(productId) // Thêm sản phẩm vào giỏ hàng
      });
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    }
  } else {
    alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
  }
}

// Gọi hàm khi trang được tải
window.onload = displayProducts;

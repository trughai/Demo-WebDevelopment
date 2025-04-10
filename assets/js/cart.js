import { db } from "./firebase-config.js";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Lấy user đã đăng nhập
const auth = getAuth();
const user = auth.currentUser;

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
      displayCart();  // Cập nhật lại giỏ hàng khi thêm sản phẩm
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    }
  } else {
    alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
  }
}

// Xoá sản phẩm khỏi giỏ hàng
async function removeFromCart(productId) {
  if (user) {
    const userRef = doc(db, "users", user.uid); // Truy cập tài liệu người dùng

    try {
      // Cập nhật giỏ hàng của người dùng bằng cách xoá ID sản phẩm khỏi giỏ hàng
      await updateDoc(userRef, {
        cart: arrayRemove(productId) // Xoá sản phẩm khỏi giỏ hàng
      });
      alert("Sản phẩm đã được xoá khỏi giỏ hàng!");
      displayCart(); // Cập nhật lại giỏ hàng hiển thị trên trang
    } catch (err) {
      console.error("Lỗi khi xoá sản phẩm khỏi giỏ hàng:", err);
      alert("Có lỗi xảy ra khi xoá sản phẩm khỏi giỏ hàng.");
    }
  } else {
    alert("Bạn cần đăng nhập để xoá sản phẩm khỏi giỏ hàng.");
  }
}

// Xoá tất cả sản phẩm trong giỏ hàng khi mua hàng
async function checkout() {
  if (user) {
    const userRef = doc(db, "users", user.uid); // Truy cập tài liệu người dùng

    try {
      // Cập nhật giỏ hàng của người dùng bằng cách xoá hết sản phẩm
      await updateDoc(userRef, {
        cart: [] // Xoá tất cả sản phẩm khỏi giỏ hàng
      });
      alert("Bạn đã mua hàng thành công!");
      displayCart();  // Cập nhật lại giỏ hàng
    } catch (err) {
      console.error("Lỗi khi thanh toán:", err);
      alert("Có lỗi xảy ra khi thanh toán.");
    }
  } else {
    alert("Bạn cần đăng nhập để thanh toán.");
  }
}

// Hiển thị giỏ hàng của người dùng
async function displayCart() {
  if (user) {
    const userRef = doc(db, "users", user.uid); // Truy cập tài liệu người dùng

    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const cartItems = userDoc.data().cart; // Lấy giỏ hàng của người dùng

        const cartList = document.getElementById("cart-list");
        cartList.innerHTML = ''; // Xoá danh sách giỏ hàng hiện tại
        let totalPrice = 0;  // Khởi tạo tổng tiền

        // Lấy thông tin sản phẩm từ Firestore
        for (const itemId of cartItems) {
          const productRef = doc(db, "products", itemId); // Truy cập sản phẩm từ Firestore
          const productDoc = await getDoc(productRef);

          if (productDoc.exists()) {
            const product = productDoc.data();
            const li = document.createElement("li");
            li.textContent = `Sản phẩm: ${product.name}, Giá: ${product.price.toLocaleString("vi-VN")} đ`; // Hiển thị tên và giá sản phẩm

            const removeButton = document.createElement("button");
            removeButton.textContent = "Xoá";
            removeButton.onclick = () => removeFromCart(itemId);

            li.appendChild(removeButton);
            cartList.appendChild(li);

            // Cộng dồn giá trị tổng tiền
            totalPrice += product.price;
          }
        }

        // Hiển thị tổng tiền giỏ hàng
        const totalPriceElement = document.getElementById("total-price");
        totalPriceElement.textContent = `Tổng tiền: ${totalPrice.toLocaleString("vi-VN")} đ`;
      } else {
        console.log("Giỏ hàng trống");
        document.getElementById("cart-list").innerHTML = "<li>Giỏ hàng trống</li>";
        document.getElementById("total-price").textContent = "Tổng tiền: 0 đ";
      }
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
    }
  } else {
    console.log("Chưa đăng nhập!");
    document.getElementById("cart-list").innerHTML = "<li>Vui lòng đăng nhập để xem giỏ hàng</li>";
    document.getElementById("total-price").textContent = "Tổng tiền: 0 đ";
  }
}

// Gọi hàm khi trang được tải
window.onload = displayCart;

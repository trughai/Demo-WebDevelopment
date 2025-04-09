// Firebase Firestore setup (import Firestore and Firebase config)
import { db } from "./firebase-config.js";  // Đảm bảo bạn đã có firebase-config.js
import { doc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Hàm thêm sản phẩm vào giỏ hàng (Firestore)
async function addToCart(id, name, price, imageUrl) {
  const user = firebase.auth().currentUser;

  if (user) {
    const cartRef = doc(db, "carts", user.uid); // Truy cập giỏ hàng của người dùng trong Firestore

    try {
      const cartDoc = await getDoc(cartRef);

      // Nếu giỏ hàng tồn tại, cập nhật giỏ hàng
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const product = { id, name, price, imageUrl, quantity: 1 }; // Tạo đối tượng sản phẩm

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cartData.items.find(item => item.id === id);
        if (existingProduct) {
          alert("Sản phẩm đã có trong giỏ hàng!");
        } else {
          // Cập nhật giỏ hàng với sản phẩm mới
          await updateDoc(cartRef, {
            items: arrayUnion(product) // Thêm sản phẩm vào mảng giỏ hàng
          });
          alert("Thêm vào giỏ hàng thành công!");
        }
      } else {
        // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
        const newCart = { items: [{ id, name, price, imageUrl, quantity: 1 }] };
        await setDoc(cartRef, newCart);
        alert("Thêm vào giỏ hàng thành công!");
      }
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    }
  } else {
    alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
  }
}

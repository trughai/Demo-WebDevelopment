import { db, auth } from "./firebase-config.js";
import { collection, getDocs, setDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      productList.innerHTML = "<p>Không có sản phẩm nào.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.name}" />
        <h3>${data.name}</h3>
        <p>${Number(data.price).toLocaleString()}đ</p>
        <button data-id="${doc.id}" class="add-to-cart-btn">Thêm vào giỏ</button>
      `;
      productList.appendChild(card);
    });

    // Gán sự kiện cho nút "Thêm vào giỏ"
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const productId = event.target.getAttribute("data-id");
        const productSnapshot = await getDocs(query(collection(db, "products"), where("id", "==", productId)));
        const productData = productSnapshot.docs[0].data();
        const user = auth.currentUser;

        if (!user) {
          alert("Bạn cần đăng nhập trước khi thêm vào giỏ.");
          return;
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hay chưa
        const cartRef = query(collection(db, "carts"), where("productId", "==", productId), where("userId", "==", user.uid));
        const cartSnapshot = await getDocs(cartRef);
        
        if (cartSnapshot.empty) {
          // Nếu chưa có, thêm mới vào giỏ hàng
          await setDoc(doc(db, "carts", `${user.uid}_${productId}`), {
            userId: user.uid,
            productId,
            name: productData.name,
            price: productData.price,
            quantity: 1,
            imageUrl: productData.imageUrl,
          });
        } else {
          // Nếu có rồi, cập nhật số lượng
          const cartDoc = cartSnapshot.docs[0];
          await setDoc(cartDoc.ref, {
            quantity: cartDoc.data().quantity + 1
          }, { merge: true });
        }

        alert("Sản phẩm đã được thêm vào giỏ hàng!");
      });
    });
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    productList.innerHTML = "<p>Lỗi tải sản phẩm.</p>";
  }
});

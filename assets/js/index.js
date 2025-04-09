import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    const buyNowBtn = card.querySelector(".buy-now-btn");
    const productId = card.getAttribute("data-id");
    const productName = card.querySelector("h3").textContent;
    const productPrice = card.querySelector(".price").textContent;
    const productImage = card.querySelector("img").src;

    addToCartBtn.addEventListener("click", async () => {
      const user = auth.currentUser;
      if (user) {
        const cartRef = doc(db, "carts", user.uid + "_" + productId);
        await setDoc(cartRef, {
          userId: user.uid,
          productId,
          productName,
          productPrice,
          productImage,
        });
        alert(`Đã thêm ${productName} vào giỏ hàng.`);
      } else {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      }
    });

    buyNowBtn.addEventListener("click", () => {
      alert(`Bạn vừa mua ngay sản phẩm: ${productName}`);
    });
  });
});

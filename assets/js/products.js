import { auth, db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Thêm sản phẩm vào giỏ hàng
async function addToCart(productId) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        cart: arrayUnion(productId) // Thêm ID sản phẩm vào giỏ hàng
      });
      alert("Product added to your cart!");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      alert("There was an error adding the product to the cart.");
    }
  } else {
    alert("Please log in to add products to your cart.");
  }
}

// Lấy danh sách sản phẩm và hiển thị trên trang
async function displayProducts() {
  const productsCollection = collection(db, "products");
  const productList = document.getElementById("product-list-ul");

  try {
    const querySnapshot = await getDocs(productsCollection);
    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const productId = docSnap.id;

      const productElement = document.createElement("li");
      productElement.classList.add("product");

      productElement.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
        <h3>${product.name}</h3>
        <p>Price: ${Number(product.price).toLocaleString("vi-VN")} ₫</p>
      `;

      // Create the button separately
      const button = document.createElement("button");
      button.textContent = "Add to Cart";
      button.addEventListener("click", () => addToCart(productId));

      productElement.appendChild(button);
      productList.appendChild(productElement);
    });
  } catch (err) {
    console.error("Error getting products:", err);
  }
}


// Gọi hàm khi trang được tải
window.onload = displayProducts;

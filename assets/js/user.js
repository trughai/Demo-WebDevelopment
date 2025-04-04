import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Fetch Products
const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear the list before displaying

  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");

    const product = doc.data();
    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.style.width = "100px";
    productImage.style.height = "100px";

    const productName = document.createElement("p");
    productName.textContent = `${product.name} - $${product.price}`;

    li.appendChild(productImage);
    li.appendChild(productName);
    productList.appendChild(li);
  });
};

fetchProducts();

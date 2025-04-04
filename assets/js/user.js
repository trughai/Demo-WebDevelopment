import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const productTable = document.getElementById("product-list");

  querySnapshot.forEach((doc) => {
    const product = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td><button onclick="addToCart('${doc.id}')">Add to Cart</button></td>
    `;
    productTable.appendChild(row);
  });
}

function addToCart(productId) {
  // Đặt hàng trong Firestore
}

loadProducts();

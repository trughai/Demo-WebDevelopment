import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// Firebase initialization
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

// DOM elements
const addProductBtn = document.getElementById("add-product-btn");
const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productImageInput = document.getElementById("product-image");

// Handle Add Product button click
addProductBtn.addEventListener("click", async () => {
  const productName = productNameInput.value.trim();
  const productPrice = productPriceInput.value.trim();
  const productImage = productImageInput.files[0];

  // Kiểm tra xem tất cả các trường có dữ liệu chưa
  if (!productName || !productPrice || !productImage) {
    alert("Please fill in all fields and upload an image.");
    return;
  }

  try {
    // Tải ảnh lên Firebase Storage
    const storageRef = ref(storage, `products/${productImage.name}`);
    const uploadResult = await uploadBytes(storageRef, productImage);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    // Lưu thông tin sản phẩm vào Firestore
    const productRef = await addDoc(collection(db, "products"), {
      name: productName,
      price: productPrice,
      imageUrl: imageUrl,
      createdAt: new Date(),
    });

    alert("Product added successfully!");
    
    // Reset form fields
    productNameInput.value = "";
    productPriceInput.value = "";
    productImageInput.value = "";
    
  } catch (error) {
    console.error("Error adding product: ", error);
    alert("Failed to add product. Please try again.");
  }
});

// Handle Logout button click
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error signing out: ", error);
    alert("Failed to log out. Please try again.");
  }
});

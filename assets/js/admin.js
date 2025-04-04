import { auth, db, storage } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Fetch users from Firestore
const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const userList = document.getElementById("user-list-ul");
  userList.innerHTML = ""; // Clear the list before displaying

  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().email} - Role: ${doc.data().role}`;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      await updateDoc(doc.ref, { role: "deleted" });
      fetchUsers();
    });
    li.appendChild(deleteBtn);
    userList.appendChild(li);
  });
};

fetchUsers();

// Add Product with Image Upload
document.getElementById("add-product-btn").addEventListener("click", async () => {
  const productName = document.getElementById("product-name").value;
  const productPrice = document.getElementById("product-price").value;
  const productImage = document.getElementById("product-image").files[0];

  if (productImage) {
    // Create a reference to the Firebase Storage location
    const imageRef = ref(storage, "products/" + productImage.name);

    try {
      // Upload the image to Firebase Storage
      await uploadBytes(imageRef, productImage);

      // Get the download URL of the image
      const imageURL = await getDownloadURL(imageRef);

      // Save the product to Firestore
      await addDoc(collection(db, "products"), {
        name: productName,
        price: parseFloat(productPrice),
        image: imageURL
      });

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  } else {
    alert("Please select an image for the product.");
  }
});

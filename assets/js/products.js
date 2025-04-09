import {
    getAuth,
    onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
  import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    setDoc,
    getDoc
  } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
  
  // Khởi tạo Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  const productGrid = document.getElementById("product-grid");
  
  // Theo dõi auth
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
  
      // Lắng nghe sản phẩm
      onSnapshot(collection(db, "products"), (snapshot) => {
        if (!snapshot.empty) {
          productGrid.innerHTML = "";
        }
  
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const docId = docSnap.id;
  
          const productDiv = document.createElement("div");
          productDiv.classList.add("product-card");
          productDiv.innerHTML = `
            <img src="${data.imageUrl}" alt="${data.name}">
            <h3>${data.name}</h3>
            <p class="price">Giá: ${data.price}₫</p>
            <button class="add-to-cart">Thêm vào giỏ hàng</button>
          `;
  
          productDiv.querySelector(".add-to-cart").addEventListener("click", async () => {
            const cartRef = doc(db, "carts", userId, "items", docId);
            const docSnap = await getDoc(cartRef);
  
            if (docSnap.exists()) {
              // Nếu sản phẩm đã có trong giỏ hàng → tăng số lượng
              const currentQty = docSnap.data().quantity || 1;
              await setDoc(cartRef, {
                ...docSnap.data(),
                quantity: currentQty + 1
              });
            } else {
              // Thêm mới sản phẩm vào giỏ
              await setDoc(cartRef, {
                name: data.name,
                price: data.price,
                imageUrl: data.imageUrl,
                quantity: 1
              });
            }
  
            alert(`Đã thêm ${data.name} vào giỏ hàng!`);
          });
  
          productGrid.appendChild(productDiv);
        });
      });
  
    } else {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      window.location.href = "login.html";
    }
  });
  
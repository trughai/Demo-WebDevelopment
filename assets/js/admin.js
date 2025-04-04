import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const userTable = document.getElementById("user-table");
const addUserBtn = document.getElementById("add-user-btn");
const logoutBtn = document.getElementById("logout-btn");

const message = document.getElementById("message");

const checkAdmin = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.role !== "admin") {
        alert("You do not have permission to access this page.");
        window.location.href = "index.html";
      }
    }
  }
};

const loadUsers = async () => {
  const usersRef = collection(db, "users");
  const usersSnap = await getDocs(usersRef);
  usersSnap.forEach((doc) => {
    const userData = doc.data();
    const row = document.createElement("tr");
    row.id = doc.id;
    row.innerHTML = `
      <td>${userData.username}</td>
      <td>${userData.role}</td>
      <td><button onclick="deleteUser('${doc.id}')">Delete</button></td>
    `;
    userTable.appendChild(row);
  });
};

addUserBtn.addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  if (username && role) {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        username: username,
        role: role,
        email: username + "@example.com"
      });
      message.textContent = "User added successfully!";
      loadUsers();
    } catch (error) {
      message.textContent = "Error adding user: " + error.message;
    }
  } else {
    message.textContent = "Please fill in both fields!";
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error: ", error.message);
  }
});

const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    document.getElementById(userId).remove();
  } catch (error) {
    console.error("Error deleting user: ", error.message);
  }
};

checkAdmin();
loadUsers();

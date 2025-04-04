import { auth, db } from "./firebase-config.js";
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getDocs,
  updateDoc,
  doc,
  collection,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    alert("You are not authorized.");
    window.location.href = "index.html";
    return;
  }

  loadUsers();
});

async function loadUsers() {
  const userTable = document.getElementById("user-table");
  const querySnapshot = await getDocs(collection(db, "users"));
  userTable.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.uid}</td>
      <td>${data.email}</td>
      <td>${data.role}</td>
    `;
    userTable.appendChild(row);
  });
}

document.getElementById("update-role-btn").addEventListener("click", async () => {
  const uid = document.getElementById("edit-uid").value;
  const role = document.getElementById("edit-role").value;
  if (uid && role) {
    await updateDoc(doc(db, "users", uid), { role });
    alert("Role updated!");
    loadUsers();
  }
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

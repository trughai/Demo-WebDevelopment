// assets/js/user.js
import { auth, db } from "./firebase-config.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const taskList = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loadTasks(user.uid);
  } else {
    window.location.href = "index.html";
  }
});

async function loadTasks(uid) {
  taskList.innerHTML = "";
  const q = query(collection(db, "tasks"), where("assignedTo", "==", uid));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const li = document.createElement("li");
    li.textContent = task.title;
    if (task.completed) li.classList.add("completed");

    const btn = document.createElement("button");
    btn.textContent = task.completed ? "Undo" : "Mark as done";
    btn.addEventListener("click", async () => {
      await updateDoc(doc(db, "tasks", docSnap.id), {
        completed: !task.completed,
      });
      loadTasks(uid); // reload list
    });

    li.appendChild(btn);
    taskList.appendChild(li);
  });
}

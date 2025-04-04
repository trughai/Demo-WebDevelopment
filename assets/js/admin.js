import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { addDoc, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.getElementById("add-task-btn").addEventListener("click", async () => {
  const title = document.getElementById("task-title").value;
  const assignedTo = document.getElementById("assigned-to").value;

  try {
    await addDoc(collection(db, "tasks"), {
      title,
      assignedTo,
      completed: false
    });
    alert("Task added");
    location.reload();
  } catch (error) {
    alert("Failed to add task: " + error.message);
  }
});

const taskList = document.getElementById("task-list");
(async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  querySnapshot.forEach(docSnap => {
    const task = docSnap.data();
    const li = document.createElement("li");
    li.textContent = `${task.title} - ${task.assignedTo} - ${task.completed ? "✅" : "❌"}`;
    taskList.appendChild(li);
  });
})();
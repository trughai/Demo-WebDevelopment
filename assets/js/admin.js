// admin.js
import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html"; // Quay lại trang đăng nhập
});

// Thêm công việc mới
document.getElementById("add-task-btn").addEventListener("click", async () => {
  const taskName = document.getElementById("task-name").value;

  if (taskName) {
    await setDoc(doc(db, "tasks", taskName), {
      name: taskName,
      completed: false,
      assignedTo: null // Chưa giao cho ai
    });

    alert("Task added successfully!");
    location.reload(); // Tải lại trang sau khi thêm công việc
  } else {
    alert("Please provide a task name!");
  }
});

// Hiển thị công việc
async function getTasks() {
  const tasksCollection = collection(db, "tasks");
  const taskSnapshot = await getDocs(tasksCollection);
  const taskList = document.getElementById("task-list");

  taskSnapshot.forEach(doc => {
    const task = doc.data();
    const taskItem = document.createElement("li");
    taskItem.textContent = task.name;
    taskItem.style.textDecoration = task.completed ? "line-through" : "none";

    taskList.appendChild(taskItem);
  });
}

getTasks();

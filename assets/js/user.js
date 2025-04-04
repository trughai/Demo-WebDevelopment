// user.js
import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, updateDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html"; // Quay lại trang đăng nhập
});

// Hiển thị công việc cho user và cho phép đánh dấu hoàn thành
async function getUserTasks() {
  const user = auth.currentUser;
  const tasksCollection = collection(db, "tasks");
  const taskSnapshot = await getDocs(tasksCollection);
  const taskList = document.getElementById("task-list");

  taskSnapshot.forEach(doc => {
    const task = doc.data();

    // Chỉ cho phép user đánh dấu công việc của mình
    if (!task.assignedTo || task.assignedTo === user.uid) {
      const taskItem = document.createElement("li");
      taskItem.textContent = task.name;
      taskItem.style.textDecoration = task.completed ? "line-through" : "none";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      // Cho phép người dùng đánh dấu công việc là hoàn thành
      checkbox.addEventListener("change", async () => {
        await updateDoc(doc(db, "tasks", task.name), {
          completed: checkbox.checked
        });
      });

      taskItem.appendChild(checkbox);
      taskList.appendChild(taskItem);
    }
  });
}

getUserTasks();

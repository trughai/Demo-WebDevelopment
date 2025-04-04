import { auth, db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("add-task-btn").addEventListener("click", async () => {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const assignedTo = document.getElementById("task-user").value;

  if (!title || !description || !assignedTo) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    await addDoc(collection(db, "tasks"), {
      title,
      description,
      assignedTo,
      completed: false,
    });
    alert("Đã thêm task thành công!");
  } catch (error) {
    alert("Failed to add task: " + error.message);
  }
});

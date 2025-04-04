// admin.js (admin có thể thêm công việc mới)
import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("add-task-btn").addEventListener("click", async () => {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const assignedTo = document.getElementById("task-user").value; // UserId từ dropdown
  const status = "pending"; // Mặc định là pending

  try {
    await addDoc(collection(db, "tasks"), {
      title: title,
      description: description,
      assignedTo: assignedTo, // UserId được gán
      status: status
    });

    alert("Task added successfully!");
  } catch (error) {
    console.error("Error adding task: ", error);
  }
});

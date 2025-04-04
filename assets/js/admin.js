import { db } from "./firebase-config.js";  // Đảm bảo bạn đã import db từ firebase-config.js
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Gán sự kiện cho nút "Add Task"
document.getElementById("add-task-btn").addEventListener("click", async () => {
  const taskName = document.getElementById("task-name").value;
  const taskDescription = document.getElementById("task-description").value;
  const message = document.getElementById("task-message");

  // Kiểm tra nếu các thông tin đã được nhập
  if (taskName && taskDescription) {
    try {
      // Thêm công việc vào Firestore
      await addDoc(collection(db, "tasks"), {
        name: taskName,
        description: taskDescription,
        completed: false,
        createdAt: new Date(),
      });
      
      message.textContent = "Task added successfully!";
      message.style.color = "green";
      // Xóa nội dung form sau khi thêm task
      document.getElementById("task-name").value = "";
      document.getElementById("task-description").value = "";
    } catch (error) {
      message.textContent = "Failed to add task: " + error.message;
      message.style.color = "red";
    }
  } else {
    message.textContent = "Please fill in both fields!";
    message.style.color = "red";
  }
});

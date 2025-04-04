import { auth, db } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Load danh sách người dùng khi trang admin load
async function loadUsers() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const usersList = document.getElementById("assigned-user");
  usersList.innerHTML = ""; // Clear previous options
  usersSnapshot.forEach((doc) => {
    const userOption = document.createElement("option");
    userOption.value = doc.id;
    userOption.textContent = doc.data().name;
    usersList.appendChild(userOption);
  });
}

// Thêm công việc mới
document.getElementById("add-task-btn").addEventListener("click", async () => {
  const taskTitle = document.getElementById("task-title").value;
  const taskDesc = document.getElementById("task-desc").value;
  const assignedUser = document.getElementById("assigned-user").value;

  if (taskTitle && taskDesc && assignedUser) {
    try {
      await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        description: taskDesc,
        assignedTo: assignedUser,
        status: "pending"
      });
      alert("Task added successfully!");
      loadTasks(); // Reload tasks after adding a new one
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task!");
    }
  } else {
    alert("Please fill all fields!");
  }
});

// Load danh sách công việc
async function loadTasks() {
  const tasksSnapshot = await getDocs(collection(db, "tasks"));
  const taskTable = document.getElementById("task-table");
  taskTable.innerHTML = ""; // Clear previous tasks

  tasksSnapshot.forEach((taskDoc) => {
    const taskData = taskDoc.data();
    const taskRow = document.createElement("tr");
    taskRow.innerHTML = `
      <td>${taskData.title}</td>
      <td>${taskData.description}</td>
      <td>${taskData.assignedTo}</td>
      <td>${taskData.status}</td>
      <td>
        <button onclick="updateTask('${taskDoc.id}')">Update</button>
        <button onclick="deleteTask('${taskDoc.id}')">Delete</button>
      </td>
    `;
    taskTable.appendChild(taskRow);
  });
}

// Cập nhật trạng thái công việc
async function updateTask(taskId) {
  const taskRef = doc(db, "tasks", taskId);
  try {
    await updateDoc(taskRef, { status: "done" });
    alert("Task updated successfully!");
    loadTasks(); // Reload tasks after update
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update task!");
  }
}

// Xóa công việc
async function deleteTask(taskId) {
  const taskRef = doc(db, "tasks", taskId);
  try {
    await deleteDoc(taskRef);
    alert("Task deleted successfully!");
    loadTasks(); // Reload tasks after delete
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task!");
  }
}

// Load tasks when the page loads
loadUsers();
loadTasks();

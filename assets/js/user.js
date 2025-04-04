import { auth, db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;
    const q = query(collection(db, "tasks"), where("assignedTo", "==", uid));
    const taskList = document.getElementById("task-list");

    onSnapshot(q, (snapshot) => {
      taskList.innerHTML = "";

      snapshot.forEach((docSnap) => {
        const task = docSnap.data();
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", async () => {
          const taskRef = doc(db, "tasks", docSnap.id);
          await updateDoc(taskRef, {
            completed: checkbox.checked,
          });
        });

        li.textContent = `${task.title} - ${task.description}`;
        li.prepend(checkbox);
        taskList.appendChild(li);
      });
    });
  } else {
    window.location.href = "login.html";
  }
});

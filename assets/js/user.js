import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

const user = auth.currentUser;
const taskList = document.getElementById("task-list");

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const querySnapshot = await getDocs(collection(db, "tasks"));
  querySnapshot.forEach(async (docSnap) => {
    const task = docSnap.data();
    if (task.assignedTo === user.uid) {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", async () => {
        await updateDoc(doc(db, "tasks", docSnap.id), {
          completed: checkbox.checked
        });
      });
      li.textContent = task.title + " ";
      li.appendChild(checkbox);
      taskList.appendChild(li);
    }
  });
});

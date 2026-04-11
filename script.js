const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", addTask);

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = taskText;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("task-buttons");

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.addEventListener("click", function () {
    span.classList.toggle("completed");
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", function () {
    li.remove();
  });

  buttonDiv.appendChild(doneBtn);
  buttonDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(buttonDiv);

  taskList.appendChild(li);

  taskInput.value = "";
}
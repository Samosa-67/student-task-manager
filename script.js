const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("task-buttons");

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.addEventListener("click", function () {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    buttonDiv.appendChild(doneBtn);
    buttonDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonDiv);

    taskList.appendChild(li);
  });
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  tasks.push({
    text: taskText,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
}

addTaskBtn.addEventListener("click", addTask);

renderTasks();

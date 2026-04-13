const taskTitleInput = document.getElementById("taskTitle");
const taskDateInput = document.getElementById("taskDate");
const taskTimeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasksContainer = document.getElementById("pendingTasks");
const dueTasksContainer = document.getElementById("dueTasks");
const completedTasksContainer = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const dueCount = document.getElementById("dueCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function createTaskId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function getDueDateTime(task) {
  if (!task.date || !task.time) {
    return null;
  }

  return new Date(`${task.date}T${task.time}`);
}

function getTaskStatus(task) {
  if (task.completed) {
    return "completed";
  }

  const dueDateTime = getDueDateTime(task);

  if (!dueDateTime || Number.isNaN(dueDateTime.getTime())) {
    return "pending";
  }

  const now = new Date();
  const diffMs = dueDateTime - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) {
    return "overdue";
  }

  if (diffHours <= 24) {
    return "due";
  }

  return "pending";
}

function formatDueText(task) {
  if (!task.date || !task.time) {
    return "No due date";
  }

  return `Due: ${task.date} at ${task.time}`;
}

function clearColumns() {
  pendingTasksContainer.innerHTML = "";
  dueTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.classList.add("task-card");

  const status = getTaskStatus(task);

  if (status === "due") {
    card.classList.add("due-soon");
  } else if (status === "overdue") {
    card.classList.add("overdue");
  } else if (status === "completed") {
    card.classList.add("completed");
  }

  const title = document.createElement("h3");
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.classList.add("task-meta");
  meta.textContent = formatDueText(task);

  const statusBadge = document.createElement("div");
  statusBadge.classList.add("task-status");

  if (status === "pending") {
    statusBadge.classList.add("status-pending");
    statusBadge.textContent = "Pending";
  } else if (status === "due") {
    statusBadge.classList.add("status-due");
    statusBadge.textContent = "Due Soon";
  } else if (status === "overdue") {
    statusBadge.classList.add("status-overdue");
    statusBadge.textContent = "Overdue";
  } else {
    statusBadge.classList.add("status-completed");
    statusBadge.textContent = "Completed";
  }

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  if (!task.completed) {
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.classList.add("complete-btn");
    completeBtn.addEventListener("click", () => {
      task.completed = true;
      saveTasks();
      renderTasks();
    });
    actions.appendChild(completeBtn);
  } else {
    const undoBtn = document.createElement("button");
    undoBtn.textContent = "Undo";
    undoBtn.classList.add("undo-btn");
    undoBtn.addEventListener("click", () => {
      task.completed = false;
      saveTasks();
      renderTasks();
    });
    actions.appendChild(undoBtn);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((item) => item.id !== task.id);
    saveTasks();
    renderTasks();
  });

  actions.appendChild(deleteBtn);

  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(statusBadge);
  card.appendChild(actions);

  return card;
}

function renderEmptyMessage(container, message) {
  const p = document.createElement("p");
  p.classList.add("empty-text");
  p.textContent = message;
  container.appendChild(p);
}

function updateCounts(pending, due, completed) {
  pendingCount.textContent = pending;
  dueCount.textContent = due;
  completedCount.textContent = completed;
}

function renderTasks() {
  clearColumns();

  let pending = 0;
  let due = 0;
  let completed = 0;

  const sortedTasks = [...tasks].sort((a, b) => {
    const aDate = getDueDateTime(a);
    const bDate = getDueDateTime(b);

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;

    return aDate - bDate;
  });

  sortedTasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    const status = getTaskStatus(task);

    if (status === "completed") {
      completedTasksContainer.appendChild(taskCard);
      completed++;
    } else if (status === "due" || status === "overdue") {
      dueTasksContainer.appendChild(taskCard);
      due++;
    } else {
      pendingTasksContainer.appendChild(taskCard);
      pending++;
    }
  });

  if (pending === 0) {
    renderEmptyMessage(pendingTasksContainer, "No pending tasks.");
  }

  if (due === 0) {
    renderEmptyMessage(dueTasksContainer, "No due soon or overdue tasks.");
  }

  if (completed === 0) {
    renderEmptyMessage(completedTasksContainer, "No completed tasks yet.");
  }

  updateCounts(pending, due, completed);
}

function addTask() {
  const title = taskTitleInput.value.trim();
  const date = taskDateInput.value;
  const time = taskTimeInput.value;

  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  if (!date) {
    alert("Please select a due date.");
    return;
  }

  if (!time) {
    alert("Please select a due time.");
    return;
  }

  const newTask = {
    id: createTaskId(),
    title,
    date,
    time,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskTitleInput.value = "";
  taskDateInput.value = "";
  taskTimeInput.value = "";
}

addTaskBtn.addEventListener("click", addTask);

renderTasks();

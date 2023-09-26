class TaskHandler {
  constructor(storageKey, viewPortContainer, taskTemplate) {
    this.tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
    this.container = viewPortContainer;
    this.storageKey = storageKey;
    this.template = taskTemplate;
    this.sortMethod = "default";
    this.lastTaskId =
      this.tasks.length > 0 ? this.tasks[this.tasks.length - 1]?.id : -1;
    this.updateContainer();
  }

  // SORTING
  setSortMethod(method = "default") {
    this.sortMethod = method;
    this.updateContainer();
  }
  sort() {
    const taskCopy = JSON.parse(JSON.stringify(this.tasks));
    if (this.sortMethod === "completed first") {
      return taskCopy.sort((a, b) => {
        if (a.status === "completed" && b.status === "uncompleted") {
          return -1;
        } else if (a.status === "uncompleted" && b.status === "completed") {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (this.sortMethod === "uncompleted first") {
      return taskCopy.sort((a, b) => {
        if (a.status === "uncompleted" && b.status === "completed") {
          return -1;
        } else if (a.status === "completed" && b.status === "uncompleted") {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (this.sortMethod === "newest first") {
      return taskCopy.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    } else if (this.sortMethod === "oldest first") {
      return taskCopy.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
    } else if (this.sortMethod === "default") {
      return taskCopy;
    } else {
      throw new Error("Invalid order: " + this.sortMethod);
    }
  }

  // Search

  search(keyword = "") {
    keyword = keyword.trim();
    keyword = keyword.replace(/\s\s+/g, " ");
    keyword = keyword.toLowerCase();
    const tasks = this.container.querySelectorAll(".task");
    tasks.forEach((elem) => {
      let title = elem.querySelector(".task-title").innerText.toLowerCase();
      let desc = elem.querySelector(".task-desc").innerText.toLowerCase();
      if (title.includes(keyword) || desc.includes(keyword)) {
        elem.classList.remove("hide");
      } else {
        elem.classList.add("hide");
      }
    });
  }

  // CRUD OF TASKS
  createTask({ title, description, status, date }) {
    const id = ++this.lastTaskId;
    this.tasks.push({ id, title, description, status, date });
    this.updateLocalStorage();
    this.updateContainer();
  }
  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.updateContainer();
    this.updateLocalStorage();
  }
  editTask(taskId, data) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    const newTask = {
      ...this.tasks[taskIndex],
      ...data,
    };
    this.tasks[taskIndex] = newTask;
    this.updateLocalStorage();
    this.updateContainer();
  }
  getTask(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    return this.tasks[taskIndex];
  }
  updateTaskStatus(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    const oldTask = this.tasks[taskIndex];
    const newTask = {
      ...oldTask,
      status: oldTask.status === "completed" ? "uncompleted" : "completed",
    };
    this.tasks[taskIndex] = newTask;
    this.updateLocalStorage();
    return newTask;
  }

  // RENDRING TASKS INTO VIEWPORT/HTML
  updateContainer() {
    const sortedTasks = this.sort();
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    sortedTasks.forEach((task) => {
      const taskTemplete = this.template.content.cloneNode(true),
        title = taskTemplete.querySelector(".task-title"),
        desc = taskTemplete.querySelector(".task-desc"),
        taskStatus = taskTemplete.querySelector(".task-status"),
        timeline = taskTemplete.querySelector(".timeline-date"),
        deleteBtn = taskTemplete.querySelector(".deleteTask"),
        editTaskBtn = taskTemplete.querySelector(".editTaskBtn");
      taskTemplete.querySelector(".task").setAttribute("data-task-id", task.id);
      title.innerText = task.title;
      desc.innerText = task.description;
      taskStatus.innerText = task.status;
      taskStatus.classList.add(task.status);
      taskStatus.setAttribute("onclick", `updateStatus(${task.id})`);
      timeline.innerText = new Date(task.date).toLocaleDateString();
      deleteBtn.setAttribute("onclick", `deleteTask(${task.id})`);
      editTaskBtn.setAttribute("onclick", `editTask(${task.id})`);
      this.container.appendChild(taskTemplete);
    });
  }
  updateLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }
}

// Elements
const openModalBtns = document.querySelectorAll("[data-open-modal]");
const closeModalBtns = document.querySelectorAll("[data-close-modal]");
const taskContainer = document.querySelector("[data-task-container]");
const viewFilterBtns = document.querySelectorAll(".view-filter .btn");
const template = document.querySelector("[data-task-template]");
const forms = document.querySelectorAll("[data-action-type]");
const sortBtn = document.querySelector("[data-sort-by]");
const searchTaskInput = document.querySelector("[data-search-task]");
const sidebar = document.getElementById("sidebar");
const navExpandBtn = document.getElementById("nav-expand-btn");
const date = new Date();

const taskHandler = new TaskHandler("tasks", taskContainer, template);

// Event Listener for view
navExpandBtn.addEventListener("click", () => {
  sidebar.classList.add("expand-nav");
});
sortBtn.addEventListener("change", (e) => {
  taskHandler.setSortMethod(sortBtn.value);
});
searchTaskInput.addEventListener("keyup", (e) => {
  taskHandler.search(searchTaskInput.value);
});
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let title = form.querySelector("#title").value;
    let description = form.querySelector("#description").value;
    let date = new Date(form.querySelector("#date").value);
    let status = form.querySelector("#completed").checked
      ? "completed"
      : "uncompleted";
    if (form.dataset.actionType === "add") {
      taskHandler.createTask({ title, description, status, date });
    } else if (form.dataset.actionType === "edit") {
      taskHandler.editTask(parseInt(form.querySelector("#taskId").value), {
        title,
        description,
        status,
        date,
      });
    }
    form.reset();
    form.closest("[data-madal]").classList.remove("show");
  });
});
viewFilterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    taskContainer.removeAttribute("data-view-type");
    taskContainer.setAttribute("data-view-type", btn.getAttribute("data-view"));
    viewFilterBtns.forEach((elem) => elem.classList.remove("active"));
    btn.classList.add("active");
  });
});
openModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetModal = document.querySelector(
      `[data-madal='${btn.getAttribute("data-open-modal")}']`
    );
    targetModal.classList.add("show");
  });
});
closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetModal = document.querySelector(
      `[data-madal='${btn.getAttribute("data-close-modal")}']`
    );
    targetModal.classList.remove("show");
  });
});
window.addEventListener("click", (e) => {
  document.querySelectorAll("[data-madal]").forEach((modal) => {
    if (e.target == modal) {
      modal.classList.remove("show");
    }
  });
  if (e.target == sidebar) {
    sidebar.classList.remove("expand-nav");
  }
});

function deleteTask(id) {
  const confirmation = confirm("Are you sure you want to delete item?");
  if (confirmation) taskHandler.deleteTask(id);
}

function editTask(taskId) {
  const modal = document.querySelector(`[data-madal="edit-task"]`);
  const editForm = modal.querySelector("form");
  modal.classList.add("show");
  const taskData = taskHandler.getTask(taskId);
  editForm.dataset.actionType === "edit";
  editForm.querySelector("#title").value = taskData.title;
  editForm.querySelector("#description").value = taskData.description;
  editForm.querySelector("#date").value = new Date(taskData.date)
    .toISOString()
    .split("T")[0];
  editForm.querySelector("#taskId").value = taskData.id;
  editForm.querySelector("#completed").checked =
    taskData.status == "completed" ? true : false;
}

function updateStatus(taskId) {
  const updated = taskHandler.updateTaskStatus(taskId);
  const elem = document
    .querySelector(`[data-task-id='${taskId}']`)
    .querySelector(".task-status");
  elem.classList.remove("completed");
  elem.classList.remove("uncompleted");
  elem.classList.add(updated.status);
  elem.innerText = updated.status;
}
document.querySelector("[data-current-date]").innerText = date.toDateString();

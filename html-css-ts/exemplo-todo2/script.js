// Seleciona os elementos do DOM
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("list");

// Função para salvar tarefas no LocalStorage
const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Função para carregar tarefas do LocalStorage
const loadTasks = () => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
};

// Cria um elemento de tarefa
const createTaskElement = (title, description) => {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");

  const taskContent = document.createElement("div");
  taskContent.classList.add("card");

  const taskDetails = document.createElement("div");
  taskDetails.innerHTML = `
    <h3 class="title">${title}</h3>
    <p class="description">${description}</p>
  `;

  const taskActions = document.createElement("div");
  taskActions.classList.add("actions");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Excluir";
  deleteButton.classList.add("delete-button");

  deleteButton.addEventListener("click", () => {
    const tasks = loadTasks().filter(
      (task) => task.title !== title || task.description !== description
    );
    saveTasks(tasks);
    taskItem.remove();
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Editar";
  editButton.classList.add("edit-button");

  editButton.addEventListener("click", () => {
    const newTitle = prompt("Editar título:", title);
    const newDescription = prompt("Editar descrição:", description);

    if (newTitle && newDescription) {
      const tasks = loadTasks();
      const taskIndex = tasks.findIndex(
        (task) => task.title === title && task.description === description
      );

      if (taskIndex !== -1) {
        tasks[taskIndex].title = newTitle.trim();
        tasks[taskIndex].description = newDescription.trim();
        saveTasks(tasks);
      }

      title = newTitle.trim();
      description = newDescription.trim();
      taskDetails.innerHTML = `
        <h3 class="title">${title}</h3>
        <p class="description">${description}</p>
      `;
    } else {
      alert("Edição cancelada ou campos inválidos!");
    }
  });

  taskContent.appendChild(taskDetails);
  taskActions.appendChild(deleteButton);
  taskActions.appendChild(editButton);
  taskContent.appendChild(taskActions);

  taskItem.appendChild(taskContent);

  return taskItem;
};

// Renderiza todas as tarefas
const renderTasks = () => {
  const tasks = loadTasks();
  taskList.innerHTML = ""; // Limpa a lista para evitar duplicação

  tasks.forEach(({ title, description }) => {
    const taskElement = createTaskElement(title, description);
    taskList.appendChild(taskElement);
  });
};

// Evento de envio do formulário
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskForm.title.value.trim();
  const description = taskForm.description.value.trim();

  if (title && description) {
    const tasks = loadTasks();
    tasks.push({ title, description });
    saveTasks(tasks);

    const taskElement = createTaskElement(title, description);
    taskList.appendChild(taskElement);

    taskForm.reset();
  } else {
    alert("Por favor, preencha todos os campos!");
  }
});

// Carrega e renderiza as tarefas ao carregar a página
document.addEventListener("DOMContentLoaded", renderTasks);

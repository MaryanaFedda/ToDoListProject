document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("todo-input");
  const addButton = document.querySelector(".add-button");
  const todoList = document.querySelector(".todo-list-container");
  const allButton = document.querySelector(".action-button-all");
  const doneButton = document.querySelector(".action-button-done");
  const todoButton = document.querySelector(".action-button-todo");
  const deleteDoneButton = document.getElementById("delete-done");
  const deleteAllButton = document.getElementById("delete-all");

  // Load tasks from local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskFromStorage(task));

  addButton.addEventListener("click", addTask);
  allButton.addEventListener("click", filterTasks);
  doneButton.addEventListener("click", filterTasks);
  todoButton.addEventListener("click", filterTasks);
  deleteDoneButton.addEventListener("click", deleteDoneTasks);
  deleteAllButton.addEventListener("click", deleteAllTasks);
 
  // Close modal when clicking outside of delete popup
  window.addEventListener("click", function(event) {
    const modal = document.getElementById("deleteTaskModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

   // Close modal when clicking outside of update popup 
window.addEventListener("click", function(event) {
    const editModal = document.getElementById("editTaskModal");
    if (event.target === editModal) {
        editModal.style.display = "none";
    }
});


   //when click enter add the task
  todoInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
          event.preventDefault();
          addTask();
      }
  });

  // Function to add a task
  function addTask() {
      const taskText = todoInput.value.trim();
      if (taskText === "") {
          showWarningModal("Please enter a task.");
          return;
      }
      if (/[0-9#%&]/.test(taskText)) {
          showWarningModal("Task must not contain numbers or special characters (#, %, &).");
          return;
      }

      const task = {
          text: taskText,
          completed: false
      };

      tasks.push(task);
      saveTasksToLocalStorage();

      addTaskFromStorage(task);
      todoInput.value = "";
  }
  // Function to add a task from storage
  function addTaskFromStorage(task) {
      const toDoListSection = document.querySelector(".ToDoList");
      const alternative = document.querySelector(".alternative");
      toDoListSection.style.display = "block";
      alternative.style.display = "none";

      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");
      taskItem.innerHTML = `
          <span>${task.text}</span>
          <div>
              <i class="fa-regular fa-square"></i>
              <i class="fas fa-pen" style="color: yellow;"></i>
              <i class="fas fa-trash" style="color: red;"></i>
          </div>
      `;

      const taskIcons = taskItem.querySelectorAll(".fa-regular");
      taskIcons.forEach(icon => {
          icon.addEventListener("click", toggleTask);
      });

      todoList.appendChild(taskItem);

      const taskPen = taskItem.querySelector(".fa-pen");
      taskPen.addEventListener("click", editTask);

      const taskTrash = taskItem.querySelector(".fa-trash");
      taskTrash.addEventListener("click", deleteTask);

      if (task.completed) {
          toggleTask({ target: taskItem.querySelector(".fa-regular") });
      }
  }
  
  // Function to toggle task completion
  function toggleTask(event) {
      const squareIcon = event.target;
      squareIcon.classList.toggle("fa-regular");
      squareIcon.classList.toggle("fa-square");
      squareIcon.classList.toggle("fa-solid");
      squareIcon.classList.toggle("fa-check-square");
      squareIcon.style.color = squareIcon.classList.contains("fa-check-square") ? "green" : "black";

      const taskItem = squareIcon.parentElement.parentElement;
      const taskText = taskItem.querySelector("span");

      const isCompleted = taskItem.classList.toggle("completed");
      taskText.style.textDecoration = isCompleted ? "line-through": "none";

      const task = tasks.find(t => t.text === taskText.textContent);
      task.completed = isCompleted;
      saveTasksToLocalStorage();
  }
  
  // Function to edit a task
  function editTask(event) {
    const taskItem = event.target.parentElement.parentElement;
    const taskText = taskItem.querySelector("span").textContent;

    // Display the modal
    const modal = document.getElementById("editTaskModal");
    modal.style.display = "block";

    // Populate input field with current task text
    document.getElementById("newTaskText").value = taskText;

    // Update task text when clicking update button
    document.getElementById("updateTaskBtn").onclick = function () {
        const newTaskText = document.getElementById("newTaskText").value.trim();
        if (newTaskText === "") {
            showWarningModal("Please enter a task.");
            return;
        }
        if (/[0-9#%&]/.test(newTaskText)) {
            showWarningModal("Task must not contain numbers or special characters (#, %, &).");
            return;
        }

        if (newTaskText !== "") {
            // Update the task text in the task item
            taskItem.querySelector("span").textContent = newTaskText;

            // Update the task text in the tasks array
            const task = tasks.find(t => t.text === taskText);
            task.text = newTaskText;

            // Save tasks to local storage
            saveTasksToLocalStorage();
        }

        // Close the modal
        modal.style.display = "none";
    }

    // Close the modal when clicking the close button
    const closeBtn = document.getElementsByClassName("close")[0];
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }
}
  
// Function to delete a task
  function deleteTask(event) {
      const taskItem = event.target.parentElement.parentElement;

      // Display the modal
      const modal = document.getElementById("deleteTaskModal");
      modal.style.display = "block";


      const closeIcon = document.querySelector("#deleteTaskModal .close");
        closeIcon.addEventListener("click", function() {
        modal.style.display = "none";
    });

      // Update task item when clicking confirm delete button
      document.getElementById("confirmDeleteBtn").onclick = function () {
          taskItem.remove();

          tasks = tasks.filter(t => t.text !== taskItem.querySelector("span").textContent);
          saveTasksToLocalStorage();

          // Close the modal
          modal.style.display = "none";
          const alternative = document.querySelector(".alternative");
          const toDoListSection = document.querySelector(".ToDoList");
          if (document.querySelectorAll(".task-item").length === 0) {
              toDoListSection.style.display = "none";
              alternative.style.display = "flex";
          }
      }
      
      // Close the modal when clicking the cancel button
      document.getElementById("cancelDeleteBtn").onclick = function () {
          // Close the modal
          modal.style.display = "none";
      }
  }
  
  // Function to filter tasks
  function filterTasks(event) {
      const filter = event.target.textContent.toLowerCase();
      const tasks = document.querySelectorAll(".task-item");
      tasks.forEach(task => {
          switch (filter) {
              case "done":
                  task.style.display = task.classList.contains("completed") ? "flex" : "none";
                  break;
              case "todo":
                  task.style.display = task.classList.contains("completed") ? "none" : "flex";
                  break;
              default:
                  task.style.display = "flex";
          }
      });
  }
  
  // Function to delete completed tasks
  function deleteDoneTasks() {
      const doneTasks = document.querySelectorAll(".task-item.completed");
      if (doneTasks.length === 0) {
          showWarningModal("There are no completed tasks to delete.");
          return;
      }

      // Display the modal
      const modal = document.getElementById("deleteTaskModal");
      modal.style.display = "block";

      // Update task item when clicking confirm delete button
      document.getElementById("confirmDeleteBtn").onclick = function () {
          doneTasks.forEach(task => {
              task.remove();

              tasks = tasks.filter(t => t.text !== task.querySelector("span").textContent);
          });
          saveTasksToLocalStorage();

          // Close the modal
          modal.style.display = "none";
          const alternative = document.querySelector(".alternative");
          const toDoListSection = document.querySelector(".ToDoList");
          if (document.querySelectorAll(".task-item").length === 0) {
              toDoListSection.style.display = "none";
              alternative.style.display = "flex";
          }
      }

      // Close the modal when clicking the cancel button
      document.getElementById("cancelDeleteBtn").onclick = function () {
          // Close the modal
          modal.style.display = "none";
      }
  }
  
  // Function to delete all tasks
  function deleteAllTasks() {
      const allTasks = document.querySelectorAll(".task-item");
      if (allTasks.length === 0) {
          showWarningModal("There are no tasks to delete.");
          return;
      }

      // Display the modal
      const modal = document.getElementById("deleteTaskModal");
      modal.style.display = "block";

      // Update task item when clicking confirm delete button
      document.getElementById("confirmDeleteBtn").onclick = function () {
          allTasks.forEach(task => task.remove());

          tasks = [];
          saveTasksToLocalStorage();

          // Close the modal
          modal.style.display = "none";
          const alternative = document.querySelector(".alternative");
          const toDoListSection = document.querySelector(".ToDoList");
          if (document.querySelectorAll(".task-item").length === 0) {
              toDoListSection.style.display = "none";
              alternative.style.display = "flex";
          }
      }

      // Close the modal when clicking the cancel button
      document.getElementById("cancelDeleteBtn").onclick = function () {
          // Close the modal
          modal.style.display = "none";
      }
  }
  
  // Function to save tasks to local storage
  function saveTasksToLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to show warning modal
  function showWarningModal(message) {
    const warningMessage = document.getElementById("warningMessage");
    warningMessage.textContent = message;

    const modal = document.getElementById("warningModal");
    modal.style.display = "block";

    const closeButton = document.querySelector(".close4");
    closeButton.addEventListener("click", hideWarningModal);

    // Close modal when clicking outside of it
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            hideWarningModal();
        }
    });
}

  // Function to hide warning modal
  function hideWarningModal() {
      const modal = document.getElementById("warningModal");
      modal.style.display = "none";
  }


});
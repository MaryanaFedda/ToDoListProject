document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.getElementById("todo-input");
    const addButton = document.querySelector(".add-button");
    const todoList = document.querySelector(".todo-list-container");
    const allButton = document.querySelector(".action-button-all");
    const doneButton = document.querySelector(".action-button-done");
    const todoButton = document.querySelector(".action-button-todo");
    const deleteDoneButton = document.getElementById("delete-done");
    const deleteAllButton = document.getElementById("delete-all");
  
    addButton.addEventListener("click", addTask);
    allButton.addEventListener("click", filterTasks);
    doneButton.addEventListener("click", filterTasks);
    todoButton.addEventListener("click", filterTasks);
    deleteDoneButton.addEventListener("click", deleteDoneTasks);
    deleteAllButton.addEventListener("click", deleteAllTasks);
  
    todoInput.addEventListener("keydown", function(event) {
        // Check if the pressed key is the Enter key (key code 13)
        if (event.keyCode === 13) {
          // Prevent the default behavior of the Enter key (form submission)
          event.preventDefault();
          // Call the addTask function to add the task
          addTask();
        }
    });
  
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
        
        const toDoListSection = document.querySelector(".ToDoList");
        const alternative = document.querySelector(".alternative");
        toDoListSection.style.display = "block";
        alternative.style.display = "none";
  
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <div>
            <i class="fa-regular fa-square"></i>
                <i class="fas fa-pen" style="color: yellow;"></i>
                <i class="fas fa-trash" style="color: red;"></i>
            </div>
        `;
        
        const taskIcons = taskItem.querySelectorAll("i"); // Select all icons within the task item
        taskIcons.forEach(icon => {
            icon.addEventListener("click", toggleTask); // Attach toggleTask event listener to each icon
        });
    
        todoList.appendChild(taskItem);
        todoInput.value = "";
        
        const taskPen = taskItem.querySelector(".fa-pen");
        taskPen.addEventListener("click", editTask);
        
        const taskTrash = taskItem.querySelector(".fa-trash");
        taskTrash.addEventListener("click", deleteTask);
      }
    
      function toggleTask(event) {
        const squareIcon = event.target;
        //squareIcon.classList.toggle("fa-square"," fa-square");
        squareIcon.classList.remove("fa-regular", "fa-square");
              squareIcon.classList.add("fa-solid", "fa-check-square");
              squareIcon.style.color = "green";
       // squareIcon.classList.toggle("fa-regular","fa-square-check" );
        //squareIcon.style.color = squareIcon.classList.contains("fa-check-square") ? "green" : "black";
        
        const taskItem = squareIcon.parentElement.parentElement;
        const taskText = taskItem.querySelector("span");
    
        // Toggle the completed status of the task item
        taskItem.classList.toggle("completed");
    
        // Update the text decoration based on the completed status
        taskText.style.textDecoration = taskItem.classList.contains("completed") ? "line-through" : "none";
    }
  
    function editTask(event) {
        const taskItem = event.target.parentElement.parentElement;
        const taskText = taskItem.querySelector("span").textContent;
        
        // Display the modal
        const modal = document.getElementById("editTaskModal");
        modal.style.display = "block";
        
        // Populate input field with current task text
        document.getElementById("newTaskText").value = taskText;
      
      
        // Update task text when clicking update button
        document.getElementById("updateTaskBtn").onclick = function() {
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
            taskItem.querySelector("span").textContent = newTaskText;
          }
          // Close the modal
          modal.style.display = "none";
        }
      
        // Close the modal when clicking the close button
        const closeBtn = document.getElementsByClassName("close")[0];
        closeBtn.onclick = function() {
          modal.style.display = "none";
        }
      }
      
    
      function deleteTask(event) {
        const taskItem = event.target.parentElement.parentElement;
        
        // Display the modal
        const modal = document.getElementById("deleteTaskModal");
        modal.style.display = "block";
      
        // Update task item when clicking confirm delete button
        document.getElementById("confirmDeleteBtn").onclick = function() {
          taskItem.remove();
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
        document.getElementById("cancelDeleteBtn").onclick = function() {
          // Close the modal
          modal.style.display = "none";
        }
      }
      
  
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
            doneTasks.forEach(task => task.remove());
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
  
    function showWarningModal(message) {
        const warningMessage = document.getElementById("warningMessage");
        warningMessage.textContent = message;
  
        const modal = document.getElementById("warningModal");
        modal.style.display = "block";
  
        const closeButton = document.querySelector(".close4");
        closeButton.addEventListener("click", hideWarningModal);
    }
  
    function hideWarningModal() {
        const modal = document.getElementById("warningModal");
        modal.style.display = "none";
    }
  });
  
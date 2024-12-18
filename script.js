document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const taskDeadline = document.getElementById("task-deadline");
    const taskPriority = document.getElementById("task-priority");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskListUl = document.getElementById("task-list-ul");
    const filterAllBtn = document.getElementById("filter-all");
    const filterActiveBtn = document.getElementById("filter-active");
    const filterCompletedBtn = document.getElementById("filter-completed");
    const themeToggleBtn = document.getElementById("theme-toggle-btn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";
    let isDarkMode = localStorage.getItem("isDarkMode") === "true";

    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to update the task list display
    function renderTasks() {
        taskListUl.innerHTML = "";
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "active") return !task.completed;
            if (currentFilter === "completed") return task.completed;
            return true; // all
        });

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            if (task.completed) li.classList.add("completed");

            const taskText = document.createElement("span");
            taskText.textContent = task.text;
            const priorityClass = `priority-${task.priority}`;
            taskText.classList.add(priorityClass);

            const taskDetails = document.createElement("span");
            taskDetails.textContent = `Deadline: ${task.deadline}`;
            
            const markCompletedBtn = document.createElement("button");
            markCompletedBtn.textContent = task.completed ? "Undo" : "Complete";
            markCompletedBtn.addEventListener("click", () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks();
            });

            li.appendChild(taskText);
            li.appendChild(taskDetails);
            li.appendChild(markCompletedBtn);
            li.appendChild(deleteBtn);
            taskListUl.appendChild(li);
        });
    }

    // Add new task
    addTaskBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        const deadline = taskDeadline.value;
        const priority = taskPriority.value;

        if (text && deadline) {
            const newTask = {
                text,
                deadline,
                priority,
                completed: false,
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();

            taskInput.value = "";
            taskDeadline.value = "";
            taskPriority.value = "low";
        }
    });

    // Filter tasks
    filterAllBtn.addEventListener("click", () => {
        currentFilter = "all";
        renderTasks();
    });
    filterActiveBtn.addEventListener("click", () => {
        currentFilter = "active";
        renderTasks();
    });
    filterCompletedBtn.addEventListener("click", () => {
        currentFilter = "completed";
        renderTasks();
    });

    // Toggle dark mode
    themeToggleBtn.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem("isDarkMode", isDarkMode);
        document.body.classList.toggle("dark-mode", isDarkMode);
        themeToggleBtn.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
    });

    // Initial setup
    document.body.classList.toggle("dark-mode", isDarkMode);
    themeToggleBtn.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
    renderTasks();
});

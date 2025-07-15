document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addtaskbtn = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const Emptyimg = document.querySelector(".empty-img");
    // const todoscontainer = document.querySelector(".todos-container");
    const progressBar = document.querySelector("#progress");
    const progressNumbers = document.querySelector("#numbers");

    const toggleEmptyState = () => {
        Emptyimg.style.display = taskList.children.length === 0 ? "block" : "none";
        // todoscontainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
    };

    const updateProgressState = (checkCompletion = true) => {
        const Totaltasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll(".checkbox:checked").length;

        const progressPercent = Totaltasks ? (completedTasks / Totaltasks) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;
        progressNumbers.textContent = `${completedTasks} / ${Totaltasks}`;

        if (checkCompletion && Totaltasks > 0 && completedTasks === Totaltasks) {
            Confetti();
        }
    };

    const saveTasksToLocal = () => {
        const tasks = Array.from(taskList.querySelectorAll("li")).map(li => ({
            text: li.querySelector("span").textContent,
            completed: li.querySelector(".checkbox").checked
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    const loadTaskFromLocal = () => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgressState();
    };


    const addTask = (text, completed = false, checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) {
            return;
        }
        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
        <span>${taskText}</span>
        <div class="task-btns">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if (completed) {
            li.classList.add("completed");
            editBtn.disabled = true;
            editBtn.style.opacity = "0.5";
            editBtn.style.pointerEvents = "none";
        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? "0.5" : "1";
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";
            updateProgressState();
            saveTasksToLocal();
        });

        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector("span").textContent;
                li.remove();
                toggleEmptyState();
                updateProgressState(false);
                saveTasksToLocal();
            }
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            toggleEmptyState();
            updateProgressState();
            saveTasksToLocal();
        });


        taskList.appendChild(li);
        taskInput.value = "";
        toggleEmptyState();
        updateProgressState(checkCompletion);
        saveTasksToLocal();

    };

    addtaskbtn.addEventListener("click", (e) => {
        e.preventDefault();
        addTask();
    });
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    });

    loadTaskFromLocal();
});




const Confetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

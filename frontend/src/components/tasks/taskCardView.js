import { renderEditTask } from "./editTask.js";

export function renderTaskView(task){

    const taskView = document.createElement("div");
    taskView.className = "task-view";
    taskView.innerHTML = `
        <ul class="modal-box">
          <div class="task-view-buttons">
            <div class="archive-delete-buttons">
                <button class="archive-button button-main ade-button">Archive</button>
                <button class="delete-button button-main ade-button">Delete</button>
                <button class="edit-button button-main ade-button">Edit</button>
            </div>
            <button class="x-btn exit-button"><img src="./src/assets/exit.svg" alt="exit" class="icon"></button>
          </div>
          <li class="body-main">Title: ${task.title}</li>
          <li class="body-main">Description: ${task.description}</li>
          <li class="body-main">Status: ${task.status}</li>
          <li class="body-main">Start: ${task.startDate}</li>
          <li class="body-main">Due: ${task.endDate}</li>
          <li class="body-main">Estimated hours: ${task.estimateHours}</li>   
          <li class="body-main">Priority: ${task.priority}</li>     
          <li class="body-main">Type: ${task.type}</li>   
          <li class="body-main">Assignee: ${task.assignee}</li>     
        </ul>
    `;

    document.body.appendChild(taskView);

    const closeButton = taskView.querySelector(".x-btn");
    closeButton.addEventListener("click", ()=>{
        taskView.remove();
    });

    taskView.addEventListener("click", (e)=>{
        if(e.target === taskView)taskView.remove();
    });

    taskView.querySelector(".archive-button").addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("task:archive", {
            detail: { taskId: task.id }
        }));
        taskView.remove();
    });

    taskView.querySelector(".delete-button").addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("task:delete", {
            detail: { taskId: task.id }
        }));
        taskView.remove();
    });

    taskView.querySelector(".edit-button").addEventListener("click", () => {
        taskView.remove();
        renderEditTask(task);
    });
}

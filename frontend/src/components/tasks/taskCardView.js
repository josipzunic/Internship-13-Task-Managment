export function renderTaskView(task){

    const taskView = document.createElement("div");
    taskView.className = "task-view";
    taskView.innerHTML = `
        <ul class="modal-box">
          <button class="x-btn">✕</button>
          <li>Title: ${task.title}</li>
          <li>Description: ${task.description}</li>
          <li>Status: ${task.status}</li>
          <li>Start: ${task.startDate}</li>
          <li>Due: ${task.endDate}</li>
          <li>Estimated hours: ${task.estimateHours}</li>   
          <li>Priority: ${task.priority}</li>     
          <li>Type: ${task.type}</li>   
          <li>Assignee: ${task.assignee}</li>     
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
}
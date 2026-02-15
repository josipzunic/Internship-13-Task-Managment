export function renderEditTask(task){
    const editTaskView = document.createElement("div");
    editTaskView.className = "task-view";
    editTaskView.innerHTML = editTaskView.innerHTML = `
    <div class="modal-box">
      <div class="task-view-buttons">
        <button class="x-btn exit-button" type="button">
        <img src="./src/assets/exit.svg" alt="exit" class="icon">
        </button>
      </div>
      
      <label class="body-main">Title</label>
      <input class="input" name="title" value="${task.title ?? ""}" />
      
      <label class="body-main">Description</label>
      <textarea class="input" name="description">${task.description ?? ""}</textarea>
      
      <label class="body-main">Status</label>
      <select class="input" name="status">
        ${["BLOCKED","TODO","IN_PROGRESS","IN_REVIEW","DONE"].map(s =>
          `<option value="${s}" ${task.status===s ? "selected":""}>${s}</option>`
        ).join("")}
        </select>
        
        <label class="body-main">Start</label>
        <input class="input" type="date" name="startDate" value="${task.startDate ?? ""}" />
        
        <label class="body-main">Due</label>
        <input class="input" type="date" name="endDate" value="${task.endDate ?? ""}" />
        
        <label class="body-main">Estimate hours</label>
        <input class="input" type="number" name="estimateHours" min="0" value="${task.estimateHours ?? 0}" />
        
        <label class="body-main">Priority</label>
        <select class="input" name="priority">
        ${["LOW","MID","HIGH"].map(p =>
        `<option value="${p}" ${task.priority===p ? "selected":""}>${p}</option>`
        ).join("")}
        </select>
    
        <label class="body-main">Type</label>
        <select class="input" name="type">
        ${["FEATURE","BUGFIX","IMPROVEMENT"].map(t =>
        `<option value="${t}" ${task.type===t ? "selected":""}>${t}</option>`
        ).join("")}
    </select>
    
    <label class="body-main">Assignee</label>
    <input class="input" name="assignee" value="${task.assignee ?? ""}" />
    <button class="save-button button-main ade-button" type="button">Save</button>
    </div>
    `;
    
    document.body.appendChild(editTaskView);
    
    const closeButton = editTaskView.querySelector(".exit-button");
    closeButton.addEventListener("click", ()=>{
        editTaskView.remove();
    });
    
    editTaskView.addEventListener("click", (e)=>{
        if(e.target === editTaskView)editTaskView.remove();
    });
    
    editTaskView.querySelector(".save-button").addEventListener("click", () => {
        const box = editTaskView.querySelector(".modal-box");
    
        const patch = {
            title: box.querySelector('[name="title"]').value,
            description: box.querySelector('[name="description"]').value,
            status: box.querySelector('[name="status"]').value,
            startDate: box.querySelector('[name="startDate"]').value || null,
            endDate: box.querySelector('[name="endDate"]').value || null,
            estimateHours: Number(box.querySelector('[name="estimateHours"]').value || 0),
            priority: box.querySelector('[name="priority"]').value,
            type: box.querySelector('[name="type"]').value,
            assignee: box.querySelector('[name="assignee"]').value || null,
        };

        document.dispatchEvent(new CustomEvent("task:update", {
            detail: { taskId: task.id, patch }
        }));

        editTaskView.remove();
    });
}
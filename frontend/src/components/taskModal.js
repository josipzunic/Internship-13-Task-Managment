export function openTaskModal({ status }) {
   return new Promise((resolve) => {

      const modal = document.getElementById("taskModal");
      const modalContent = document.querySelector(".modal-content");

      modalContent.innerHTML = `
      <div class="modal-header">
         <h2 class="modal-title">Create Task</h2>
         <button class="exit-button"><img src="./src/assets/exit.svg" alt="exit" class="icon"></button>
      </div>
        
      <form class="task-form">
         <h3 class="input-title">Title:</h3>
         <input type="text" name="title" class="input-field" placeholder="Title" required>
         <h3 class="input-title">Description:</h3>
         <textarea name="description" class="input-field"></textarea>
         <h3 class="input-title">Start date:</h3>
         <input type="date" name="startDate" class="input-field">            <h3>End date:</h3>
         <input type="date" name="endDate" class="input-field">
         <h3 class="input-title">Estimate hours:</h3>
         <input type="number" name="estimateHours" min="0" class="input-field">
         <h3 class="input-title">Priority:</h3>
         <select name="priority" class="input-field">
            <option value="LOW">Low</option>
            <option value="MID">Middle</option>
            <option value="HIGH">High</option>
         </select>
         <h3 class="input-title">Type:</h3>
         <select name="type" class="input-field">
            <option value="FEATURE">Feature</option>
            <option value="BUGFIX">Bugfix</option>
            <option value="IMPROVEMENT">Improvement</option>
         </select>
         <h3 class="input-title" >Asignee:</h3>
         <input type="text" name="assignee" placeholder="Asignee" class="input-field">
            
         <div class="button-options">
            <button type="submit" class="button-main">Save</button>
            <button type="button" class="cancel-btn button-main">Cancel</button>
         </div>
      </form>
      `;

      modal.classList.remove("hidden");

      const form = modalContent.querySelector(".task-form");

      form.addEventListener("submit", (e) => {
         e.preventDefault();

         const formData = new FormData(form);

         resolve({
            title: formData.get("title"),
            description: formData.get("description"),
            status,
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            estimateHours: Number(formData.get("estimateHours")),
            priority: formData.get("priority"),
            type: formData.get("type"),
            assignee: formData.get("assignee")
         });

         closeModal();
      });

      modalContent.querySelector(".cancel-btn")
         .addEventListener("click", () => {
            closeModal();
            resolve(null);
         });

         modalContent.querySelector(".exit-button")
         .addEventListener("click", () => {
            closeModal();
            resolve(null);
         });
   });  
}

function closeModal() {
   const modal = document.getElementById("taskModal");
   modal.classList.add("hidden");
   const modalContent = modal.querySelector(".modal-content");
   modalContent.innerHTML = "";
}
   
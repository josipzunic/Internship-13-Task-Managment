export function openTaskModal({ status }) {
   return new Promise((resolve) => {

      const modal = document.getElementById("taskModal");
      const modalContent = document.querySelector(".modal-content");

      modalContent.innerHTML = `
      <div class="modul-header">
         <h2>Create Task</h2>
         <button class="exit-button"></button>
      </div>
        
      <form class="task-form">
         <h3>Title:</h3>
         <input type="text" name="title" placeholder="Title" required>
         <h3>Description:</h3>
         <textarea name="description"></textarea>
         <h3>Start date:</h3>
         <input type="date" name="startDate">            <h3>End date:</h3>
         <input type="date" name="endDate">
         <h3>Estimate hours:</h3>
         <input type="number" name="estimateHours" min="0">
         <h3>Priority:</h3>
         <select name="priority">
            <option value="LOW">Low</option>
            <option value="MID">Middle</option>
            <option value="HIGH">High</option>
         </select>
         <h3>Type:</h3>
         <select name="type">
            <option value="FEATURE">Feature</option>
            <option value="BUGFIX">Bugfix</option>
            <option value="IMPROVEMENT">Improvement</option>
         </select>
         <h3>Asignee:</h3>
         <input type="text" name="asignee" placeholder="Asignee">
            
         <div class="button-options">
            <button type="submit">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
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
   
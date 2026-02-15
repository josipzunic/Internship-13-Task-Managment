import { tasksApi } from "../api/taskApi.mock.js";
import { renderTaskCard } from "../components/tasks/taskCard.js";

export async function mountArchivePage() {
   const boardEl = document.getElementById("board");
   boardEl.innerHTML = `
      <div class="archive-page">
         <div class="archive-header">
            <h2>Archived Tasks</h2>
            <button id="back-btn" class="button-main">Back to board</button>
            <div class="filter">
                <label>From: <input type="date" id="from-date"></label>
                <label>To: <input type="date" id="to-date"></label>
               <button id="filter-btn" class="button-main">Filter</button>
            </div>
         </div>
         <div class="archive-list"></div>
      </div>
   `;

   const tasks = await tasksApi.getTasks();
   const list = document.querySelector(".archive-list");

   const renderArchivedTasks = (from, to) => {
      list.innerHTML = "";
      let archivedTasks = tasks.filter(t => t.archived);

      if (from && to) {
         archivedTasks = archivedTasks.filter(t => {
            const date = new Date(t.archivedAt);
            return date >= new Date(from) && date <= new Date(to);
         });
      }

      if (archivedTasks.length === 0) {
         list.innerHTML = "<span>No archived tasks in this period.</span>";

         return;
      }

      archivedTasks.forEach(task => {
         const card = renderTaskCard(task);
         list.appendChild(card);
      });
   };

   renderArchivedTasks();

   document.getElementById("back-btn").addEventListener("click", () => {
      window.location.hash = '#board';
   });

   document.getElementById("filter-btn").addEventListener("click", () => {
      const from = document.getElementById("from-date").value;
      const to = document.getElementById("to-date").value;
      renderArchivedTasks(from, to);
   });
}
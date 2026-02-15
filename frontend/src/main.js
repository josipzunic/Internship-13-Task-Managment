import { mountBoardPage } from "./pages/boardPage.js";
import { mountArchivePage } from "./pages/archivePage.js";

function router() {
   const hash = window.location.hash;

   if (hash.startsWith("#archivedTasks")) {
      mountArchivePage();
   } else {
      mountBoardPage();
   }
}

if(!window.location.hash) {
   window.location.hash = "#board";
}

router();

window.addEventListener("hashchange", router);

const MODE_KEY = "mode";

function applyMode(mode) {
   if (mode === "light") {
       document.body.classList.add("light");
   } else {
       document.body.classList.remove("light");
   }

   const btn = document.getElementById("modeToggle");
   if (btn) {
      btn.textContent = mode === "dark" ? "Light mode" : "Dark mode";
   }
}

function initMode() {
   const savedmode = localStorage.getItem(MODE_KEY) || "dark";
   applyMode(savedmode);
}

document.addEventListener("DOMContentLoaded", () => {
   initMode();

   const toggleBtn = document.getElementById("modeToggle");

   toggleBtn.addEventListener("click", () => {
      const currentMode = localStorage.getItem(MODE_KEY) || "dark";
      const newMode = currentMode === "dark" ? "light" : "dark";

      localStorage.setItem(MODE_KEY, newMode);
      applyMode(newMode);
   });
});

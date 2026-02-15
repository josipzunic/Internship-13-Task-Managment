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
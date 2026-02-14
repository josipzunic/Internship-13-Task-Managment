import { makeDropZone } from "../utils/dragDrop.js";

export function renderColumn(column, {count, onMove, onDropTask}){
    const wrap = document.createElement("section");
    wrap.className = "column";
    wrap.dataset.key = column.key;

    wrap.innerHTML = `
        <div class="column-header">
            <div class="column-title">
                <button class="arrow btn-move-left" title="Move left"><img src="./src/assets/arrow-left.svg" alt="" class="icon"></button>
                <span class="column-label">${column.label}</span>
                <button class="arrow btn-move-right" title="Move right"><img src="./src/assets/arrow-right.svg" alt="" class="icon"></button>
            </div>
            <div class="task-counter">
                <span class="body-main">Number of tasks:</span>
                <span class="tag">${count}</span>
            </div>
        </div>
        <div class="column-body"></div>
        <div class="column-buttons">
            <div class="column-archive-delete">
                <button class="archive-all button-main">Archive all</button>
                <button class="delete-all button-main">Delete all</button>
            </div>
            <button class="create-btn button-main">+ Add task</button>
        </div>
    `;
    const body = wrap.querySelector(".column-body");
    const createBtn = wrap.querySelector(".create-btn");
    makeDropZone(wrap, (taskId) => onDropTask(taskId, column.key));

    wrap.querySelector(".btn-move-left").addEventListener("click", () => onMove(column.key, "left"));
    wrap.querySelector(".btn-move-right").addEventListener("click", () => onMove(column.key, "right"));

    createBtn.addEventListener("click", () => {
        console.log("Add task clicked");
        document.dispatchEvent(
            new CustomEvent("task:create", {
                detail: { status: column.key }
            })
        );
    });

    return {wrap, body};
}
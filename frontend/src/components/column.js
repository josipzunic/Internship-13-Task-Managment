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
    `;
    const body = wrap.querySelector(".column-body");
    makeDropZone(wrap, (taskId) => onDropTask(taskId, column.key));

    wrap.querySelector(".btn-move-left").addEventListener("click", () => onMove(column.key, "left"));
    wrap.querySelector(".btn-move-right").addEventListener("click", () => onMove(column.key, "right"));
    return {wrap, body};

}
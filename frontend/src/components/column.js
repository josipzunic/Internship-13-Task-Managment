
export function renderColumn(column, {count, onMove}){
    const wrap = document.createElement("section");
    wrap.className = "column";
    wrap.dataset.key = column.key;

    wrap.innerHTML = `
        <div class="column-header">
            <div class="column-title">
                <span>${column.label}</span>
                <span class="task-count">${count}</span>
            </div>
            <div class="column-actions">
                <button class="btn btn-move-left" title="Move left">←</button>
                <button class="btn btn-move-right" title="Move right">→</button>
            </div>
        </div>
        <div class="column-body"></div>
    `;
    const body = wrap.querySelector(".column-body");
    wrap.querySelector(".btn-move-left").addEventListener("click", () => onMove(column.key, "left"));
    wrap.querySelector(".btn-move-right").addEventListener("click", () => onMove(column.key, "right"));
    return {wrap, body};

}
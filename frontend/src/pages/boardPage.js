import { tasksApi } from "../api/taskApi.mock.js";
import { renderColumn } from "../components/column.js";
import { renderTaskCard } from "../components/taskCard.js";

function groubByStatus(tasks){
    const result = tasks.reduce((acc, task) => {
        if(!acc[task.status]) acc[task.status] = [];
        acc[task.status].push(task);
        return acc;
    }, {});
    return result;
}

export async function mountBoardPage(){
    const boardEl = document.getElementById("board");

    async function render() {
        boardEl.innerHTML = "";

        const[columns, tasks] = await Promise.all([
            tasksApi.getColumns(),
            tasksApi.getTasks(),
        ]);

        const groupedTasks = groubByStatus(tasks);

        for(const col of columns){
            const colTasks = groupedTasks[col.key] || [];
            const {wrap, body} = renderColumn(col, {
                count: colTasks.length,
                onMove: async (key, direction) => {
                    await tasksApi.moveColumn(key, direction);
                    await render();
                },
            });

            colTasks.forEach((t) => {
                const card = renderTaskCard(t);
                body.appendChild(card);
            });
            boardEl.appendChild(wrap);
        }
    }
    await render();
}
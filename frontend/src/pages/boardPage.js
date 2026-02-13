import { tasksApi } from "../api/taskApi.mock.js";
import { renderColumn } from "../components/column.js";
import { renderTaskCard } from "../components/taskCard.js";
import { openTaskModal } from "../components/taskModal.js";

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
                onDropTask: async (taskId, targetStatus) => {
                    await tasksApi.updateTask(taskId, {status: targetStatus});
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

    document.addEventListener("task:create", async (e) => {
        const formData = await openTaskModal({ status: e.detail.status});
        if(!formData) return;

        await tasksApi.createTask(formData);
        await render();
    })
    await render();
}
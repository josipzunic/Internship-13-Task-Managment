import { tasksApi } from "../api/taskApi.mock.js";
import { renderColumn } from "../components/column.js";
import { renderTaskCard } from "../components/tasks/taskCard.js";
import { openTaskModal } from "../components/tasks/taskModal.js";


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

        const unarchivedTasks = tasks.filter(task => !task.archived);
        const groupedTasks = groubByStatus(unarchivedTasks);

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

    document.addEventListener("task:update", async (e) => {
        const { taskId, patch } = e.detail;
        await tasksApi.updateTask(taskId, patch);
        await render();
    });
    
    document.addEventListener("task:create", async (e) => {
        const formData = await openTaskModal({ status: e.detail.status});
        if(!formData) return;

        await tasksApi.createTask(formData);
        await render();
    })

    document.addEventListener("task:archive", async (e) => {
        await tasksApi.updateTask(e.detail.taskId, { archived: true });
        await render();
    })

    document.addEventListener("task:delete", async (e) => {
        await tasksApi.deleteTask(e.detail.taskId);
        await render();
    })
    document.addEventListener("column:archiveAllTasks", async (e) => {
        const { status } = e.detail;
        const tasks = await tasksApi.getTasks();
        const tasksToArchive = tasks.filter(t => t.status === status && !t.archived);

        await Promise.all(tasksToArchive.map(t => tasksApi.updateTask(t.id, {archived: true})));
        await render();
    });

    document.addEventListener("column:deleteAllTasks", async (e) => {
        const { status } = e.detail;
        const tasks = await tasksApi.getTasks();
        const tasksToDelete = tasks.filter(t => t.status === status);

        await Promise.all(tasksToDelete.map(t => tasksApi.deleteTask(t.id)));
        await render();
    });
    document.addEventListener("task:archive", async (e) => {
        await tasksApi.updateTask(e.detail.taskId, { archived: true });
        await render();
    })

    document.addEventListener("task:delete", async (e) => {
        await tasksApi.deleteTask(e.detail.taskId);
        await render();
    })

    await render();
}
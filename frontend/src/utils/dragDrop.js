export function makeDraggableTask(el , taskId){
    el.draggable = true;
    el.dataset.taskId = taskId;

    el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/taskId', taskId);
        e.dataTransfer.effectAllowed = 'move';
    });
}

export function makeDropZone(zoneEl, onDropTaskId){
    zoneEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        zoneEl.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'move';
    });

    zoneEl.addEventListener('dragleave', () => {
        zoneEl.classList.remove('drag-over');
    });

    zoneEl.addEventListener('drop', (e) => {
        e.preventDefault();
        zoneEl.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/taskId');
        if (taskId) onDropTaskId(taskId);
    });
}
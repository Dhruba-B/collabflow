import {
    reorderArray,
    withSequentialPositions,
} from "./reorderArray";

const getColumnId = (columnId) => Number(columnId);

export const findColumnByTaskId = (columns, taskId) => {
    return columns.find((column) =>
        (column.tasks || []).some((task) => task.id === Number(taskId))
    );
};

export const findTaskIndex = (tasks, taskId) => {
    return tasks.findIndex((task) => task.id === Number(taskId));
};

export const reorderTasksInColumn = ({
    columns,
    columnId,
    fromIndex,
    toIndex,
}) => {
    return columns.map((column) => {
        if (column.id !== getColumnId(columnId)) {
            return column;
        }

        return {
            ...column,
            tasks: withSequentialPositions(
                reorderArray(column.tasks || [], fromIndex, toIndex)
            ),
        };
    });
};

export const moveTaskBetweenColumns = ({
    columns,
    taskId,
    sourceColumnId,
    targetColumnId,
    targetIndex,
}) => {
    const normalizedTaskId = Number(taskId);
    const normalizedSourceColumnId = getColumnId(sourceColumnId);
    const normalizedTargetColumnId = getColumnId(targetColumnId);
    let movedTask = null;

    const columnsWithoutTask = columns.map((column) => {
        if (column.id !== normalizedSourceColumnId) {
            return column;
        }

        const sourceTasks = column.tasks || [];
        movedTask = sourceTasks.find((task) => task.id === normalizedTaskId);

        return {
            ...column,
            tasks: withSequentialPositions(
                sourceTasks.filter((task) => task.id !== normalizedTaskId)
            ),
        };
    });

    if (!movedTask) {
        return columns;
    }

    return columnsWithoutTask.map((column) => {
        if (column.id !== normalizedTargetColumnId) {
            return column;
        }

        const targetTasks = [...(column.tasks || [])];
        const insertionIndex = Math.max(
            0,
            Math.min(targetIndex, targetTasks.length)
        );

        targetTasks.splice(insertionIndex, 0, {
            ...movedTask,
            columnId: normalizedTargetColumnId,
        });

        return {
            ...column,
            tasks: withSequentialPositions(targetTasks),
        };
    });
};

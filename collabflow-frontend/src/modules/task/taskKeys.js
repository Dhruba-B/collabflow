export const taskKeys = {
    all: ["task"],

    column: (columnId) => [
        "task",
        "column",
        columnId,
    ],

    detail: (taskId) => [
        "task",
        taskId,
    ],
};

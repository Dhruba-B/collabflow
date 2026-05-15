export const columnKeys = {
    all: ["column"],

    board: (boardId) => [
        "column",
        "board",
        boardId,
    ],

    detail: (columnId) => [
        "column",
        columnId,
    ],
};

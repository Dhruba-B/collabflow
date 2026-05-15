export const boardKeys = {
    all: ["board"],

    workspace: (workspaceId) => [
        "board",
        "workspace",
        workspaceId,
    ],

    detail: (boardId) => [
        "board",
        boardId,
    ],
};

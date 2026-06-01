export const boardKeys = {
    all: ["board"],

    workspace: (workspaceId) => [
        "board",
        "workspace",
        workspaceId,
    ],

    shared: () => [
        "board",
        "shared",
    ],

    detail: (boardId) => [
        "board",
        boardId,
    ],
};

export const collaborationKeys = {
    all: ["collaboration"],
    board: (boardId) => [...collaborationKeys.all, "board", String(boardId)],
};

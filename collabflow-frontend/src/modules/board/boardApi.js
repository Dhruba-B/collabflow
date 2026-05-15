import { api } from "../../services/api/client";

export const getWorkspaceBoards = async (
    workspaceId
) => {
    const { data } = await api.get(
        `/board/workspace/${workspaceId}`
    );

    return data?.data?.boards;
};

export const createBoard = async (
    payload
) => {
    const { data } = await api.post(
        "/board",
        payload
    );

    return data;
};

export const getBoard = async (boardId) => {
    const { data } = await api.get(
        `/board/${boardId}`
    );

    return data?.data?.board;
};

export const deleteBoard = async ({
    boardId,
}) => {
    const { data } = await api.delete(
        `/board/${boardId}`
    );

    return data;
};

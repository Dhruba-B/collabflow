import { api } from "../../services/api/client";

export const getBoardCollaborators = async (boardId) => {
    const { data } = await api.get(`/collaboration/board/${boardId}`);

    return data?.data?.collaborators;
};

export const addBoardCollaborator = async ({ boardId, email, role }) => {
    const { data } = await api.post(`/collaboration/board/${boardId}`, {
        email,
        role,
    });

    return data?.data?.collaborator;
};

export const updateBoardCollaborator = async ({ boardId, userId, role }) => {
    const { data } = await api.patch(
        `/collaboration/board/${boardId}/${userId}`,
        { role }
    );

    return data?.data?.collaborator;
};

export const removeBoardCollaborator = async ({ boardId, userId }) => {
    const { data } = await api.delete(
        `/collaboration/board/${boardId}/${userId}`
    );

    return data?.data?.collaborator;
};

import { api } from "../../services/api/client";

export const getWorkspaces = async () => {
    const { data } = await api.get(
        "/workspace"
    );

    return data?.data?.workspaces;
};

export const createWorkspace = async (
    payload
) => {
    const { data } = await api.post(
        "/workspace",
        payload
    );

    return data;
};

export const getWorkspaceById = async (
    workspaceId
) => {
    const { data } = await api.get(
        `/workspace/${workspaceId}`
    );

    return data?.data?.workspace;
};

export const deleteWorkspace = async ({
    workspaceId,
}) => {
    const { data } = await api.delete(
        `/workspace/${workspaceId}`
    );

    return data;
};

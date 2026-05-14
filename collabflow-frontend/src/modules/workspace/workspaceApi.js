import { api } from "../../services/api/client";

export const getWorkspaces = async () => {
    const { data } = await api.get(
        "/workspaces"
    );

    return data?.data?.workspaces;
};

export const createWorkspace = async (
    payload
) => {
    const { data } = await api.post(
        "/workspaces",
        payload
    );

    return data;
};
import { api } from "../../services/api/client";

export const createTask = async ({
    columnId,
    title,
    description,
}) => {
    const { data } = await api.post(
        `/column/${columnId}/task`,
        { title, description }
    );

    return data;
};

export const updateTask = async ({
    taskId,
    title,
    description,
}) => {
    const { data } = await api.patch(
        `/task/${taskId}`,
        { title, description }
    );

    return data;
};

export const deleteTask = async ({
    taskId,
}) => {
    const { data } = await api.delete(
        `/task/${taskId}`
    );

    return data;
};

export const moveTask = async ({
    taskId,
    sourceColumnId,
    targetColumnId,
    position,
}) => {
    const { data } = await api.patch(
        `/task/${taskId}/move`,
        {
            sourceColumnId,
            targetColumnId,
            position,
        }
    );

    return data;
};

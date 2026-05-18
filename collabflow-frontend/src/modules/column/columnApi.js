import { api } from "../../services/api/client";

export const createColumn = async ({
    boardId,
    name,
}) => {
    const { data } = await api.post(
        `/board/${boardId}/column`,
        { name }
    );

    return data;
};

export const updateColumn = async ({
    columnId,
    name,
}) => {
    const { data } = await api.patch(
        `/column/${columnId}`,
        { name }
    );

    return data;
};

export const deleteColumn = async ({
    columnId,
}) => {
    const { data } = await api.delete(
        `/column/${columnId}`
    );

    return data;
};

export const reorderColumns = async ({
    columns,
}) => {
    const { data } = await api.put(
        "/column/reorder",
        { columns },
        { silentSnackbar: true }
    );

    return data;
};

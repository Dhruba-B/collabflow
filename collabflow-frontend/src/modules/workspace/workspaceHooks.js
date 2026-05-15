import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createWorkspace,
    deleteWorkspace,
    getWorkspaceById,
    getWorkspaces,
} from "./workspaceApi";

import { workspaceKeys } from "./workspaceKeys";

export const useWorkspaces = () => {
    return useQuery({
        queryKey: workspaceKeys.all,
        queryFn: getWorkspaces,
    });
};

export const useCreateWorkspace =
    () => {
        const queryClient =
            useQueryClient();

        return useMutation({
            mutationFn: createWorkspace,

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey:
                        workspaceKeys.all,
                });
            },
        });
    };

export const useWorkspace = (
    workspaceId
) => {
    return useQuery({
        queryKey:
            workspaceKeys.detail(
                workspaceId
            ),

        queryFn: () =>
            getWorkspaceById(
                workspaceId
            ),

        enabled: !!workspaceId,
    });
};

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteWorkspace,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.all,
            });
        },
    });
};

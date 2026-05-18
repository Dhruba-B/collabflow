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
import {
    showErrorSnackbar,
    showSuccessSnackbar,
} from "../../store/snackbarStore";

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

                showSuccessSnackbar("Workspace created");
            },

            onError: () => {
                showErrorSnackbar("Workspace could not be created");
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

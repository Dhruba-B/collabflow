import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createWorkspace,
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
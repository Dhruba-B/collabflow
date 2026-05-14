import { useMutation } from "@tanstack/react-query";

import {
    loginUser,
    registerUser,
} from "./authApi";

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,
    });
};
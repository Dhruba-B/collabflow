import { create } from "zustand";

const DEFAULT_DURATION = 4200;

const createSnackbar = ({
    message,
    severity = "info",
    duration = DEFAULT_DURATION,
}) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    message,
    severity,
    duration,
});

const useSnackbarStore = create((set, get) => ({
    snackbars: [],

    enqueueSnackbar: (snackbar) => {
        const nextSnackbar = createSnackbar(snackbar);

        set((state) => ({
            snackbars: [...state.snackbars, nextSnackbar].slice(-5),
        }));
    },

    closeSnackbar: (id) => {
        const { snackbars } = get();

        set({
            snackbars: snackbars.filter((snackbar) => snackbar.id !== id),
        });
    },

    clearSnackbars: () => {
        set({ snackbars: [] });
    },
}));

export const showSuccessSnackbar = (message, options = {}) => {
    useSnackbarStore.getState().enqueueSnackbar({
        message,
        severity: "success",
        ...options,
    });
};

export const showErrorSnackbar = (message, options = {}) => {
    useSnackbarStore.getState().enqueueSnackbar({
        message,
        severity: "error",
        duration: 5200,
        ...options,
    });
};

export const showInfoSnackbar = (message, options = {}) => {
    useSnackbarStore.getState().enqueueSnackbar({
        message,
        severity: "info",
        ...options,
    });
};

export const showWarningSnackbar = (message, options = {}) => {
    useSnackbarStore.getState().enqueueSnackbar({
        message,
        severity: "warning",
        ...options,
    });
};

export default useSnackbarStore;

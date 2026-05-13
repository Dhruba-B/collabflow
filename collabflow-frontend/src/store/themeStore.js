import { create } from "zustand";

const useThemeStore = create((set) => ({
    mode:
        localStorage.getItem("theme-mode") || "light",

    toggleTheme: () =>
        set((state) => {
            const nextMode =
                state.mode === "light"
                    ? "dark"
                    : "light";

            localStorage.setItem(
                "theme-mode",
                nextMode
            );

            return {
                mode: nextMode,
            };
        }),
}));

export default useThemeStore;
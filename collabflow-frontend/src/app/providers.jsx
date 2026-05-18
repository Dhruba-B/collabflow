import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter } from "react-router-dom";

import {
    CssBaseline,
    ThemeProvider,
} from "@mui/material";

import {
    darkTheme,
    lightTheme,
} from "../theme";

import useThemeStore from "../store/themeStore";
import GlobalSnackbar from "../components/GlobalSnackbar";

const queryClient = new QueryClient();

const Providers = ({ children }) => {
    const { mode } = useThemeStore();

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider
                    theme={
                        mode === "dark"
                            ? darkTheme
                            : lightTheme
                    }
                >
                    <CssBaseline />

                    {children}

                    <GlobalSnackbar />
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default Providers;

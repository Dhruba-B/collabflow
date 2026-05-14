import { createTheme } from "@mui/material/styles";
import { darkColors } from "./colors";
import { typography } from "./typography";

const darkTheme = createTheme({
    palette: {
        mode: "dark",

        primary: {
            main: darkColors.primary,
            dark: darkColors.primaryHover,
            soft: darkColors.primarySoft,
        },

        secondary: {
            main: darkColors.highlight,
        },

        background: {
            default: darkColors.background,
            paper: darkColors.surface,
        },

        text: {
            default: darkColors.textDefault,
            primary: darkColors.textPrimary,
            secondary: darkColors.textSecondary,
        },
    },

    typography,

    shape: {
        borderRadius: 12,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: darkColors.background,
                    color: darkColors.textPrimary,
                    fontFamily: "Geist, sans-serif",
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    border: `1px solid ${darkColors.border}`,
                },
            },
        },
    },
});

export default darkTheme;
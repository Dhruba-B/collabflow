import { createTheme } from "@mui/material/styles";
import { lightColors } from "./colors";
import { typography } from "./typography";

const lightTheme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: lightColors.primary,
            dark: lightColors.primaryHover,
        },

        secondary: {
            main: lightColors.highlight,
        },

        background: {
            default: lightColors.background,
            paper: lightColors.surface,
        },

        text: {
            primary: lightColors.textPrimary,
            secondary: lightColors.textSecondary,
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
                    backgroundColor: lightColors.background,
                    color: lightColors.textPrimary,
                    fontFamily: "Geist, sans-serif",
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    border: `1px solid ${lightColors.border}`,
                },
            },
        },
    },
});

export default lightTheme;
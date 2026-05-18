import { createTheme } from "@mui/material/styles";
import { lightColors } from "./colors";
import { typography } from "./typography";

const lightTheme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: lightColors.primary,
            dark: lightColors.primaryHover,
            soft: lightColors.primarySoft,
        },

        secondary: {
            main: lightColors.highlight,
        },

        background: {
            default: lightColors.background,
            paper: lightColors.surface,
        },

        text: {
            default: lightColors.textDefault,
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
                html: {
                    width: "100%",
                    minWidth: 320,
                },
                body: {
                    backgroundColor: lightColors.background,
                    color: lightColors.textPrimary,
                    fontFamily: "Geist, sans-serif",
                    width: "100%",
                    minWidth: 320,
                    minHeight: "100dvh",
                    overflowX: "hidden",
                },
                "#root": {
                    width: "100%",
                    minWidth: 320,
                    minHeight: "100dvh",
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

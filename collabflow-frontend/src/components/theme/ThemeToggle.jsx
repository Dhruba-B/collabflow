import { useMemo } from "react";

import {
    Box,
    IconButton,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
    DarkModeOutlined,
    LightModeOutlined,
} from "@mui/icons-material";

const ThemeToggle = ({
    mode = "light",
    onToggle,
}) => {
    const theme = useTheme();

    const isDark = useMemo(
        () => mode === "dark",
        [mode]
    );

    return (
        <Box
            sx={{
                position: "fixed",

                top: {
                    xs: "calc(12px + env(safe-area-inset-top))",
                    md: "auto",
                },
                right: {
                    xs: 12,
                    md: "auto",
                },
                bottom: {
                    xs: "auto",
                    md: 22,
                },
                left: {
                    xs: "auto",
                    md: 8,
                },

                zIndex: 9999,
                p: 0.3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "16px",

                backdropFilter: "blur(14px)",

                background:
                    isDark
                        ? "rgba(22,27,34,0.82)"
                        : "rgba(255,255,255,0.78)",

                border: `1px solid ${theme.palette.divider}`,

                boxShadow: isDark
                    ? "0 10px 30px rgba(0,0,0,0.32)"
                    : "0 10px 30px rgba(0,0,0,0.08)",

                transition: "all 0.2s ease",
                color: theme.palette.text.primary,

                "&:hover": {
                    background:
                        theme.palette.primary.main,

                    transform: "translateY(-1px)",
                    color: theme.palette.background.default,
                },
            }}
        >
            <IconButton
                onClick={onToggle}
                sx={{
                    width: {
                        xs: 44,
                        md: 50,
                    },
                    height: {
                        xs: 44,
                        md: 50,
                    },

                    borderRadius: "12px",

                    color: "inherit",

                    transition: "all 0.18s ease",

                    "&:hover": {


                    },
                }}
            >
                {isDark ? (
                    <LightModeOutlined />
                ) : (
                    <DarkModeOutlined />
                )}
            </IconButton>
        </Box>
    );
};

export default ThemeToggle;

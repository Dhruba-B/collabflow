import { useEffect } from "react";
import {
    Alert,
    Box,
    Slide,
    Snackbar,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import useSnackbarStore from "../store/snackbarStore";

const slideTransition = (props) => (
    <Slide {...props} direction="up" timeout={260} />
);

const getAccentColor = (theme, severity) => {
    if (severity === "error") {
        return theme.palette.error?.main || "#d32f2f";
    }

    if (severity === "warning") {
        return theme.palette.warning?.main || "#ed6c02";
    }

    if (severity === "success") {
        return theme.palette.success?.main || "#2e7d32";
    }

    return theme.palette.info?.main || "#0288d1";
};

const SnackbarItem = ({
    snackbar,
    onClose,
    theme,
}) => {
    const accentColor = getAccentColor(
        theme,
        snackbar.severity
    );

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            onClose(snackbar.id);
        }, snackbar.duration);

        return () => window.clearTimeout(timeoutId);
    }, [onClose, snackbar.duration, snackbar.id]);

    return (
        <Box
            sx={{
                width: {
                    xs: "100%",
                    sm: 390,
                },
                animation:
                    "snackbar-enter 220ms cubic-bezier(0.2, 0, 0, 1)",

                "@keyframes snackbar-enter": {
                    from: {
                        opacity: 0,
                        transform: "translateY(-8px) scale(0.98)",
                    },
                    to: {
                        opacity: 1,
                        transform: "translateY(0) scale(1)",
                    },
                },
            }}
        >
            <Alert
                severity={snackbar.severity || "info"}
                variant="filled"
                onClose={() => onClose(snackbar.id)}
                sx={{
                    width: "100%",
                    alignItems: "center",
                    borderRadius: "16px",
                    color: theme.palette.text.primary,
                    background:
                        theme.palette.mode === "dark"
                            ? alpha(
                                theme.palette.background.paper,
                                0.94
                            )
                            : alpha("#ffffff", 0.96),
                    border: `1px solid ${alpha(accentColor, 0.35)}`,
                    borderLeft: `4px solid ${accentColor}`,
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "0 18px 44px rgba(0,0,0,0.48)"
                            : "0 18px 42px rgba(38,31,48,0.16)",
                    backdropFilter: "blur(14px)",
                    fontSize: 14,
                    lineHeight: 1.5,

                    "& .MuiAlert-icon": {
                        color: accentColor,
                        opacity: 1,
                    },

                    "& .MuiAlert-action": {
                        color: theme.palette.text.secondary,
                        pt: 0,
                    },

                    "& .MuiIconButton-root": {
                        color: theme.palette.text.secondary,
                    },
                }}
            >
                {snackbar.message}
            </Alert>
        </Box>
    );
};

const GlobalSnackbar = () => {
    const theme = useTheme();
    const snackbars = useSnackbarStore((state) => state.snackbars);
    const closeSnackbar = useSnackbarStore(
        (state) => state.closeSnackbar
    );

    return (
        <Snackbar
            open={snackbars.length > 0}
            onClose={(_event, reason) => {
                if (reason === "clickaway") {
                    return;
                }
            }}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            TransitionComponent={slideTransition}
            sx={{
                display: "flex",
                "&.MuiSnackbar-root": {
                    left: {
                        xs: 16,
                        sm: "auto",
                    },
                    right: {
                        xs: 16,
                        sm: 24,
                    },
                    top: {
                        xs: 50,
                        sm: 100,
                    },
                },
            }}
        >
            <Box
                spacing={1.25}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    width: {
                        xs: "100%",
                        sm: "auto",
                    },
                }}
            >
                {snackbars.map((snackbar) => (
                    <SnackbarItem
                        key={snackbar.id}
                        snackbar={snackbar}
                        onClose={closeSnackbar}
                        theme={theme}
                    />
                ))}
            </Box>
        </Snackbar>
    );
};

export default GlobalSnackbar;

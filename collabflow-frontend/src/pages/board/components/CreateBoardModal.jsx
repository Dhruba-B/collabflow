import { useState } from "react";

import {
    Box,
    Dialog,
    Fade,
    Stack,
    Typography,
} from "@mui/material";

import {
    alpha,
    useTheme,
} from "@mui/material/styles";

import {
    AutoAwesome,
    Close,
    SpaceDashboardOutlined,
} from "@mui/icons-material";

import {
    AppButton,
    AppInput,
} from "../../../components";

const CreateBoardModal = ({
    open,
    onClose,
}) => {
    const theme = useTheme();

    const [name, setName] = useState("");

    const handleCreateBoard = async () => {
        if (!name?.trim()) return;

        try {
            console.log("create board", name);

            setName("");

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Fade}
            PaperProps={{
                sx: {
                    width: "100%",
                    maxWidth: 540,

                    minHeight: 640,

                    borderRadius: "30px",

                    background:
                        theme.palette.background.default,

                    backgroundImage: "none",

                    border: `1px solid ${theme.palette.divider}`,

                    overflow: "hidden",

                    position: "relative",
                },
            }}
        >
            {/* glow */}
            <Box
                sx={{
                    position: "absolute",

                    top: -140,
                    right: -140,

                    width: 320,
                    height: 320,

                    borderRadius: "50%",

                    background: `radial-gradient(circle, ${alpha(
                        theme.palette.primary.main,
                        0.16
                    )}, transparent 72%)`,

                    pointerEvents: "none",

                    filter: "blur(10px)",
                }}
            />

            <Stack
                spacing={4}
                sx={{
                    position: "relative",

                    height: "100%",

                    p: 4,

                    justifyContent:
                        "space-between",
                }}
            >
                {/* top */}
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "flex-start",
                            justifyContent:
                                "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                width: 54,
                                height: 54,

                                borderRadius:
                                    "18px",

                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",

                                background:
                                    theme.palette.mode ===
                                        "dark"
                                        ? alpha(
                                            theme
                                                .palette
                                                .primary
                                                .main,
                                            0.14
                                        )
                                        : "#FFF1F3",

                                color:
                                    theme
                                        .palette
                                        .primary
                                        .main,
                            }}
                        >
                            <SpaceDashboardOutlined />
                        </Box>

                        <Box
                            onClick={onClose}
                            sx={{
                                width: 40,
                                height: 40,

                                borderRadius:
                                    "12px",

                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",

                                cursor: "pointer",

                                color:
                                    theme
                                        .palette
                                        .text
                                        .secondary,

                                transition:
                                    "all 0.16s ease",

                                "&:hover":
                                {
                                    background:
                                        theme
                                            .palette
                                            .background
                                            .paper,

                                    color:
                                        theme
                                            .palette
                                            .text
                                            .primary,
                                },
                            }}
                        >
                            <Close fontSize="small" />
                        </Box>
                    </Box>

                    <Typography
                        sx={{
                            mt: 3,

                            fontSize: 34,
                            fontWeight: 800,

                            letterSpacing:
                                "-0.05em",
                        }}
                    >
                        Create board
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.5,

                            fontSize: 15,

                            lineHeight: 1.8,

                            color:
                                theme.palette.text.secondary,
                        }}
                    >
                        Boards help organize tasks,
                        workflows, and realtime team
                        collaboration inside your
                        workspace.
                    </Typography>
                </Box>

                {/* form */}
                <Stack spacing={3}>
                    <Box>
                        <Typography
                            sx={{
                                mb: 1,

                                fontSize: 14,
                                fontWeight: 600,

                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            Board name
                        </Typography>

                        <AppInput
                            autoFocus
                            placeholder="e.g. Product Sprint"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                        />
                    </Box>

                    {/* helper */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,

                            p: 2,

                            borderRadius: "18px",

                            background:
                                theme.palette.mode ===
                                    "dark"
                                    ? "rgba(255,255,255,0.04)"
                                    : theme.palette.background.paper,

                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <AutoAwesome
                            sx={{
                                fontSize: 18,

                                color:
                                    theme.palette.primary.main,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 13,

                                lineHeight: 1.7,

                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            Boards can later contain
                            columns, tasks, realtime
                            updates, and collaborative
                            workflows.
                        </Typography>
                    </Box>
                </Stack>

                {/* actions */}
                <Stack
                    direction="row"
                    spacing={1.5}
                    justifyContent="flex-end"
                >
                    <AppButton
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            borderColor:
                                theme.palette.divider,

                            color:
                                theme.palette.text.primary,

                            background:
                                theme.palette.background.paper,

                            "&:hover": {
                                borderColor:
                                    theme.palette.divider,

                                background:
                                    theme.palette.background.paper,
                            },
                        }}
                    >
                        Cancel
                    </AppButton>

                    <AppButton
                        onClick={
                            handleCreateBoard
                        }
                        sx={{
                            px: 3,

                            background:
                                theme.palette.primary.main,

                            color: "#fff",

                            "&:hover": {
                                background:
                                    theme.palette.primary.dark,
                            },
                        }}
                    >
                        Create board
                    </AppButton>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default CreateBoardModal;
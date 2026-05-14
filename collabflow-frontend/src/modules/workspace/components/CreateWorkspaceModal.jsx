import { useState } from "react";

import {
    Box,
    Dialog,
    Fade,
    Stack,
    Typography,
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";

import {
    AutoAwesome,
    Close,
    WorkspacesOutlined,
} from "@mui/icons-material";

import {
    AppButton,
    AppInput,
} from "../../../components";

import { useCreateWorkspace } from "../workspaceHooks";

const CreateWorkspaceModal = ({
    open,
    onClose,
}) => {
    const theme = useTheme();

    const [name, setName] = useState("");

    const createWorkspaceMutation =
        useCreateWorkspace();

    const handleCreateWorkspace =
        async () => {
            if (!name?.trim()) return;

            try {
                await createWorkspaceMutation.mutateAsync(
                    {
                        name,
                    }
                );
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
            slotProps={{
                paper: {
                    sx: {
                        width: "100%",
                        maxWidth: 540,
                        minHeight: 540,
                        borderRadius: "30px",
                        background: theme.palette.background.default,
                        backgroundImage: "none",
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: "hidden",
                        position: "relative",
                    },
                },
            }}
        >
            {/* top glow */}
            <Box
                sx={{
                    position: "absolute",

                    top: -140,
                    right: -140,

                    width: 320,
                    height: 320,

                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${alpha(
                        theme.palette.primary.dark,
                        0.16
                    )}, transparent 72%)`,

                    pointerEvents: "none",

                    filter: "blur(10px)",
                }}
            />

            <Stack
                spacing={3}
                sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    p: 3,
                }}
            >

                {/* form */}
                <Stack spacing={2}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent:
                                "space-between",
                        }}
                    >
                        <Box>
                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,

                                    borderRadius: "16px",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",

                                    mb: 2,

                                    background: theme.palette.primary.soft,

                                    color:
                                        theme.palette.primary.main,
                                }}
                            >
                                <WorkspacesOutlined />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: 28,
                                    fontWeight: 800,

                                    letterSpacing:
                                        "-0.04em",

                                    color:
                                        theme.palette.text.primary,
                                }}
                            >
                                Create workspace
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1,

                                    fontSize: 15,

                                    lineHeight: 1.7,

                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                Set up a collaborative
                                workspace for your team,
                                projects, and realtime
                                workflows.
                            </Typography>
                        </Box>

                        <Box
                            onClick={onClose}
                            sx={{
                                width: 40,
                                height: 40,

                                borderRadius: "12px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",

                                cursor: "pointer",

                                color:
                                    theme.palette.text.secondary,

                                transition:
                                    "all 0.16s ease",

                                "&:hover": {
                                    background:
                                        theme.palette.background.paper,

                                    color:
                                        theme.palette.text.primary,
                                },
                            }}
                        >
                            <Close fontSize="small" />
                        </Box>
                    </Box>

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
                            Workspace name
                        </Typography>

                        <AppInput
                            autoFocus
                            placeholder="e.g. Product Team"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                        />
                    </Box>

                    {/* hint */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,

                            p: 1.5,

                            borderRadius: "14px",

                            background:
                                theme.palette.mode ===
                                    "dark"
                                    ? "rgba(255,255,255,0.04)"
                                    : theme.palette.background.paper,

                            // border: `1px solid ${theme.palette.divider}`,
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

                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            Workspaces help organize
                            boards, members, and
                            collaborative workflows.
                        </Typography>
                    </Box>
                </Stack>

                {/* actions */}
                <Stack
                    direction="row"
                    spacing={1.5}
                    justifyContent="flex-end"
                    sx={{ mt: 5, alignSelf: "flex-end" }}
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
                            handleCreateWorkspace
                        }
                        disabled={
                            createWorkspaceMutation.isPending
                        }
                        sx={{
                            px: 3,

                            background:
                                theme.palette.primary.main,

                            color: theme.palette.text.default,

                            "&:hover": {
                                background:
                                    theme.palette.primary.dark,
                            },
                        }}
                    >
                        {createWorkspaceMutation.isPending
                            ? "Creating..."
                            : "Create workspace"}
                    </AppButton>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default CreateWorkspaceModal;
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
    TaskAltOutlined,
} from "@mui/icons-material";

import {
    AppButton,
    AppInput,
} from "../../../components";

import { useCreateTask } from "../taskHooks";

const CreateTaskModal = ({
    open,
    onClose,
    boardId,
    columnId,
    columnName,
}) => {
    const theme = useTheme();

    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");

    const createTaskMutation = useCreateTask();

    const handleCreateTask = () => {
        if (!title?.trim() || !columnId) return;

        createTaskMutation.mutate(
            {
                title: title.trim(),
                description:
                    description.trim() || undefined,
                columnId,
                boardId,
            },
            {
                onSuccess: () => {
                    setTitle("");
                    setDescription("");

                    onClose();
                },
            }
        );
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
                        minHeight: 640,
                        borderRadius: "30px",
                        background:
                            theme.palette.background.default,
                        backgroundImage: "none",
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: "hidden",
                        position: "relative",
                    },
                },
            }}
        >
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
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent:
                                "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                width: 54,
                                height: 54,
                                borderRadius: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
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
                                    theme.palette.primary.main,
                            }}
                        >
                            <TaskAltOutlined />
                        </Box>

                        <Box
                            onClick={onClose}
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
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

                    <Typography
                        sx={{
                            mt: 3,
                            fontSize: 34,
                            fontWeight: 800,
                            letterSpacing: "-0.05em",
                        }}
                    >
                        Create task
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
                        Add a task to
                        {columnName
                            ? ` ${columnName}`
                            : " this column"}
                        .
                    </Typography>
                </Box>

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
                            Task title
                        </Typography>

                        <AppInput
                            autoFocus
                            placeholder="e.g. Draft onboarding flow"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                        />
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
                            Description
                        </Typography>

                        <AppInput
                            multiline
                            minRows={3}
                            placeholder="Add a short note"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                        />
                    </Box>

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
                            Tasks stay ordered inside
                            columns and can move as the
                            work changes.
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ justifyContent: "flex-end" }}
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
                        onClick={handleCreateTask}
                        disabled={
                            createTaskMutation.isPending
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
                        {createTaskMutation.isPending
                            ? "Creating..."
                            : "Create task"}
                    </AppButton>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default CreateTaskModal;

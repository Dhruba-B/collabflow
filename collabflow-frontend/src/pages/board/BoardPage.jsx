import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Box, Chip, Stack, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";

import { Add, BoltOutlined, DeleteOutlined } from "@mui/icons-material";

import { useParams } from "react-router-dom";

import { AppButton, AppCard, ThemeToggle } from "../../components";
import { formatDistanceToNow } from "date-fns";
import Rail from "../../components/rail/Rail";
import useThemeStore from "../../store/themeStore";
import { useBoard } from "../../modules/board/boardHooks";
import { useDeleteColumn } from "../../modules/column/columnHooks";
import { useDeleteTask } from "../../modules/task/taskHooks";
import CreateColumnModal from "../../modules/column/components/CreateColumnModal";
import CreateTaskModal from "../../modules/task/components/CreateTaskModal";
import { registerBoardRealtime } from "../../services/socket/boardRealtime";

const BoardPage = () => {
    const theme = useTheme();

    const { boardId } = useParams();

    const queryClient = useQueryClient();

    const { mode, toggleTheme } = useThemeStore();

    const { data: board, isLoading } = useBoard(boardId);

    const deleteColumnMutation =
        useDeleteColumn();

    const deleteTaskMutation = useDeleteTask();

    const [openCreateColumn, setOpenCreateColumn] = useState(false);

    const [selectedColumn, setSelectedColumn] = useState(null);

    const columns = board?.columns || [];

    const handleOpenCreateTask = (column) => {
        setSelectedColumn(column);
    };

    const handleCloseCreateTask = () => {
        setSelectedColumn(null);
    };

    useEffect(() => {
        return registerBoardRealtime({
            boardId,
            queryClient,
        });
    }, [boardId, queryClient]);

    return (
        <Box
            sx={{
                minHeight: "100vh",

                background: theme.palette.background.default,

                display: "flex",

                overflow: "hidden",
            }}
        >
            {/* theme toggle */}
            <ThemeToggle mode={mode} onToggle={toggleTheme} />

            {/* side panel */}
            <Rail activeIndex={1} />

            <Box
                sx={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",

                    overflow: "hidden",
                }}
            >
                {/* topbar */}
                <Box
                    sx={{
                        height: 72,

                        px: 3,

                        borderBottom: `1px solid ${theme.palette.divider}`,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",

                        flexShrink: 0,
                    }}
                >
                    {/* left */}
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 26,
                                fontWeight: 800,

                                letterSpacing: "-0.04em",
                            }}
                        >
                            {isLoading ? "Loading board" : board?.name || "Board"}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                mb: 1, mt: 0.5,
                            }}
                        >
                            <Chip
                                label={`${board?.workspace?.name || ""}`}
                                size="small"
                                sx={{
                                    height: 24,

                                    borderRadius: "999px",

                                    background:
                                        theme.palette.mode === "dark"
                                            ? "rgba(255,255,255,0.06)"
                                            : theme.palette.background.paper,

                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* actions */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip
                            icon={
                                <BoltOutlined
                                    sx={{
                                        fontSize: "16px !important",
                                    }}
                                />
                            }
                            label="Realtime active"
                            sx={{
                                borderRadius: "999px",

                                background:
                                    theme.palette.mode === "dark"
                                        ? "rgba(232,72,85,0.12)"
                                        : "#FFF1F3",

                                color: theme.palette.primary.main,

                                border: "none",
                            }}
                        />

                        <AppButton
                            startIcon={<Add />}
                            onClick={() => setOpenCreateColumn(true)}
                            sx={{
                                background: theme.palette.primary.main,

                                color: theme.palette.text.default,

                                "&:hover": {
                                    background: theme.palette.primary.dark,
                                },
                            }}
                        >
                            New column
                        </AppButton>
                    </Stack>
                </Box>

                {/* kanban */}
                <Box
                    sx={{
                        flex: 1,

                        overflowX: "auto",
                        overflowY: "hidden",

                        p: 2.5,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",

                            gap: 2,

                            height: "100%",

                            minWidth: "max-content",
                        }}
                    >
                        {isLoading && (
                            <AppCard
                                sx={{
                                    width: 340,
                                    height: 160,
                                    p: 2.5,
                                    background: theme.palette.background.paper,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    Loading columns and tasks...
                                </Typography>
                            </AppCard>
                        )}

                        {!isLoading && columns.length === 0 && (
                            <AppCard
                                sx={{
                                    width: 340,
                                    p: 2.5,
                                    background: theme.palette.background.paper,
                                }}
                            >
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: 18,
                                                fontWeight: 800,
                                                letterSpacing: "-0.04em",
                                            }}
                                        >
                                            No columns yet
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 14,
                                                lineHeight: 1.7,
                                                color: theme.palette.text.secondary,
                                            }}
                                        >
                                            Create the first column to start organizing tasks.
                                        </Typography>
                                    </Box>

                                    <AppButton
                                        startIcon={<Add />}
                                        onClick={() => setOpenCreateColumn(true)}
                                        sx={{
                                            alignSelf: "flex-start",
                                            background: theme.palette.primary.main,
                                            color: theme.palette.text.default,
                                            "&:hover": {
                                                background: theme.palette.primary.dark,
                                            },
                                        }}
                                    >
                                        Create column
                                    </AppButton>
                                </Stack>
                            </AppCard>
                        )}

                        {!isLoading &&
                            columns.map((column) => {
                                const tasks = column.tasks || [];

                                return (
                                    <Box
                                        key={column.id}
                                        sx={{
                                            width: 340,

                                            display: "flex",
                                            flexDirection: "column",

                                            borderRadius: "20px",

                                            background: theme.palette.background.paper,

                                            border: `1px solid ${theme.palette.divider}`,

                                            overflow: "hidden",

                                            flexShrink: 0,
                                        }}
                                    >
                                        {/* column header */}
                                        <Box
                                            sx={{
                                                px: 2,
                                                py: 1.8,

                                                borderBottom: `1px solid ${theme.palette.divider}`,

                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography
                                                    sx={{
                                                        fontSize: 15,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {column.name}
                                                </Typography>

                                                <Chip
                                                    label={tasks.length}
                                                    size="small"
                                                    sx={{
                                                        height: 22,

                                                        borderRadius: "999px",

                                                        background:
                                                            theme.palette.mode === "dark"
                                                                ? "rgba(255,255,255,0.05)"
                                                                : theme.palette.background.default,
                                                    }}
                                                />
                                            </Stack>

                                            <Box
                                                onClick={() =>
                                                    deleteColumnMutation.mutate(
                                                        {
                                                            columnId:
                                                                column.id,
                                                            boardId,
                                                        }
                                                    )
                                                }
                                                sx={{
                                                    width: 34,
                                                    height: 34,

                                                    borderRadius: "10px",

                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",

                                                    cursor: "pointer",

                                                    transition: "all 0.16s ease",

                                                    color:
                                                        theme.palette.primary.main,

                                                    "&:hover": {
                                                        background:
                                                            theme.palette.primary.soft,
                                                        color:
                                                            theme.palette.primary.dark,
                                                    },
                                                }}
                                            >
                                                <DeleteOutlined fontSize="small" />
                                            </Box>
                                        </Box>

                                        {/* tasks */}
                                        <Box
                                            sx={{
                                                flex: 1,

                                                p: 1.5,

                                                overflowY: "auto",
                                            }}
                                        >
                                            <Stack spacing={1.5}>
                                                {tasks.map((task) => (
                                                    <AppCard
                                                        key={task.id}
                                                        sx={{
                                                            p: 2,

                                                            cursor: "pointer",

                                                            background: theme.palette.background.default,

                                                            transition: "all 0.18s ease",

                                                            "&:hover": {
                                                                transform: "translateY(-2px)",

                                                                borderColor: theme.palette.primary.main,
                                                            },
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "flex-start",
                                                                justifyContent:
                                                                    "space-between",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 14,
                                                                    fontWeight: 600,

                                                                    lineHeight: 1.6,
                                                                }}
                                                            >
                                                                {task.title}
                                                            </Typography>

                                                            <Box
                                                                onClick={(event) => {
                                                                    event.stopPropagation();

                                                                    deleteTaskMutation.mutate(
                                                                        {
                                                                            taskId:
                                                                                task.id,
                                                                            boardId,
                                                                        }
                                                                    );
                                                                }}
                                                                sx={{
                                                                    width: 28,
                                                                    height: 28,
                                                                    borderRadius:
                                                                        "10px",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    flexShrink: 0,
                                                                    color:
                                                                        theme
                                                                            .palette
                                                                            .primary
                                                                            .main,
                                                                    transition:
                                                                        "all 0.16s ease",

                                                                    "&:hover":
                                                                    {
                                                                        background:
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .soft,
                                                                        color:
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .dark,
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteOutlined fontSize="small" />
                                                            </Box>
                                                        </Box>

                                                        {task.description && (
                                                            <Typography
                                                                sx={{
                                                                    mt: 1,
                                                                    fontSize: 13,
                                                                    lineHeight: 1.6,
                                                                    color: theme.palette.text.secondary,
                                                                }}
                                                            >
                                                                {task.description}
                                                            </Typography>
                                                        )}

                                                        <Typography
                                                            sx={{
                                                                mt: 1.5,
                                                                fontSize: 11,
                                                                color: theme.palette.text.secondary,
                                                            }}
                                                        >
                                                            Updated{" "}
                                                            {formatDistanceToNow(
                                                                new Date(task?.createdAt),
                                                                {
                                                                    addSuffix: true,
                                                                }
                                                            )}
                                                        </Typography>
                                                    </AppCard>
                                                ))}

                                                {/* add task */}
                                                <Box
                                                    onClick={() => handleOpenCreateTask(column)}
                                                    sx={{
                                                        p: 2,

                                                        borderRadius: "16px",

                                                        border: `1px dashed ${theme.palette.divider}`,

                                                        display: "flex",

                                                        alignItems: "center",
                                                        justifyContent: "center",

                                                        cursor: "pointer",

                                                        color: theme.palette.text.secondary,

                                                        transition: "all 0.18s ease",

                                                        "&:hover": {
                                                            borderColor: theme.palette.primary.main,

                                                            color: theme.palette.primary.main,

                                                            background: theme.palette.primary.soft,
                                                        },
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                    >
                                                        <Add fontSize="small" />

                                                        <Typography
                                                            sx={{
                                                                fontSize: 14,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Add task
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>
                                );
                            })}
                    </Box>
                </Box>
            </Box>

            <CreateColumnModal
                open={openCreateColumn}
                onClose={() => setOpenCreateColumn(false)}
                boardId={boardId}
            />

            <CreateTaskModal
                open={Boolean(selectedColumn)}
                onClose={handleCloseCreateTask}
                boardId={boardId}
                columnId={selectedColumn?.id}
                columnName={selectedColumn?.name}
            />
        </Box>
    );
};

export default BoardPage;

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
    closestCorners,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";

import { Box, Chip, Stack, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";

import { Add, BoltOutlined } from "@mui/icons-material";

import { useParams } from "react-router-dom";

import { AppButton, AppCard, ThemeToggle } from "../../components";
import Rail from "../../components/rail/Rail";
import useThemeStore from "../../store/themeStore";
import { useBoard } from "../../modules/board/boardHooks";
import {
    useDeleteColumn,
    useReorderColumn,
} from "../../modules/column/columnHooks";
import {
    useDeleteTask,
    useMoveTask,
    useReorderTask,
} from "../../modules/task/taskHooks";
import CreateColumnModal from "../../modules/column/components/CreateColumnModal";
import CreateTaskModal from "../../modules/task/components/CreateTaskModal";
import { registerBoardRealtime } from "../../services/socket/boardRealtime";
import SortableColumn from "./components/SortableColumn";
import {
    findColumnByTaskId,
    findTaskIndex,
} from "../../utils/dnd/moveTaskBetweenColumns";
import {
    reorderArray,
    withSequentialPositions,
} from "../../utils/dnd/reorderArray";

const getDragData = (entry) => entry?.data?.current;

const getTaskDropTarget = (over) => {
    const overData = getDragData(over);

    if (overData?.type === "task") {
        return {
            columnId: overData.columnId,
            taskId: overData.taskId,
        };
    }

    if (
        overData?.type === "columnDrop" ||
        overData?.type === "column"
    ) {
        return {
            columnId: overData.columnId,
            taskId: null,
        };
    }

    return null;
};

const getSocketEntityIds = ({ type, event }) => {
    const entity = type === "task" ? event?.task : event?.column;

    if (Array.isArray(entity)) {
        return entity.map((item) => item.id);
    }

    return entity?.id ? [entity.id] : [];
};

const BoardPage = () => {
    const theme = useTheme();

    const { boardId } = useParams();

    const queryClient = useQueryClient();

    const { mode, toggleTheme } = useThemeStore();

    const { data: board, isLoading } = useBoard(boardId);

    const deleteColumnMutation =
        useDeleteColumn();

    const deleteTaskMutation = useDeleteTask();
    const moveTaskMutation = useMoveTask();
    const reorderTaskMutation = useReorderTask();
    const reorderColumnMutation = useReorderColumn();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        })
    );

    const [openCreateColumn, setOpenCreateColumn] = useState(false);

    const [selectedColumn, setSelectedColumn] = useState(null);
    const [isDraggingBoard, setIsDraggingBoard] = useState(false);
    const [syncSignal, setSyncSignal] = useState({
        active: false,
        ids: [],
        type: null,
        version: 0,
    });

    const columns = board?.columns || [];

    const handleOpenCreateTask = (column) => {
        setSelectedColumn(column);
    };

    const handleCloseCreateTask = () => {
        setSelectedColumn(null);
    };

    const handleColumnDragEnd = (activeColumnId, overColumnId) => {
        if (activeColumnId === overColumnId) {
            return;
        }

        const activeIndex = columns.findIndex(
            (column) => column.id === activeColumnId
        );
        const overIndex = columns.findIndex(
            (column) => column.id === overColumnId
        );

        if (activeIndex < 0 || overIndex < 0) {
            return;
        }

        const orderedColumns = withSequentialPositions(
            reorderArray(columns, activeIndex, overIndex)
        );

        reorderColumnMutation.mutate({
            boardId,
            columns: orderedColumns.map((column) => ({
                id: column.id,
                position: column.position,
            })),
        });
    };

    const handleTaskDragEnd = (active, over) => {
        const activeData = getDragData(active);
        const taskId = activeData?.taskId;
        const sourceColumn =
            columns.find(
                (column) => column.id === activeData?.columnId
            ) || findColumnByTaskId(columns, taskId);
        const target = getTaskDropTarget(over);
        const targetColumn = columns.find(
            (column) => column.id === target?.columnId
        );

        if (!taskId || !sourceColumn || !targetColumn) {
            return;
        }

        const sourceTasks = sourceColumn.tasks || [];
        const targetTasks = targetColumn.tasks || [];
        const sourceIndex = findTaskIndex(sourceTasks, taskId);
        const targetTaskIndex = target.taskId
            ? findTaskIndex(targetTasks, target.taskId)
            : -1;

        if (sourceIndex < 0) {
            return;
        }

        if (sourceColumn.id === targetColumn.id) {
            const targetIndex =
                targetTaskIndex >= 0
                    ? targetTaskIndex
                    : sourceTasks.length - 1;

            if (sourceIndex === targetIndex) {
                return;
            }

            const orderedTasks = withSequentialPositions(
                reorderArray(sourceTasks, sourceIndex, targetIndex)
            );

            reorderTaskMutation.mutate({
                boardId,
                columnId: sourceColumn.id,
                taskId,
                tasks: orderedTasks.map((task) => ({
                    id: task.id,
                    position: task.position,
                })),
            });

            return;
        }

        const targetIndex =
            targetTaskIndex >= 0
                ? targetTaskIndex
                : targetTasks.length;

        moveTaskMutation.mutate({
            boardId,
            taskId,
            sourceColumnId: sourceColumn.id,
            targetColumnId: targetColumn.id,
            position: targetIndex,
        });
    };

    const handleDragEnd = ({ active, over }) => {
        setIsDraggingBoard(false);

        if (!over || active.id === over.id) {
            return;
        }

        const activeData = getDragData(active);
        const overData = getDragData(over);

        if (activeData?.type === "column" && overData?.type === "column") {
            handleColumnDragEnd(
                activeData.columnId,
                overData.columnId
            );
            return;
        }

        if (activeData?.type === "task") {
            handleTaskDragEnd(active, over);
        }
    };

    useEffect(() => {
        return registerBoardRealtime({
            boardId,
            queryClient,
            onSyncEvent: ({ type, event }) => {
                setSyncSignal((currentSignal) => ({
                    active: true,
                    ids: getSocketEntityIds({
                        type,
                        event,
                    }),
                    type,
                    version: currentSignal.version + 1,
                }));
            },
        });
    }, [boardId, queryClient]);

    useEffect(() => {
        if (!syncSignal.active) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setSyncSignal((currentSignal) => ({
                ...currentSignal,
                active: false,
            }));
        }, 850);

        return () => window.clearTimeout(timeoutId);
    }, [syncSignal.active, syncSignal.version]);

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

                        {!isLoading && columns.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCorners}
                                onDragStart={() => setIsDraggingBoard(true)}
                                onDragEnd={handleDragEnd}
                                onDragCancel={() => setIsDraggingBoard(false)}
                            >
                                <SortableContext
                                    items={columns.map(
                                        (column) => `column:${column.id}`
                                    )}
                                    strategy={horizontalListSortingStrategy}
                                >
                                    <AnimatePresence initial={false}>
                                        {columns.map((column) => (
                                            <motion.div
                                                key={column.id}
                                                layout={
                                                    syncSignal.active &&
                                                    !isDraggingBoard
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.98,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.98,
                                                }}
                                                transition={{
                                                    layout: {
                                                        type: "spring",
                                                        stiffness: 360,
                                                        damping: 34,
                                                    },
                                                    opacity: {
                                                        duration: 0.16,
                                                    },
                                                    scale: {
                                                        duration: 0.16,
                                                    },
                                                }}
                                                style={{
                                                    display: "flex",
                                                }}
                                            >
                                                <SortableColumn
                                                    boardId={boardId}
                                                    column={column}
                                                    deleteColumnMutation={
                                                        deleteColumnMutation
                                                    }
                                                    deleteTaskMutation={
                                                        deleteTaskMutation
                                                    }
                                                    onOpenCreateTask={
                                                        handleOpenCreateTask
                                                    }
                                                    syncSignal={syncSignal}
                                                    isDraggingBoard={
                                                        isDraggingBoard
                                                    }
                                                    theme={theme}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </SortableContext>
                            </DndContext>
                        )}
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

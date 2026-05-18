import { useEffect } from "react";
import { alpha, Box, Chip, Stack, Typography } from "@mui/material";
import {
    Add,
    DeleteOutlined,
    DragIndicator,
} from "@mui/icons-material";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    AnimatePresence,
    motion,
    useAnimationControls,
} from "framer-motion";

import SortableTaskCard from "./SortableTaskCard";

const SortableColumn = ({
    boardId,
    column,
    deleteColumnMutation,
    deleteTaskMutation,
    isDraggingBoard,
    isTouchOptimizedDnd,
    onOpenCreateTask,
    syncSignal,
    theme,
}) => {
    const tasks = column.tasks || [];
    const syncControls = useAnimationControls();
    const {
        attributes,
        isDragging,
        listeners,
        setActivatorNodeRef,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: `column:${column.id}`,
        data: {
            type: "column",
            columnId: column.id,
        },
    });
    const { setNodeRef: setTaskDropRef } = useDroppable({
        id: `column-drop:${column.id}`,
        data: {
            type: "columnDrop",
            columnId: column.id,
        },
    });

    useEffect(() => {
        if (syncSignal?.type !== "column" || syncSignal.version === 0) {
            return;
        }

        if (
            syncSignal.ids.length > 0 &&
            !syncSignal.ids.includes(column.id)
        ) {
            return;
        }

        syncControls.start({
            boxShadow: [
                "0 0 0 " + theme.palette.primary.soft,
                "0 0 0 3px " + alpha(theme.palette.primary.main, 0.48),
                "0 0 0 " + theme.palette.primary.soft,
            ],
            transition: {
                duration: 0.75,
                ease: "easeOut",
            },
            borderRadius: ["20px", "20px", "20px"],

        });
    }, [
        column.id,
        syncControls,
        syncSignal?.ids,
        syncSignal?.type,
        syncSignal?.version,
        theme.palette.primary.main,
        theme.palette.primary.soft,
    ]);

    return (
        <Box
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                transformOrigin: "50% 50%",
            }}
            sx={{
                width: 340,
                display: "flex",
                flexShrink: 0,
                scrollSnapAlign: isTouchOptimizedDnd ? "start" : "none",
            }}
        >
            <motion.div
                layout={
                    syncSignal?.active &&
                    !isDragging &&
                    !isDraggingBoard
                }
                initial={false}
                animate={syncControls}
                transition={{
                    layout: {
                        type: "spring",
                        stiffness: 340,
                        damping: 34,
                    },
                }}
                style={{
                    width: 340,
                    display: "flex",
                    flexShrink: 0,
                    transformOrigin: "50% 50%",
                }}
            >
                <Box
                    sx={{
                        width: 340,

                        display: "flex",
                        flexDirection: "column",

                        borderRadius: "20px",

                        background: theme.palette.background.paper,

                        border: `1px solid ${theme.palette.divider}`,

                        overflow: "hidden",

                        flexShrink: 0,
                        opacity: isDragging ? 0.7 : 1,
                        zIndex: isDragging ? 20 : "auto",
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
                            cursor: isTouchOptimizedDnd ? "default" : "grab",
                            touchAction: isTouchOptimizedDnd
                                ? "pan-x pan-y"
                                : "none",
                            userSelect: "none",

                            "&:active": {
                                cursor: isTouchOptimizedDnd
                                    ? "default"
                                    : "grabbing",
                            },
                        }}
                        {...(!isTouchOptimizedDnd ? attributes : {})}
                        {...(!isTouchOptimizedDnd ? listeners : {})}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                ref={
                                    isTouchOptimizedDnd
                                        ? setActivatorNodeRef
                                        : undefined
                                }
                                {...(isTouchOptimizedDnd ? attributes : {})}
                                {...(isTouchOptimizedDnd ? listeners : {})}
                                aria-label={`Drag ${column.name} column`}
                                sx={{
                                    width: 34,
                                    height: 34,
                                    ml: -0.75,
                                    borderRadius: "10px",
                                    display: isTouchOptimizedDnd
                                        ? "flex"
                                        : "none",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    color: theme.palette.text.secondary,
                                    cursor: "grab",
                                    touchAction: "none",
                                    userSelect: "none",
                                    transition: "all 0.16s ease",

                                    "&:active": {
                                        cursor: "grabbing",
                                    },

                                    "&:hover": {
                                        background:
                                            theme.palette.primary.soft,
                                        color: theme.palette.primary.main,
                                    },
                                }}
                            >
                                <DragIndicator fontSize="small" />
                            </Box>

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
                            onClick={(event) => {
                                event.stopPropagation();

                                deleteColumnMutation.mutate(
                                    {
                                        columnId: column.id,
                                        boardId,
                                    }
                                );
                            }}
                            onPointerDown={(event) => event.stopPropagation()}
                            onTouchStart={(event) => event.stopPropagation()}
                            sx={{
                                width: 34,
                                height: 34,

                                borderRadius: "10px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                cursor: "pointer",

                                transition: "all 0.16s ease",

                                color: theme.palette.primary.main,

                                "&:hover": {
                                    background: theme.palette.primary.soft,
                                    color: theme.palette.primary.dark,
                                },
                            }}
                        >
                            <DeleteOutlined fontSize="small" />
                        </Box>
                    </Box>

                    {/* tasks */}
                    <Box
                        ref={setTaskDropRef}
                        sx={{
                            flex: 1,

                            p: 1.5,

                            overflowY: "auto",
                            overscrollBehavior: "contain",
                            WebkitOverflowScrolling: "touch",
                            touchAction: "pan-y",
                        }}
                    >
                        <SortableContext
                            items={tasks.map((task) => `task:${task.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Stack spacing={1.5}>
                                <AnimatePresence initial={false}>
                                    {tasks.map((task) => (
                                        <SortableTaskCard
                                            key={task.id}
                                            task={task}
                                            columnId={column.id}
                                            isDraggingBoard={isDraggingBoard}
                                            syncSignal={syncSignal}
                                            theme={theme}
                                            isTouchOptimizedDnd={
                                                isTouchOptimizedDnd
                                            }
                                            onDelete={(deletedTask) =>
                                                deleteTaskMutation.mutate(
                                                    {
                                                        taskId: deletedTask.id,
                                                        boardId,
                                                    }
                                                )
                                            }
                                        />
                                    ))}
                                </AnimatePresence>

                                {/* add task */}
                                <Box
                                    onClick={() => onOpenCreateTask(column)}
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
                        </SortableContext>
                    </Box>
                </Box>
            </motion.div>
        </Box>
    );
};

export default SortableColumn;

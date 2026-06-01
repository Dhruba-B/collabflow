import { useEffect } from "react";
import { alpha, Box, Typography } from "@mui/material";
import { DeleteOutlined, DragIndicator } from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow } from "date-fns";
import { motion, useAnimationControls } from "framer-motion";

import { AppCard } from "../../../components";

const SortableTaskCard = ({
    task,
    columnId,
    canWrite,
    isDraggingBoard,
    isTouchOptimizedDnd,
    syncSignal,
    theme,
    onDelete,
}) => {
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
        id: `task:${task.id}`,
        disabled: !canWrite,
        data: {
            type: "task",
            taskId: task.id,
            columnId,
        },
    });

    useEffect(() => {
        if (syncSignal?.type !== "task" || syncSignal.version === 0) {
            return;
        }

        if (
            syncSignal.ids.length > 0 &&
            !syncSignal.ids.includes(task.id)
        ) {
            return;
        }

        syncControls.start({
            boxShadow: [
                "0 0 0 " + alpha(theme.palette.primary.main, 0.24),
                "0 0 0 3px " + alpha(theme.palette.primary.main, 0.48),
                "0 0 0 " + alpha(theme.palette.primary.main, 0.24),
            ],
            transition: {
                duration: 0.7,
                ease: "easeOut",
            },
            borderRadius: ["20px", "20px", "20px"],
        });
    }, [
        syncControls,
        syncSignal?.ids,
        syncSignal?.type,
        syncSignal?.version,
        task.id,
        theme.palette.primary.main,
    ]);

    return (
        <Box
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                transformOrigin: "50% 50%",
            }}
            {...(!isTouchOptimizedDnd && canWrite ? attributes : {})}
            {...(!isTouchOptimizedDnd && canWrite ? listeners : {})}
            sx={{
                touchAction: isTouchOptimizedDnd ? "pan-y" : "none",
                userSelect: "none",
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
                        stiffness: 420,
                        damping: 36,
                    },
                }}
                style={{
                    transformOrigin: "50% 50%",
                }}
            >
                <Box
                    sx={{
                        opacity: isDragging ? 0.6 : 1,
                        zIndex: isDragging ? 10 : "auto",
                    }}
                >
                    <AppCard
                        sx={{
                            p: {
                                xs: 1.5,
                                md: 2,
                            },

                            cursor:
                                isTouchOptimizedDnd || !canWrite
                                    ? "default"
                                    : "grab",

                            background: theme.palette.background.default,

                            transition: "border-color 0.18s ease, background 0.18s ease",
                            touchAction: isTouchOptimizedDnd
                                ? "pan-y"
                                : "none",
                            userSelect: "none",

                            "&:active": {
                                cursor: isTouchOptimizedDnd
                                    ? "default"
                                    : "grabbing",
                            },

                            "&:hover": {
                                borderColor: theme.palette.primary.main,
                            },
                        }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    minWidth: 0,
                                }}
                            >
                                <Box
                                    ref={
                                        isTouchOptimizedDnd
                                            ? setActivatorNodeRef
                                            : undefined
                                    }
                                    {...(isTouchOptimizedDnd && canWrite
                                        ? attributes
                                        : {})}
                                    {...(isTouchOptimizedDnd && canWrite
                                        ? listeners
                                        : {})}
                                    aria-label={`Drag ${task.title} task`}
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        ml: -0.75,
                                        mt: -0.25,
                                        borderRadius: "10px",
                                        display: isTouchOptimizedDnd && canWrite
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
                                    fontSize: {
                                        xs: 13.5,
                                        md: 14,
                                    },
                                    fontWeight: 600,

                                    lineHeight: 1.6,
                                    flex: 1,
                                    minWidth: 0,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {task.title}
                            </Typography>

                            <Box
                                onClick={(event) => {
                                    event.stopPropagation();

                                    if (canWrite) {
                                        onDelete(task);
                                    }
                                }}
                                onPointerDown={(event) => event.stopPropagation()}
                                onTouchStart={(event) => event.stopPropagation()}
                                sx={{
                                    width: {
                                        xs: 32,
                                        md: 28,
                                    },
                                    height: {
                                        xs: 32,
                                        md: 28,
                                    },
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    color: theme.palette.primary.main,
                                    opacity: canWrite ? 1 : 0.42,
                                    transition: "all 0.16s ease",

                                    "&:hover": {
                                        background: theme.palette.primary.soft,
                                        color: theme.palette.primary.dark,
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
                                    fontSize: {
                                        xs: 12.5,
                                        md: 13,
                                    },
                                    lineHeight: 1.6,
                                    color: theme.palette.text.secondary,
                                    overflowWrap: "anywhere",
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
                </Box>
            </motion.div>
        </Box>
    );
};

export default SortableTaskCard;

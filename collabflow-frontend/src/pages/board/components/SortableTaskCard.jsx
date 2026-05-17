import { useEffect } from "react";
import { alpha, Box, Typography } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow } from "date-fns";
import { motion, useAnimationControls } from "framer-motion";

import { AppCard } from "../../../components";

const SortableTaskCard = ({
    task,
    columnId,
    isDraggingBoard,
    syncSignal,
    theme,
    onDelete,
}) => {
    const syncControls = useAnimationControls();
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: `task:${task.id}`,
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
    ]);

    return (
        <Box
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                transformOrigin: "50% 50%",
            }}
            {...attributes}
            {...listeners}
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
                            p: 2,

                            cursor: "grab",

                            background: theme.palette.background.default,

                            transition: "border-color 0.18s ease, background 0.18s ease",

                            "&:active": {
                                cursor: "grabbing",
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

                                    onDelete(task);
                                }}
                                onPointerDown={(event) => event.stopPropagation()}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    color: theme.palette.primary.main,
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
                </Box>
            </motion.div>
        </Box>
    );
};

export default SortableTaskCard;

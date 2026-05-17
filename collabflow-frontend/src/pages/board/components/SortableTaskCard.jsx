import { Box, Typography } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow } from "date-fns";

import { AppCard } from "../../../components";

const SortableTaskCard = ({
    task,
    columnId,
    theme,
    onDelete,
}) => {
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

    return (
        <Box
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            sx={{
                opacity: isDragging ? 0.6 : 1,
                zIndex: isDragging ? 10 : "auto",
            }}
            {...attributes}
            {...listeners}
        >
            <AppCard
                sx={{
                    p: 2,

                    cursor: "grab",

                    background: theme.palette.background.default,

                    transition: "all 0.18s ease",

                    "&:active": {
                        cursor: "grabbing",
                    },

                    "&:hover": {
                        transform: "translateY(-2px)",

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
    );
};

export default SortableTaskCard;

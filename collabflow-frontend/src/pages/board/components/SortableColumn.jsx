import { Box, Chip, Stack, Typography } from "@mui/material";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SortableTaskCard from "./SortableTaskCard";

const SortableColumn = ({
    boardId,
    column,
    deleteColumnMutation,
    deleteTaskMutation,
    onOpenCreateTask,
    theme,
}) => {
    const tasks = column.tasks || [];
    const {
        attributes,
        isDragging,
        listeners,
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

    return (
        <Box
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
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
                    cursor: "grab",

                    "&:active": {
                        cursor: "grabbing",
                    },
                }}
                {...attributes}
                {...listeners}
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
                }}
            >
                <SortableContext
                    items={tasks.map((task) => `task:${task.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <Stack spacing={1.5}>
                        {tasks.map((task) => (
                            <SortableTaskCard
                                key={task.id}
                                task={task}
                                columnId={column.id}
                                theme={theme}
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
    );
};

export default SortableColumn;

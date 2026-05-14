import {
    Box,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
    Add,
    BoltOutlined,
    MoreHoriz,
} from "@mui/icons-material";

import { useParams } from "react-router-dom";

import {
    AppButton,
    AppCard,
    ThemeToggle,
} from "../../components";

import useThemeStore from "../../store/themeStore";

const columns = [
    {
        title: "Backlog",
        tasks: [
            "Create websocket gateway",
            "Setup board permissions",
        ],
    },
    {
        title: "In Progress",
        tasks: [
            "Workspace realtime sync",
            "Task optimistic updates",
        ],
    },
    {
        title: "Done",
        tasks: [
            "Theme architecture",
        ],
    },
];

const BoardPage = () => {
    const theme = useTheme();

    const { boardId } = useParams();

    const { mode, toggleTheme } =
        useThemeStore();

    return (
        <Box
            sx={{
                minHeight: "100vh",

                background:
                    theme.palette.background.default,

                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
            }}
        >
            {/* theme toggle */}
            <ThemeToggle
                mode={mode}
                onToggle={toggleTheme}
            />

            {/* topbar */}
            <Box
                sx={{
                    height: 72,

                    px: 3,

                    borderBottom: `1px solid ${theme.palette.divider}`,

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",

                    flexShrink: 0,
                }}
            >
                {/* left */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: 26,
                            fontWeight: 800,

                            letterSpacing:
                                "-0.04em",
                        }}
                    >
                        Product Sprint
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 13,

                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            Board ID:
                        </Typography>

                        <Chip
                            label={boardId}
                            size="small"
                            sx={{
                                height: 24,

                                borderRadius:
                                    "999px",

                                background:
                                    theme.palette.mode ===
                                        "dark"
                                        ? "rgba(255,255,255,0.06)"
                                        : theme.palette.background.paper,

                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        />
                    </Stack>
                </Box>

                {/* actions */}
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Chip
                        icon={
                            <BoltOutlined
                                sx={{
                                    fontSize:
                                        "16px !important",
                                }}
                            />
                        }
                        label="Realtime active"
                        sx={{
                            borderRadius: "999px",

                            background:
                                theme.palette.mode ===
                                    "dark"
                                    ? "rgba(232,72,85,0.12)"
                                    : "#FFF1F3",

                            color:
                                theme.palette.primary.main,

                            border:
                                "none",
                        }}
                    />

                    <AppButton
                        startIcon={<Add />}
                        sx={{
                            background:
                                theme.palette.primary.main,

                            color: "#fff",

                            "&:hover": {
                                background:
                                    theme.palette.primary.dark,
                            },
                        }}
                    >
                        New task
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
                    {columns.map((column) => (
                        <Box
                            key={column.title}
                            sx={{
                                width: 340,

                                display: "flex",
                                flexDirection:
                                    "column",

                                borderRadius:
                                    "20px",

                                background:
                                    theme.palette.background.paper,

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
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Typography
                                        sx={{
                                            fontSize:
                                                15,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {
                                            column.title
                                        }
                                    </Typography>

                                    <Chip
                                        label={
                                            column
                                                .tasks
                                                .length
                                        }
                                        size="small"
                                        sx={{
                                            height: 22,

                                            borderRadius:
                                                "999px",

                                            background:
                                                theme.palette.mode ===
                                                    "dark"
                                                    ? "rgba(255,255,255,0.05)"
                                                    : theme.palette.background.default,
                                        }}
                                    />
                                </Stack>

                                <Box
                                    sx={{
                                        width: 34,
                                        height: 34,

                                        borderRadius:
                                            "10px",

                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",

                                        cursor: "pointer",

                                        transition:
                                            "all 0.16s ease",

                                        "&:hover": {
                                            background:
                                                theme.palette.background.default,
                                        },
                                    }}
                                >
                                    <MoreHoriz
                                        fontSize="small"
                                    />
                                </Box>
                            </Box>

                            {/* tasks */}
                            <Box
                                sx={{
                                    flex: 1,

                                    p: 1.5,

                                    overflowY:
                                        "auto",
                                }}
                            >
                                <Stack spacing={1.5}>
                                    {column.tasks.map(
                                        (task) => (
                                            <AppCard
                                                key={
                                                    task
                                                }
                                                sx={{
                                                    p: 2,

                                                    cursor: "pointer",

                                                    background:
                                                        theme
                                                            .palette
                                                            .background
                                                            .default,

                                                    transition:
                                                        "all 0.18s ease",

                                                    "&:hover":
                                                    {
                                                        transform:
                                                            "translateY(-2px)",

                                                        borderColor:
                                                            theme
                                                                .palette
                                                                .primary
                                                                .main,
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 14,
                                                        fontWeight: 600,

                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {
                                                        task
                                                    }
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        mt: 1.5,

                                                        fontSize: 12,

                                                        color:
                                                            theme
                                                                .palette
                                                                .text
                                                                .secondary,
                                                    }}
                                                >
                                                    Updated
                                                    just
                                                    now
                                                </Typography>
                                            </AppCard>
                                        )
                                    )}

                                    {/* add task */}
                                    <Box
                                        sx={{
                                            p: 2,

                                            borderRadius:
                                                "16px",

                                            border: `1px dashed ${theme.palette.divider}`,

                                            display:
                                                "flex",

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
                                                "all 0.18s ease",

                                            "&:hover":
                                            {
                                                borderColor:
                                                    theme
                                                        .palette
                                                        .primary
                                                        .main,

                                                color:
                                                    theme
                                                        .palette
                                                        .primary
                                                        .main,

                                                background:
                                                    theme
                                                        .palette
                                                        .mode ===
                                                        "dark"
                                                        ? "rgba(232,72,85,0.08)"
                                                        : "#FFF7F8",
                                            },
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={
                                                1
                                            }
                                            alignItems="center"
                                        >
                                            <Add
                                                fontSize="small"
                                            />

                                            <Typography
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Add
                                                task
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default BoardPage;
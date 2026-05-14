import { useState } from "react";

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
    DashboardOutlined,
    FolderOutlined,
    MoreHoriz,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    AppButton,
    AppCard,
    ThemeToggle,
} from "../../components";
import logo from "../../assets/collabflow.svg";

import useThemeStore from "../../store/themeStore";
import CreateBoardModal from "../board/components/CreateBoardModal";
import Rail from "../../components/rail/Rail";

const boards = [
    {
        id: 1,
        name: "Product Sprint",
        tasks: 24,
        members: 5,
    },
    {
        id: 2,
        name: "Realtime Infrastructure",
        tasks: 13,
        members: 3,
    },
    {
        id: 3,
        name: "Design System",
        tasks: 8,
        members: 4,
    },
];

const WorkspacePage = () => {
    const theme = useTheme();

    const navigate = useNavigate();

    const { workspaceId } =
        useParams();

    const { mode, toggleTheme } =
        useThemeStore();

    const [
        openCreateBoard,
        setOpenCreateBoard,
    ] = useState(false);

    return (
        <Box
            sx={{
                minHeight: "100vh",

                display: "flex",

                background:
                    theme.palette.background.default,
            }}
        >
            {/* theme toggle */}
            <ThemeToggle
                mode={mode}
                onToggle={toggleTheme}
            />

            {/* rail */}
            <Rail activeIndex={1} />

            {/* main */}
            <Box
                sx={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* topbar */}
                <Box
                    sx={{
                        height: 78,

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
                                fontSize: 30,
                                fontWeight: 800,

                                letterSpacing:
                                    "-0.04em",
                            }}
                        >
                            Workspace
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                mb: .8,
                                ml: .5
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    display: "flex",
                                    alignItems: "center",
                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                Workspace ID:
                            </Typography>

                            <Chip
                                label={workspaceId}
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
                                borderRadius:
                                    "999px",

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
                            onClick={() =>
                                setOpenCreateBoard(
                                    true
                                )
                            }
                            sx={{
                                background:
                                    theme.palette.primary.main,

                                color: theme.palette.text.default,

                                "&:hover": {
                                    background:
                                        theme.palette.primary.dark,
                                },
                            }}
                        >
                            New board
                        </AppButton>
                    </Stack>
                </Box>

                {/* content */}
                <Box
                    sx={{
                        flex: 1,

                        p: 3,

                        overflowY: "auto",
                    }}
                >
                    {/* heading */}
                    <Box
                        sx={{
                            mb: 4,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 36,
                                fontWeight: 800,

                                letterSpacing:
                                    "-0.05em",
                            }}
                        >
                            Boards
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,

                                fontSize: 15,

                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            Manage collaborative
                            boards and realtime task
                            workflows.
                        </Typography>
                    </Box>

                    {/* board grid */}
                    <Box
                        sx={{
                            display: "flex",

                            gap: 2,

                            flexWrap: "wrap",
                        }}
                    >
                        {/* create board */}
                        <Box
                            onClick={() =>
                                setOpenCreateBoard(
                                    true
                                )
                            }
                            sx={{
                                width: 320,
                                height: 200,

                                borderRadius:
                                    "24px",

                                border: `1px dashed ${theme.palette.divider}`,

                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",

                                cursor: "pointer",

                                transition:
                                    "all 0.18s ease",

                                background:
                                    theme.palette.mode ===
                                        "dark"
                                        ? "rgba(255,255,255,0.02)"
                                        : theme.palette.background.paper,

                                "&:hover": {
                                    borderColor:
                                        theme.palette.primary.main,

                                    background:
                                        theme.palette.mode ===
                                            "dark"
                                            ? "rgba(232,72,85,0.08)"
                                            : "#FFF7F8",
                                },
                            }}
                        >
                            <Stack
                                spacing={1.5}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,

                                        borderRadius:
                                            "16px",

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        background:
                                            theme
                                                .palette
                                                .mode ===
                                                "dark"
                                                ? "rgba(232,72,85,0.14)"
                                                : "#FFF1F3",

                                        color:
                                            theme
                                                .palette
                                                .primary
                                                .main,
                                    }}
                                >
                                    <Add />
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                    }}
                                >
                                    Create board
                                </Typography>
                            </Stack>
                        </Box>

                        {/* boards */}
                        {boards.map((board) => (
                            <AppCard
                                key={board.id}
                                onClick={() =>
                                    navigate(
                                        `/workspace/${workspaceId}/board/${board.id}`
                                    )
                                }
                                sx={{
                                    width: 320,
                                    height: 200,

                                    p: 2.5,

                                    cursor: "pointer",

                                    background:
                                        theme.palette.background.paper,

                                    transition:
                                        "all 0.18s ease",

                                    "&:hover": {
                                        transform:
                                            "translateY(-3px)",

                                        borderColor:
                                            theme.palette.primary.main,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        height: "100%",

                                        display: "flex",
                                        flexDirection:
                                            "column",

                                        justifyContent:
                                            "space-between",
                                    }}
                                >
                                    {/* top */}
                                    <Box
                                        sx={{
                                            display:
                                                "flex",

                                            justifyContent:
                                                "space-between",

                                            alignItems:
                                                "flex-start",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 52,
                                                height: 52,

                                                borderRadius:
                                                    "16px",

                                                background:
                                                    theme
                                                        .palette
                                                        .mode ===
                                                        "dark"
                                                        ? "rgba(232,72,85,0.14)"
                                                        : "#FFF1F3",

                                                color:
                                                    theme
                                                        .palette
                                                        .primary
                                                        .main,

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",
                                            }}
                                        >
                                            <FolderOutlined />
                                        </Box>

                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,

                                                borderRadius:
                                                    "12px",

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                color:
                                                    theme
                                                        .palette
                                                        .text
                                                        .secondary,

                                                "&:hover":
                                                {
                                                    background:
                                                        theme
                                                            .palette
                                                            .background
                                                            .default,
                                                },
                                            }}
                                        >
                                            <MoreHoriz fontSize="small" />
                                        </Box>
                                    </Box>

                                    {/* bottom */}
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize:
                                                    22,

                                                fontWeight: 800,

                                                letterSpacing:
                                                    "-0.04em",
                                            }}
                                        >
                                            {
                                                board.name
                                            }
                                        </Typography>

                                        <Stack
                                            direction="row"
                                            spacing={
                                                1
                                            }
                                            sx={{
                                                mt: 1.5,
                                            }}
                                        >
                                            <Chip
                                                label={`${board.tasks} tasks`}
                                                size="small"
                                            />

                                            <Chip
                                                label={`${board.members} members`}
                                                size="small"
                                            />
                                        </Stack>
                                    </Box>
                                </Box>
                            </AppCard>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* modal */}
            <CreateBoardModal
                open={openCreateBoard}
                onClose={() =>
                    setOpenCreateBoard(false)
                }
            />
        </Box>
    );
};

export default WorkspacePage;
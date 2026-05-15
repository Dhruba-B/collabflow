import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
    Box,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";

import {
    Add,
    BoltOutlined,
    DeleteOutlined,
    FolderOutlined,
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

import useThemeStore from "../../store/themeStore";
import CreateBoardModal from "../../modules/board/components/CreateBoardModal";
import Rail from "../../components/rail/Rail";
import {
    useDeleteBoard,
    useWorkspaceBoards,
} from "../../modules/board/boardHooks";
import { useWorkspace } from "../../modules/workspace/workspaceHooks";
import { registerWorkspaceRealtime } from "../../services/socket/workspaceRealtime";

const WorkspacePage = () => {
    const theme = useTheme();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { workspaceId } =
        useParams();

    const {
        data: boards = [],
        isLoading: boardsLoading,
    } = useWorkspaceBoards(workspaceId);

    const deleteBoardMutation =
        useDeleteBoard();

    const {
        data: workspace,
    } = useWorkspace(workspaceId);

    const { mode, toggleTheme } =
        useThemeStore();

    const [
        openCreateBoard,
        setOpenCreateBoard,
    ] = useState(false);

    useEffect(() => {
        return registerWorkspaceRealtime({
            workspaceId,
            queryClient,
        });
    }, [workspaceId, queryClient]);

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
                            {workspace?.name || "Workspace1"}
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
                                        theme.palette.mode === theme.palette.background.paper,

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

                                background: alpha(theme.palette.secondary.main, 0.50),

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

                                background: theme.palette.background.paper,

                                "&:hover": {
                                    borderColor:
                                        theme.palette.primary.main,

                                    background: alpha(theme.palette.primary.main, 0.16),
                                },
                            }}
                        >
                            <Stack
                                spacing={1.5}
                                alignItems="center"
                                sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 1.5 }}
                            >
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        alignSelf: "center",
                                        borderRadius:
                                            "16px",

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        background: theme.palette.primary.soft,

                                        color: theme.palette.primary.main,

                                        "&:hover": {
                                            background: theme.palette.primary.main,
                                            color: theme.palette.text.default,
                                        }
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
                        {boardsLoading && (
                            <Typography
                                sx={{
                                    fontSize: 14,

                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                Loading boards...
                            </Typography>
                        )}

                        {!boardsLoading && boards.map((board) => (
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

                                                background: alpha(theme.palette.secondary.main, 0.16),
                                                border: `2px solid ${theme.palette.primary.light}`,
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
                                            onClick={(event) => {
                                                event.stopPropagation();

                                                deleteBoardMutation.mutate(
                                                    {
                                                        boardId:
                                                            board.id,
                                                        workspaceId,
                                                    }
                                                );
                                            }}
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
                                                        .primary
                                                        .main,

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
                                                label={`${board?._count?.columns || 0} columns`}
                                                size="small"
                                            />

                                            <Chip
                                                label="Workspace board"
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
                workspaceId={workspaceId}
            />
        </Box >
    );
};

export default WorkspacePage;

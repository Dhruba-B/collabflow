import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import {
    Add,
    DeleteOutlined,
    FolderSharedOutlined,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";

import {
    AppButton,
    AppCard,
} from "../../components";

import {
    useDeleteWorkspace,
    useWorkspaces,
} from "../../modules/workspace/workspaceHooks";
import { useSharedBoards } from "../../modules/board/boardHooks";
import CreateWorkspaceModal from "../../modules/workspace/components/CreateWorkspaceModal";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Rail from "../../components/rail/Rail";
import { registerWorkspaceListRealtime } from "../../services/socket/workspaceRealtime";

const DashboardPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: workspaces } = useWorkspaces();
    const {
        data: sharedBoards = [],
        isLoading: sharedBoardsLoading,
    } = useSharedBoards();
    const deleteWorkspaceMutation =
        useDeleteWorkspace();
    const [
        openCreateWorkspace,
        setOpenCreateWorkspace,
    ] = useState(false);

    useEffect(() => {
        return registerWorkspaceListRealtime({
            queryClient,
        });
    }, [queryClient]);

    return (
        <Box
            sx={{
                minHeight: "100dvh",

                display: "flex",
                flexDirection: {
                    xs: "column",
                    md: "row",
                },

                background:
                    theme.palette.background.default,
                pb: {
                    xs: "calc(64px + env(safe-area-inset-bottom))",
                    md: 0,
                },
            }}
        >
            {/* rail */}
            <Rail activeIndex={0} />

            {/* sidebar */}
            <Box
                sx={{
                    width: {
                        xs: "100%",
                        md: 260,
                    },

                    borderRight: {
                        xs: "none",
                        md: `1px solid ${theme.palette.divider}`,
                    },
                    borderBottom: {
                        xs: `1px solid ${theme.palette.divider}`,
                        md: "none",
                    },

                    p: {
                        xs: 2,
                        sm: 2.5,
                        md: 2,
                    },
                    pt: {
                        xs: "calc(16px + env(safe-area-inset-top))",
                        md: 2,
                    },
                    flexShrink: 0,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 700,

                        textTransform: "uppercase",

                        letterSpacing: "0.08em",

                        color:
                            theme.palette.text.secondary,

                        mb: 2,
                    }}
                >
                    My Workspaces
                </Typography>

                <Stack
                    direction={{
                        xs: "row",
                        md: "column",
                    }}
                    spacing={1}
                    sx={{
                        mx: {
                            xs: -0.5,
                            md: 0,
                        },
                        px: {
                            xs: 0.5,
                            md: 0,
                        },
                        overflowX: {
                            xs: "auto",
                            md: "visible",
                        },
                        WebkitOverflowScrolling: "touch",
                        scrollSnapType: {
                            xs: "x proximity",
                            md: "none",
                        },
                    }}
                >
                    {workspaces?.map((workspace) => (
                        <Box
                            key={workspace.id}
                            onClick={() => {
                                navigate(`/workspace/${workspace.id}`)
                            }}
                            sx={{
                                p: 1.5,
                                minWidth: {
                                    xs: 220,
                                    md: 0,
                                },

                                borderRadius: "14px",

                                cursor: "pointer",

                                transition: "all 0.18s ease",
                                scrollSnapAlign: "start",

                                "&:hover": {
                                    background:
                                        theme.palette.background.paper,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent:
                                        "space-between",
                                    gap: 1,
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {workspace.name}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 12,

                                            mt: 0.5,

                                            color:
                                                theme.palette.text.secondary,
                                        }}
                                    >
                                        {workspace?._count?.boards || 0} active boards
                                    </Typography>
                                </Box>

                                <Box
                                    onClick={(event) => {
                                        event.stopPropagation();

                                        deleteWorkspaceMutation.mutate(
                                            {
                                                workspaceId:
                                                    workspace.id,
                                            }
                                        );
                                    }}
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent:
                                            "center",
                                        color:
                                            theme.palette.primary.main,
                                        transition:
                                            "all 0.16s ease",

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
                        </Box>
                    ))}
                </Stack>

                <AppButton
                    fullWidth
                    startIcon={<Add />}
                    onClick={() => setOpenCreateWorkspace(true)}
                    sx={{
                        mt: {
                            xs: 2,
                            md: 3,
                        },

                        background:
                            theme.palette.primary.main,

                        color: theme.palette.text.default,

                        "&:hover": {
                            background:
                                theme.palette.primary.dark,
                        },
                    }}
                >
                    New Workspace
                </AppButton>
            </Box>

            {/* main */}
            <Box
                sx={{
                    flex: 1,

                    width: "100%",
                    minWidth: 0,

                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                {/* top */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            md: "center",
                        },
                        justifyContent:
                            "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 1.5,

                        mb: {
                            xs: 2.5,
                            md: 4,
                        },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 28,
                                    sm: 32,
                                    md: 34,
                                },
                                fontWeight: 800,

                                letterSpacing:
                                    "-0.04em",
                            }}
                        >
                            Welcome back
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: {
                                    xs: 14,
                                    md: 16,
                                },

                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            Here&apos;s an overview of
                            your workspace activity.
                        </Typography>
                    </Box>
                </Box>

                {/* cards */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                            lg: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: 2,
                    }}
                >
                    {[
                        {
                            title: "Open Tasks",
                            value: "48",
                        },
                        {
                            title: "Boards",
                            value: "12",
                        },
                        {
                            title: "Realtime Events",
                            value: "1.2k",
                        },
                    ].map((card) => (
                        <AppCard
                            key={card.title}
                            sx={{
                                minWidth: 0,

                                p: {
                                    xs: 2,
                                    md: 3,
                                },

                                background:
                                    theme.palette.background.paper,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,

                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                {card.title}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1,

                                    fontSize: {
                                        xs: 30,
                                        md: 36,
                                    },
                                    fontWeight: 800,

                                    letterSpacing:
                                        "-0.04em",
                                }}
                            >
                                {card.value}
                            </Typography>
                        </AppCard>
                    ))}
                </Box>

                <AppCard
                    sx={{
                        mt: {
                            xs: 2,
                            md: 3,
                        },
                        p: {
                            xs: 2,
                            md: 3,
                        },
                        background:
                            theme.palette.background.paper,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        Shared boards
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, minmax(0, 1fr))",
                                xl: "repeat(3, minmax(0, 1fr))",
                            },
                            gap: 1.5,
                        }}
                    >
                        {sharedBoardsLoading && (
                            <Typography
                                sx={{
                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                Loading shared boards...
                            </Typography>
                        )}

                        {!sharedBoardsLoading && sharedBoards.length === 0 && (
                            <Typography
                                sx={{
                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                Boards shared with you will appear here.
                            </Typography>
                        )}

                        {!sharedBoardsLoading && sharedBoards.map((board) => (
                            <Box
                                key={board.id}
                                onClick={() =>
                                    navigate(
                                        `/workspace/${board.workspaceId}/board/${board.id}`
                                    )
                                }
                                sx={{
                                    p: 2,
                                    borderRadius: "14px",
                                    border: `1px solid ${theme.palette.divider}`,
                                    cursor: "pointer",
                                    minWidth: 0,
                                    transition: "all 0.18s ease",
                                    "&:hover": {
                                        borderColor:
                                            theme.palette.primary.main,
                                        background:
                                            theme.palette.background.default,
                                    },
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1.25}
                                    alignItems="flex-start"
                                >
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            background:
                                                theme.palette.primary.soft,
                                            color:
                                                theme.palette.primary.main,
                                        }}
                                    >
                                        <FolderSharedOutlined fontSize="small" />
                                    </Box>

                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontSize: 15,
                                                fontWeight: 700,
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {board.name}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                fontSize: 12,
                                                color:
                                                    theme.palette.text.secondary,
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {board.workspace?.name} · {board.access?.role}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        ))}
                    </Box>
                </AppCard>

                {/* activity */}
                <AppCard
                    sx={{
                        mt: {
                            xs: 2,
                            md: 3,
                        },

                        p: {
                            xs: 2,
                            md: 3,
                        },

                        background:
                            theme.palette.background.paper,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 700,

                            mb: 3,
                        }}
                    >
                        Recent activity
                    </Typography>

                    <Stack spacing={2}>
                        {[
                            "Priya moved a task to In Progress",
                            "Marcus created Sprint Board",
                            "Realtime sync deployed successfully",
                        ].map((item) => (
                            <Box
                                key={item}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,

                                        borderRadius:
                                            "50%",

                                        background:
                                            theme.palette.primary.main,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        color:
                                            theme.palette.text.secondary,
                                    }}
                                >
                                    {item}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </AppCard>
            </Box>
            <CreateWorkspaceModal
                open={openCreateWorkspace}
                onClose={() =>
                    setOpenCreateWorkspace(false)
                }
            />
        </Box>
    );
};

export default DashboardPage;

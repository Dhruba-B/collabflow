import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import {
    Add,
    DeleteOutlined,
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
                minHeight: "100vh",

                display: "flex",

                background:
                    theme.palette.background.default,
            }}
        >
            {/* rail */}
            <Rail activeIndex={0} />

            {/* sidebar */}
            <Box
                sx={{
                    width: 260,

                    borderRight: `1px solid ${theme.palette.divider}`,

                    p: 2,
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

                <Stack spacing={1}>
                    {workspaces?.map((workspace) => (
                        <Box
                            key={workspace.id}
                            onClick={() => {
                                navigate(`/workspace/${workspace.id}`)
                            }}
                            sx={{
                                p: 1.5,

                                borderRadius: "14px",

                                cursor: "pointer",

                                transition: "all 0.18s ease",

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
                        mt: 3,

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

                    p: 4,
                }}
            >
                {/* top */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",

                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 34,
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
                        display: "flex",
                        gap: 2,

                        flexWrap: "wrap",
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
                                flex: 1,

                                minWidth: 220,

                                p: 3,

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

                                    fontSize: 36,
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

                {/* activity */}
                <AppCard
                    sx={{
                        mt: 3,

                        p: 3,

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

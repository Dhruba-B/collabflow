import {
    Box,
    Chip,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowForward,
    BoltOutlined,
    HubOutlined,
    KeyboardCommandKey,
    SyncOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/collabflow.svg";

import {
    AppButton,
    AppCard,
    ThemeToggle,
} from "../../components";

import useThemeStore from "../../store/themeStore";

const features = [
    {
        icon: <SyncOutlined fontSize="small" />,
        title: "Realtime collaboration",
        description:
            "Instant board synchronization with websocket-powered updates.",
    },
    {
        icon: <BoltOutlined fontSize="small" />,
        title: "Optimistic workflows",
        description:
            "Fast interactions designed for modern productivity systems.",
    },
    {
        icon: <HubOutlined fontSize="small" />,
        title: "Scalable architecture",
        description:
            "Built with modular frontend and distributed realtime patterns.",
    },
];

const HomePage = () => {
    const navigate = useNavigate();

    const theme = useTheme();

    const { mode, toggleTheme } =
        useThemeStore();

    return (
        <Box
            sx={{
                minHeight: "100vh",

                background:
                    theme.palette.background.default,

                position: "relative",

                overflow: "hidden",
            }}
        >

            {/* glow */}
            <Box
                sx={{
                    position: "absolute",

                    top: -180,
                    right: -120,

                    width: 420,
                    height: 420,

                    borderRadius: "50%",

                    background:
                        "radial-gradient(circle, rgba(232,72,85,0.18), transparent 70%)",

                    pointerEvents: "none",
                }}
            />

            <Container
                maxWidth="xl"
                sx={{
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* navbar */}
                <Box
                    sx={{
                        height: 80,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="CollabFlow Logo"
                            sx={{
                                width: 40,
                                height: 40,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 700,

                                letterSpacing: "-0.03em",
                            }}
                        >
                            CollabFlow
                        </Typography>
                    </Stack>

                    <AppButton
                        onClick={() =>
                            navigate("/login")
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
                        Sign in
                    </AppButton>
                </Box>

                {/* hero */}
                <Box
                    sx={{
                        pt: {
                            xs: 8,
                            md: 14,
                        },

                        pb: 12,

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",

                        textAlign: "center",
                    }}
                >
                    <Chip
                        label="Realtime collaboration platform"
                        sx={{
                            mb: 3,

                            px: 1,

                            borderRadius: "999px",

                            background:
                                theme.palette.mode ===
                                    "dark"
                                    ? "rgba(255,255,255,0.05)"
                                    : "#fff",

                            border: `1px solid ${theme.palette.divider}`,

                            color:
                                theme.palette.text.secondary,
                        }}
                    />

                    <Typography
                        sx={{
                            maxWidth: 920,

                            fontSize: {
                                xs: 44,
                                md: 82,
                            },

                            lineHeight: 1,

                            fontWeight: 800,

                            letterSpacing: "-0.06em",

                            color:
                                theme.palette.text.primary,
                        }}
                    >
                        Collaborative workspaces built for{" "}

                        <Box
                            component="span"
                            sx={{
                                color:
                                    theme.palette.primary.main,
                            }}
                        >
                            realtime teams
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            mt: 3,

                            maxWidth: 720,

                            fontSize: {
                                xs: 16,
                                md: 20,
                            },

                            lineHeight: 1.7,

                            color:
                                theme.palette.text.secondary,
                        }}
                    >
                        Plan projects, manage tasks,
                        and collaborate instantly with a
                        modern realtime workflow system
                        inspired by tools like Linear and
                        Notion.
                    </Typography>

                    {/* actions */}
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        sx={{
                            mt: 5,
                        }}
                    >
                        <AppButton
                            onClick={() =>
                                navigate("/register")
                            }
                            sx={{
                                height: 52,

                                px: 4,

                                background:
                                    theme.palette.primary.default,

                                color: theme.palette.text.default,

                                fontSize: 15,
                                fontWeight: 600,

                                "&:hover": {
                                    background:
                                        theme.palette.primary.dark,
                                },
                            }}
                        >
                            Get started
                        </AppButton>

                        <AppButton
                            variant="outlined"
                            sx={{
                                height: 52,

                                px: 4,

                                borderColor:
                                    theme.palette.divider,

                                color:
                                    theme.palette.text.primary,

                                background:
                                    theme.palette.background.paper,

                                "&:hover": {
                                    borderColor:
                                        theme.palette.primary.main,

                                    background:
                                        theme.palette.background.paper,
                                },
                            }}
                            endIcon={
                                <ArrowForward />
                            }
                        >
                            Explore features
                        </AppButton>
                    </Stack>

                    {/* command */}
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mt: 4,

                            color:
                                theme.palette.text.secondary,
                        }}
                    >
                        <KeyboardCommandKey
                            sx={{
                                fontSize: 18,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 14,
                            }}
                        >
                            Built for fast collaborative
                            workflows
                        </Typography>
                    </Stack>
                </Box>

                {/* feature cards */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,

                        flexWrap: "wrap",

                        pb: 10,
                    }}
                >
                    {features.map((feature) => (
                        <AppCard
                            key={feature.title}
                            sx={{
                                flex: 1,

                                minWidth: 280,

                                p: 3,

                                background:
                                    theme.palette.background.paper,

                                border:
                                    theme.palette.mode ===
                                        "dark"
                                        ? "1px solid rgba(255,255,255,0.06)"
                                        : `1px solid ${theme.palette.divider}`,

                                transition:
                                    "all 0.18s ease",

                                "&:hover": {
                                    transform:
                                        "translateY(-2px)",

                                    borderColor:
                                        theme.palette.primary.main,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,

                                    borderRadius: "12px",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",

                                    mb: 2,

                                    background:
                                        theme.palette.primary.soft,

                                    color:
                                        theme.palette.primary.main,
                                }}
                            >
                                {feature.icon}
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: 18,
                                    fontWeight: 700,

                                    mb: 1,
                                }}
                            >
                                {feature.title}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 14,

                                    lineHeight: 1.7,

                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                {
                                    feature.description
                                }
                            </Typography>
                        </AppCard>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;
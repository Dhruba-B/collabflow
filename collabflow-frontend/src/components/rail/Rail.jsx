import { Box } from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
    DashboardOutlined,
    FolderOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import logo from "../../assets/collabflow.svg";

const Rail = ({
    activeIndex = 0,
}) => {
    const theme = useTheme();

    const navigate = useNavigate();

    const items = [
        {
            icon: <DashboardOutlined />,
            path: "/dashboard",
        },
        {
            icon: <FolderOutlined />,
            path: null,
        },
    ];

    return (
        <Box
            sx={{
                width: {
                    xs: "100%",
                    md: 74,
                },
                height: {
                    xs: "calc(64px + env(safe-area-inset-bottom))",
                    md: "100vh",
                },

                borderRight: {
                    xs: "none",
                    md: `1px solid ${theme.palette.divider}`,
                },
                borderTop: {
                    xs: `1px solid ${theme.palette.divider}`,
                    md: "none",
                },

                display: "flex",
                flexDirection: {
                    xs: "row",
                    md: "column",
                },
                alignItems: "center",
                justifyContent: {
                    xs: "center",
                    md: "flex-start",
                },

                py: {
                    xs: 1,
                    md: 2,
                },
                pb: {
                    xs: "calc(8px + env(safe-area-inset-bottom))",
                    md: 2,
                },
                px: {
                    xs: 1.5,
                    md: 0,
                },
                gap: {
                    xs: 1,
                    md: 1.5,
                },

                flexShrink: 0,
                position: {
                    xs: "fixed",
                    md: "static",
                },
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: {
                    xs: theme.zIndex.appBar,
                    md: "auto",
                },
                background: theme.palette.background.default,
            }}
        >

            <Box
                component="img"
                src={logo}
                alt="CollabFlow Logo"
                sx={{
                    width: 40,
                    height: 40,

                    mb: 1.5,
                    display: {
                        xs: "none",
                        md: "block",
                    },
                }}
            />


            {items.map((item, index) => {
                const isActive =
                    activeIndex === index;

                return (
                    <Box
                        key={index}
                        onClick={() => {
                            if (item.path) {
                                navigate(
                                    item.path
                                );
                            }
                        }}
                        sx={{
                            width: {
                                xs: 48,
                                md: 46,
                            },
                            height: {
                                xs: 48,
                                md: 46,
                            },

                            borderRadius: "14px",

                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",

                            color: isActive
                                ? theme.palette.text.default
                                : theme.palette.text.secondary,

                            background: isActive
                                ? theme.palette
                                    .primary.main
                                : "transparent",

                            cursor: item.path
                                ? "pointer"
                                : "default",

                            transition:
                                "all 0.18s ease",

                            "&:hover": {
                                background:
                                    isActive
                                        ? theme.palette.primary.main
                                        : theme.palette.mode === "dark"
                                            ? theme.palette.primary.soft
                                            : "#FFF1F3",
                            },
                        }}
                    >
                        {item.icon}
                    </Box>
                );
            })}
        </Box>
    );
};

export default Rail;

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
                width: 74,

                borderRight: `1px solid ${theme.palette.divider}`,

                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                py: 2,
                gap: 1.5,

                flexShrink: 0,
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
                            width: 46,
                            height: 46,

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
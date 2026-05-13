import {
    Box,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    GitHub,
    Google,
    MoreHoriz,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

import AppCard from "../../components/card/AppCard";
import AppButton from "../../components/button/AppButton";
import AppInput from "../../components/input/AppInput";
import useThemeStore from "../../store/themeStore";
import { ThemeToggle } from "../../components";

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { mode, toggleTheme } = useThemeStore();

    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: theme.palette.background.default,

                px: 2,
                py: 4,
            }}
        >
            <ThemeToggle
                mode={mode}
                onToggle={toggleTheme}
            />
            <AppCard
                sx={{
                    width: "100%",
                    maxWidth: 520,

                    p: 2.5,

                    borderRadius: "22px",

                    background: theme.palette.background.default,

                    border: `1px solid ${theme.palette.divider}`,

                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
            >
                <Stack spacing={3}>
                    {/* top */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",

                            p: 0.6,

                            borderRadius: "16px",

                            background: theme.palette.background.paper,

                            border: `1px solid ${theme.palette.divider}`,

                            gap: 0.75,
                        }}
                    >
                        {/* Sign In */}
                        <Box
                            sx={{
                                flex: 1,

                                height: 48,

                                borderRadius: "12px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                position: "relative",

                                background: theme.palette.primary.main,

                                color: theme.palette.background.default,

                                fontSize: 14,
                                fontWeight: 600,

                                boxShadow: "0 8px 20px rgba(232,72,85,0.22)",

                                overflow: "hidden",

                                "&::before": {
                                    content: '""',

                                    position: "absolute",
                                    inset: 0,

                                    background:
                                        "linear-gradient(to bottom, rgba(255,255,255,0.16), transparent)",

                                    pointerEvents: "none",
                                },
                            }}
                        >
                            Sign in
                        </Box>

                        {/* Active Tab */}
                        <Box
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/register");
                            }}
                            sx={{
                                flex: 1,

                                height: 48,

                                borderRadius: "12px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                fontSize: 14,
                                fontWeight: 600,

                                color: theme.palette.text.primary,

                                cursor: "pointer",

                                transition: "all 0.18s ease",

                                "&:hover": {
                                    background: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                },
                            }}
                        >
                            Create account
                        </Box>
                    </Box>

                    {/* badge */}
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,

                            px: 1.2,
                            py: 0.5,

                            width: "fit-content",

                            borderRadius: "8px",

                            background: "#EEF4E7",

                            color: "#4D7C0F",

                            fontSize: 12,
                            fontFamily: "Geist Mono, monospace",
                        }}
                    >
                        • All systems operational
                    </Box>

                    {/* heading */}
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 38,
                                fontWeight: 700,
                                letterSpacing: "-0.04em",

                                color:
                                    theme.palette.text.primary,
                            }}
                        >
                            Welcome back
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,

                                fontSize: 16,

                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            Sign in to your workspace to continue.
                        </Typography>
                    </Box>

                    {/* oauth */}
                    <Stack
                        direction="row"
                        spacing={1.5}
                    >
                        <AppButton
                            fullWidth
                            variant="outlined"
                            startIcon={<Google />}
                            sx={{
                                background:
                                    theme.palette.background.default,

                                borderColor:
                                    theme.palette.divider,

                                color:
                                    theme.palette.text.primary,

                                "&:hover": {
                                    borderColor:
                                        theme.palette.divider,

                                    background:
                                        theme.palette.background.paper,
                                },
                            }}
                        >
                            Google
                        </AppButton>

                        <AppButton
                            fullWidth
                            variant="outlined"
                            startIcon={<GitHub />}
                            sx={{
                                background:
                                    theme.palette.background.default,

                                borderColor:
                                    theme.palette.divider,

                                color:
                                    theme.palette.text.primary,

                                "&:hover": {
                                    borderColor:
                                        theme.palette.divider,

                                    background:
                                        theme.palette.background.paper,
                                },
                            }}
                        >
                            GitHub
                        </AppButton>
                    </Stack>

                    {/* divider */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                    >
                        <Divider sx={{ flex: 1 }} />

                        <Typography
                            sx={{
                                fontSize: 13,
                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            or
                        </Typography>

                        <Divider sx={{ flex: 1 }} />
                    </Stack>

                    {/* form */}
                    <Stack spacing={2}>
                        <Box>
                            <Typography
                                sx={{
                                    mb: 1,

                                    fontSize: 14,
                                    fontWeight: 500,

                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                Work email
                            </Typography>

                            <AppInput
                                placeholder="you@company.com"
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    mb: 1,

                                    fontSize: 14,
                                    fontWeight: 500,

                                    color:
                                        theme.palette.text.secondary,
                                }}
                            >
                                Password
                            </Typography>

                            <AppInput
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="••••••••"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </Stack>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Typography
                            component={Link}
                            to="/forgot-password"
                            sx={{
                                fontSize: 14,

                                color:
                                    theme.palette.primary.main,

                                textDecoration: "none",

                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Forgot password?
                        </Typography>
                    </Box>

                    {/* submit */}
                    <AppButton
                        fullWidth
                        sx={{
                            height: 52,

                            borderRadius: "14px",

                            background:
                                theme.palette.primary.main,

                            color:
                                theme.palette.background.default,

                            fontSize: 16,
                            fontWeight: 600,

                            "&:hover": {
                                background:
                                    theme.palette.primary.dark,
                                opacity: 0.92,
                            },
                        }}
                    >
                        Sign in →
                    </AppButton>

                    {/* footer */}
                    <Typography
                        sx={{
                            textAlign: "center",

                            fontSize: 14,

                            color:
                                theme.palette.text.secondary,
                        }}
                    >
                        No account yet?{" "}

                        <Link
                            to="/register"
                            style={{
                                color:
                                    theme.palette.primary.main,

                                textDecoration: "none",

                                fontWeight: 500,
                            }}
                        >
                            Create one — it&apos;s free
                        </Link>
                    </Typography>
                </Stack>
            </AppCard>
        </Box>
    );
};

export default LoginPage;
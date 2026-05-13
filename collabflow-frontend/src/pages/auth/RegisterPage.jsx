import {
    Box,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import { Link, useNavigate } from "react-router-dom";

import {
    GitHub,
    Google,
} from "@mui/icons-material";

import AppCard from "../../components/card/AppCard";
import AppButton from "../../components/button/AppButton";
import AppInput from "../../components/input/AppInput";

const RegisterPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background:
                    theme.palette.background.default,

                px: 2,
                py: 4,
            }}
        >
            <AppCard
                sx={{
                    width: "100%",
                    maxWidth: 520,

                    p: 2.5,

                    borderRadius: "22px",

                    background:
                        theme.palette.background.default,

                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Stack spacing={3}>
                    {/* tabs */}
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
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
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
                            Sign in
                        </Box>

                        {/* Active Tab */}
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
                            Create account
                        </Box>
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
                            Create account
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,

                                fontSize: 16,

                                color:
                                    theme.palette.text.secondary,
                            }}
                        >
                            Start collaborating with your team.
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
                                Full name
                            </Typography>

                            <AppInput
                                placeholder="John Doe"
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
                                type="password"
                                placeholder="Create password"
                            />
                        </Box>
                    </Stack>

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
                                background: theme.palette.primary.dark,
                                opacity: 0.92,
                            },
                        }}
                    >
                        Create account →
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
                        Already have an account?{" "}

                        <Link
                            to="/login"
                            style={{
                                color:
                                    theme.palette.primary.main,

                                textDecoration: "none",

                                fontWeight: 500,
                            }}
                        >
                            Sign in
                        </Link>
                    </Typography>
                </Stack>
            </AppCard>
        </Box >
    );
};

export default RegisterPage;
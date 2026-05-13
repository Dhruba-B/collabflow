import { Button } from "@mui/material";

const AppButton = ({
    children,
    variant = "contained",
    size = "medium",
    fullWidth = false,
    sx = {},
    ...props
}) => {
    return (
        <Button
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            disableElevation
            sx={{
                height: 44,
                px: 2.5,

                borderRadius: 3,

                textTransform: "none",

                fontWeight: 600,
                fontSize: 14,

                boxShadow: "none",

                transition: "all 0.16s ease",

                "&:hover": {
                    boxShadow: "none",
                },

                ...(variant === "outlined" && {
                    borderWidth: 1,
                }),

                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default AppButton;

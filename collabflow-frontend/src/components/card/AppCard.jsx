import { Paper } from "@mui/material";

const AppCard = ({
    children,
    sx = {},
    ...props
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                backgroundImage: "none",

                borderRadius: "18px",

                border: "1px solid",
                borderColor: "divider",

                ...sx,
            }}
            {...props}
        >
            {children}
        </Paper>
    );
};

export default AppCard;
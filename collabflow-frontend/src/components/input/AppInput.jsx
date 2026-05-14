import { TextField } from "@mui/material";

const AppInput = ({
    sx = {},
    ...props
}) => {
    return (
        <TextField
            fullWidth
            variant="outlined"
            size="small"
            sx={{
                "& .MuiOutlinedInput-root": {
                    minHeight: 48,

                    borderRadius: "12px",

                    fontSize: 15,

                    transition: "all 0.16s ease",

                    "& fieldset": {
                        borderColor: "divider",
                        transition: "all 0.16s ease",
                    },

                    "&:hover fieldset": {
                        borderColor: "primary.main",
                    },

                    "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                        borderWidth: "1px",
                    },
                },

                "& .MuiInputBase-input": {
                    px: 1.6,
                    py: 1.4,
                },

                "& .MuiInputAdornment-root": {
                    mr: 0.5,
                },

                "& .MuiInputLabel-root": {
                    fontSize: 14,
                },

                "& .MuiInputLabel-root.Mui-focused":
                {
                    color: "primary.main",
                },

                ...sx,
            }}
            {...props}
        />
    );
};

export default AppInput;
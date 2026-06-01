import { useState } from "react";
import {
    Box,
    Dialog,
    Fade,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import {
    Close,
    DeleteOutlined,
    GroupsOutlined,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { AppButton, AppInput } from "../../../components";
import {
    useAddBoardCollaborator,
    useBoardCollaborators,
    useRemoveBoardCollaborator,
    useUpdateBoardCollaborator,
} from "../collaborationHooks";

const editableRoles = ["EDITOR", "VIEWER"];

const CollaboratorsModal = ({ boardId, canManage, open, onClose }) => {
    const theme = useTheme();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("EDITOR");

    const { data: collaborators = [], isLoading } = useBoardCollaborators(
        boardId,
        open
    );
    const addCollaboratorMutation = useAddBoardCollaborator();
    const updateCollaboratorMutation = useUpdateBoardCollaborator();
    const removeCollaboratorMutation = useRemoveBoardCollaborator();

    const handleInvite = () => {
        if (!email.trim() || !canManage) {
            return;
        }

        addCollaboratorMutation.mutate(
            {
                boardId,
                email: email.trim(),
                role,
            },
            {
                onSuccess: () => setEmail(""),
            }
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Fade}
            slotProps={{
                paper: {
                    sx: {
                        width: "100%",
                        maxWidth: 620,
                        borderRadius: "24px",
                        background: theme.palette.background.default,
                        backgroundImage: "none",
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: "hidden",
                    },
                },
            }}
        >
            <Stack spacing={3} sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: theme.palette.primary.soft,
                                color: theme.palette.primary.main,
                            }}
                        >
                            <GroupsOutlined />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
                                Collaborators
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {canManage ? "Manage board access" : "Board access"}
                            </Typography>
                        </Box>
                    </Stack>

                    <Box
                        onClick={onClose}
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: theme.palette.text.secondary,
                            "&:hover": {
                                background: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                            },
                        }}
                    >
                        <Close fontSize="small" />
                    </Box>
                </Stack>

                {canManage && (
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.25}
                        alignItems={{ xs: "stretch", sm: "center" }}
                    >
                        <AppInput
                            placeholder="teammate@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <Select
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            size="small"
                            sx={{
                                minWidth: 128,
                                borderRadius: "12px",
                                background: theme.palette.background.paper,
                            }}
                        >
                            {editableRoles.map((nextRole) => (
                                <MenuItem key={nextRole} value={nextRole}>
                                    {nextRole}
                                </MenuItem>
                            ))}
                        </Select>
                        <AppButton
                            onClick={handleInvite}
                            disabled={addCollaboratorMutation.isPending}
                            sx={{
                                px: 2.5,
                                background: theme.palette.primary.main,
                                color: theme.palette.text.default,
                                "&:hover": {
                                    background: theme.palette.primary.dark,
                                },
                            }}
                        >
                            Add
                        </AppButton>
                    </Stack>
                )}

                <Stack spacing={1}>
                    {isLoading && (
                        <Typography sx={{ color: theme.palette.text.secondary }}>
                            Loading collaborators...
                        </Typography>
                    )}

                    {!isLoading &&
                        collaborators.map((collaborator) => (
                            <Stack
                                key={`${collaborator.role}:${collaborator.userId}`}
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{
                                    p: 1.5,
                                    borderRadius: "14px",
                                    background: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {collaborator.user?.name}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: theme.palette.text.secondary,
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {collaborator.user?.email}
                                    </Typography>
                                </Box>

                                {collaborator.role === "OWNER" || !canManage ? (
                                    <Typography
                                        sx={{
                                            width: 82,
                                            textAlign: "right",
                                            fontSize: 12,
                                            fontWeight: 800,
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        {collaborator.role}
                                    </Typography>
                                ) : (
                                    <>
                                        <Select
                                            value={collaborator.role}
                                            onChange={(event) =>
                                                updateCollaboratorMutation.mutate({
                                                    boardId,
                                                    userId: collaborator.userId,
                                                    role: event.target.value,
                                                })
                                            }
                                            size="small"
                                            sx={{
                                                width: 118,
                                                borderRadius: "12px",
                                            }}
                                        >
                                            {editableRoles.map((nextRole) => (
                                                <MenuItem key={nextRole} value={nextRole}>
                                                    {nextRole}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                        <Box
                                            onClick={() =>
                                                removeCollaboratorMutation.mutate({
                                                    boardId,
                                                    userId: collaborator.userId,
                                                })
                                            }
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                color: theme.palette.primary.main,
                                                "&:hover": {
                                                    background: theme.palette.primary.soft,
                                                },
                                            }}
                                        >
                                            <DeleteOutlined fontSize="small" />
                                        </Box>
                                    </>
                                )}
                            </Stack>
                        ))}
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default CollaboratorsModal;

import asyncHandler from "express-async-handler";
import { generateToken } from "../../utils/jwt.js";
import { createUser, loginUser } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";


export const register = asyncHandler(async (req, res) => {
    const validatedData = registerSchema.parse(req.body);

    const user = await createUser(validatedData);

    const token = generateToken({
        userId: user.id,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            token,
            user,
        },
    });
});

export const login = asyncHandler(async (req, res) => {
    const validatedData = loginSchema.parse(req.body);

    const user = await loginUser(validatedData);

    const token = generateToken({
        userId: user.id,
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token,
            user,
        },
    });
});
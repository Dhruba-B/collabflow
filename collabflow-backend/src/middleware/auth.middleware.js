import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";

const createUnauthorizedError = (message = "Unauthorized") => {
    const error = new Error(message);
    error.statusCode = 401;
    return error;
};

export const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createUnauthorizedError("Authentication token is required");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
        throw createUnauthorizedError("Invalid authentication token");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw createUnauthorizedError("Authenticated user no longer exists");
    }

    req.user = user;
    next();
});

export default authenticate;

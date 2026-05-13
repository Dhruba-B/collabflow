import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal server error";
    let errors;

    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation failed";
        errors = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Invalid or expired authentication token";
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export default errorHandler;

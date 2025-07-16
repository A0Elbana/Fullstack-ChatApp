import rateLimit from "express-rate-limit";

// Rate limiter 
export const authRateLimiter = rateLimit({
    // 15 minutes
    windowMs: 15 * 60 * 1000,
    // 10 requests
    max: 10,
    // Message to return when rate limit is exceeded
    message: {
        status: "fail",
        message: "Too many requests from this IP, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

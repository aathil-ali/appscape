const { RateLimiterMemory } = require('rate-limiter-flexible');
const { API_THROTTLE } = require('../utils/types')


// Create a rate limiter instance
const rateLimiter = new RateLimiterMemory({
    points: API_THROTTLE.MAX_REQUESTS, // Number of points
    duration: API_THROTTLE.MAX_DURATION_IN_SECONDS, // Per second
});

// Middleware function
async function rateLimiterMiddleware(req, res, next) {
    try {
        const { ip } = req; // Assuming the IP address is available in the request object

        // Consume a point from the rate limiter for the IP address
        // Consume a point from the rate limiter for the IP address
        const rateLimiterRes = await rateLimiter.consume(ip);

        // Set the additional rate limit headers in the response
        res.set({
            'Retry-After': rateLimiterRes.msBeforeNext / 1000,
            'X-RateLimit-Limit': rateLimiterRes.opts.points,
            'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
            'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext),
        });

        return next();
    } catch (error) {
        // Check if the error is due to rate limiting
        if (error.msBeforeNext) {
            const retryAfterSeconds = Math.ceil(error.msBeforeNext / 1000);
            return res
                .status(429)
                .header('Retry-After', retryAfterSeconds)
                .json({ error: 'Too Many Requests' });
        }

        console.error('Rate limiter error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { rateLimiterMiddleware };


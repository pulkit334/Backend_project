const rateLimitMap = new Map();
const WINDOW_SIZE = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 60;

const limiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  let entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    // First request or window expired → reset count
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_SIZE });
    return next();
  }

  // If exceeded max requests → send message immediately
  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).send("Too many requests, please try later");
  }

  // Otherwise increment count and continue
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  next();
};

module.exports = limiter;

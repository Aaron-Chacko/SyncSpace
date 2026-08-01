const buckets = new Map();

export function rateLimit({ windowMs, max, key = (req) => req.ip }) {
  return (req, res, next) => {
    const now = Date.now();
    const bucketKey = key(req);
    const current = buckets.get(bucketKey);
    const hits = !current || now >= current.resetAt ? 1 : current.hits + 1;
    const resetAt = !current || now >= current.resetAt ? now + windowMs : current.resetAt;
    buckets.set(bucketKey, { hits, resetAt });
    if (hits > max) {
      res.set("Retry-After", String(Math.ceil((resetAt - now) / 1000)));
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }
    return next();
  };
}

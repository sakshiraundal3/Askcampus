const jwt = require('jsonwebtoken');
module.exports = function auth(requiredRole) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Authentication token required' });
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && req.user.role !== requiredRole) return res.status(403).json({ error: 'Admin access required' });
      next();
    } catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
  };
};

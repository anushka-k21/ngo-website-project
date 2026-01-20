

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // Standardize comparison to lowercase
    if (!req.user || req.user.role.toLowerCase() !== requiredRole.toLowerCase()) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };
};

module.exports = roleMiddleware;

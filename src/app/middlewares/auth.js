const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.isAuthenticated = false;
    return res
      .status(401)
      .json({ error: "Acceso denegado, token no proporcionado" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.isAuthenticated = false;
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    req.isAuthenticated = true;
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

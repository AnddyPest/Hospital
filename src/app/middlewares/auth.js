const jwt = require("jsonwebtoken");
const JWT_SECRET = "nova-slug-1984-LR1358!";

const auth = (req, res, next) => {
  console.log("⚡ Auth middleware ejecutándose");
  console.log("📨 Headers recibidos:", req.headers);

  // Buscar token en header o en cookie
  const authHeader = req.headers["authorization"];
  const cookieToken = req.cookies ? req.cookies.auth_token : null;

  console.log("🔑 Encabezado de autorización:", authHeader);
  console.log(
    "🍪 Token en cookie:",
    cookieToken ? `${cookieToken.substring(0, 15)}...` : "no cookie"
  );

  // Preferir el token del header, si está disponible
  const token = (authHeader && authHeader.split(" ")[1]) || cookieToken;

  console.log(
    "🪙 Token extraído:",
    token ? `${token.substring(0, 15)}...` : "no token"
  );

  if (!token) {
    req.isAuthenticated = false;
    console.log("❌ No se proporcionó token");
    return res.status(401).json({
      error: "No token provided",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.isAuthenticated = false;
      console.log("❌ Token inválido:", err.message);
      return res.status(403).json({
        error: "Invalid token",
      });
    }

    console.log("✅ Token válido para usuario:", user.email || user.id);
    req.isAuthenticated = true;
    req.user = user;
    next();
  });
};

module.exports = auth;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const router = express.Router();

const JWT_SECRET = "nova-slug-1984-LR1358!";

// Inicio de sesión
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario por su correo electrónico
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" }); // Usuario no encontrado
    }

    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" }); // Contraseña incorrecta
    }

    // tokekn JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // devuelve el token
    res.json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Registro de usuario VER DE COLOCAR EL ID  de medico, enfermero, etc EN EL ENVIO A LA BASE DE DATOS
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hashea la contraseña
    const saltedPassword = await bcrypt.hash(password, 10);

    // Crea el nuevo usuario
    const newUser = await User.create({ email, password: saltedPassword });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

// verificar token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso denegado, token no proporcionado" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    req.user = user;
    next();
  });
};

// cerrar sesión
router.post("/logout", (req, res) => {
  //destruir sesion o token

  res.json({ message: "Sesión cerrada exitosamente" });
});

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Aquí validas las credenciales del usuario
  if (username === "admin" && password === "1234") {
    req.session.user = { username }; // Guarda la sesión del usuario
    return res.redirect("/"); // Redirige al inicio
  }

  res.status(401).send("Credenciales inválidas"); // Maneja errores de autenticación
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

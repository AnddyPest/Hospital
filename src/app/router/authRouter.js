const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Inicio de sesión
router.post("/login", authController.login);

// registro de usuarios
router.post("/register", authController.register);

// verificar token movido a carpeta middelwares para separar capas

// cerrar sesión
router.post("/logout", authController.logout);

module.exports = router;

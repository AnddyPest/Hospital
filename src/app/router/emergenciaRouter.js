const express = require("express");
const router = express.Router();
const emergenciaController = require("../controller/emergenciaController");

// Rutas para emergencias
//router.get("/", emergenciaController.listarEmergenciasView); // Añade esta vista si quieres
router.get("/", emergenciaController.nuevaEmergenciaView);
router.post("/crear", emergenciaController.crearEmergencia);

module.exports = router;

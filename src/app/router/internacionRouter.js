const express = require("express");
const router = express.Router();
const internacionController = require("../controller/internacionController");

// Rutas para internación
router.get("/asignar/:id", internacionController.asignarView);
router.post("/asignar", internacionController.asignar);
router.get("/lista", internacionController.listaView);

module.exports = router;

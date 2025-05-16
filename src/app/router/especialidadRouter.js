const express = require("express");
const router = express.Router();
const especialidadController = require("../controller/especialidadController");

router.get("/", especialidadController.index); // Portada especialidades
router.get("/listar", especialidadController.listarView); // Listar especialidades

router.get("/listado", especialidadController.listar); // Listar especialidadesJSON

module.exports = router;

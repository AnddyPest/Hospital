const express = require("express");
const router = express.Router();
const especialidadController = require("../controller/especialidadController");

router.get("/", especialidadController.index); // Portada especialidades
router.get("/listar", especialidadController.listarView); // Listar especialidades
router.get("/new", especialidadController.nuevoView); // Crear especialidad
router.get("/listado", especialidadController.listar); // Listar especialidadesJSON
router.get("/borrar", especialidadController.eliminarView); // Eliminar especialidad
router.get("/seleccionar", especialidadController.editarView); // Editar especialidad

router.post("/crear", especialidadController.crear); // Crear especialidad
router.post("/editar/:id", especialidadController.editar); // Editar especialidad
router.post("/eliminar/:id", especialidadController.eliminar); // Eliminar especialidad

module.exports = router;

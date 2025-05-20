const express = require("express");
const router = express.Router();
const habitacionController = require("../controller/habitacionController");

router.get("/", habitacionController.index); // Vista principal de habitaciones
router.get("/admin", habitacionController.adminView); // Vista de administración de habitaciones
router.get("/listar", habitacionController.listarView); // Vista de listar habitaciones
router.get("/admin/new", habitacionController.nuevaHabView); // Vista de nueva habitación
router.get("/admin/seleccionar", habitacionController.editarHabView); // Vista de editar habitación
router.get("/admin/borrar", habitacionController.borrarHabView); // Vista de borrar habitación

router.post("/crear", habitacionController.crear); // Crear nueva habitación

module.exports = router;

const express = require("express");
const router = express.Router();
const pacienteController = require("../controller/pacienteController");

// RUTAS DE VISTA
router.get("/", pacienteController.index);
router.get("/listar", pacienteController.listarView);
router.get("/admin", pacienteController.adminView);
router.get("/admin/new", pacienteController.nuevoView);
router.get("/admin/borrar", pacienteController.borrarView);
router.get("/admin/editar", pacienteController.editarView);
router.get("/admin/seleccionar", pacienteController.seleccionarView);

// RUTAS DE OPERACIONES CRUD
router.post("/admin/new", pacienteController.crearPaciente);
router.put("/editar/:id", pacienteController.editarPaciente);
router.delete("/borrar/:id", pacienteController.borrarPaciente);

// rutas de api
router.get("/listado/:dni", pacienteController.obtenerPorDni);

module.exports = router;

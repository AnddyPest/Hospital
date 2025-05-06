const express = require("express");
const router = express.Router();
const medicoController = require("../controller/medicoController");

// RUTAS DE VISTA
router.get("/", medicoController.index);
router.get("/listar", medicoController.listarView);
router.get("/admin", medicoController.adminView);
router.get("/admin/new", medicoController.nuevoView);
router.get("/admin/borrar", medicoController.borrarView);
router.get("/admin/editar", medicoController.editarView);
router.get("/admin/seleccionar", medicoController.seleccionarView);

// RUTAS DE API

router.post("/admin/new", medicoController.crearMedico);
router.put("/editar/:id", medicoController.editarMedico);
router.delete("/borrar/:id", medicoController.borrarMedico);

module.exports = router;

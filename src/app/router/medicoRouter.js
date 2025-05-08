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

// RUTAS DE CRUD

router.post("/admin/new", medicoController.crearMedico);
router.put("/editar/:id", medicoController.editarMedico);
router.delete("/borrar/:id", medicoController.borrarMedico);

// rutas de api

router.get("/especialidades", medicoController.getEspecialidades);
router.get(
  "/especialidades/:especialidad",
  medicoController.getMedicosPorEspecialidad
);
router.get("/all", medicoController.getAllMedicos);

module.exports = router;

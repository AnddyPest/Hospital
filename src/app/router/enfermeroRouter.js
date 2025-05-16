const express = require("express");
const router = express.Router();
const enfermeroController = require("../controller/enfermeroController");

// RUTAS DE VISTA
router.get("/", enfermeroController.index);
router.get("/listar", enfermeroController.listarView);
router.get("/admin", enfermeroController.adminView);
router.get("/admin/new", enfermeroController.nuevoView);
router.get("/admin/borrar", enfermeroController.borrarView);
router.get("/admin/editar", enfermeroController.editarView);
router.get("/admin/seleccionar", enfermeroController.seleccionarView);

// RUTAS DE OPERACIONES CRUD
router.post("/admin/new", enfermeroController.crearEnfermero);
router.put("/editar/:id", enfermeroController.editarEnfermero);
router.delete("/borrar/:id", enfermeroController.borrarEnfermero);

// RUTAS DE ÁREAS
//router.get("/areas", enfermeroController.obtenerAreas);
router.get("/areas/:area_Id", enfermeroController.obtenerEnfermerosPorArea);
router.get("/all", enfermeroController.getAllEnfermeros);

module.exports = router;

const express = require("express");
const router = express.Router();
const administrativoController = require("../controller/administrativoController");

// RUTAS DE VISTA
router.get("/", administrativoController.index);
router.get("/listar", administrativoController.listarView);
router.get("/admin", administrativoController.adminView);
router.get("/admin/new", administrativoController.nuevoView);
router.get("/admin/borrar", administrativoController.borrarView);
router.get("/admin/editar", administrativoController.editarView);
router.get("/admin/seleccionar", administrativoController.seleccionarView);

// RUTAS DE OPERACIONES CRUD
router.post("/admin/new", administrativoController.crearAdministrativo);
router.put("/editar/:id", administrativoController.editarAdministrativo);
router.delete("/borrar/:id", administrativoController.borrarAdministrativo);

module.exports = router;

const express = require("express");
const router = express.Router();
const maestranzaController = require("../controller/maestranzaController");

// RUTAS DE VISTA
router.get("/", maestranzaController.index);
router.get("/listar", maestranzaController.listarView);
router.get("/admin", maestranzaController.adminView);
router.get("/admin/new", maestranzaController.nuevoView);
router.get("/admin/borrar", maestranzaController.borrarView);
router.get("/admin/editar", maestranzaController.editarView);
router.get("/admin/seleccionar", maestranzaController.seleccionarView);

// RUTAS DE OPERACIONES CRUD
router.post("/admin/new", maestranzaController.crearMaestranza);
router.put("/editar/:id", maestranzaController.editarMaestranza);
router.delete("/borrar/:id", maestranzaController.borrarMaestranza);

module.exports = router;

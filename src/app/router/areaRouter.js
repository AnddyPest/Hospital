const express = require("express");
const router = express.Router();
const areaController = require("../controller/areaController");

router.get("/", areaController.index); // Portada áreas
router.get("/listar", areaController.listarView); // Listar áreas
router.get("/new", areaController.nuevoView); // Crear área
router.get("/seleccionar", areaController.editarView); // Editar área
router.get("/borrar", areaController.eliminarView); // Eliminar área
// getall
router.get("/listado", areaController.listar);
router.post("/crear", areaController.crear); // Crear área
router.post("/editar/:id", areaController.editar); // Editar área
router.post("/eliminar/:id", areaController.eliminar); // Eliminar área

module.exports = router;

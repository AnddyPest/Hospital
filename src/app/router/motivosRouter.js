const express = require("express");
const router = express.Router();
const motivosController = require("../controller/motivosController");

router.get("/", motivosController.index); // Portada áreas
router.get("/listar", motivosController.listarView); // Listar áreas
router.get("/new", motivosController.nuevoView); // Crear área
router.get("/seleccionar", motivosController.editarView); // Editar área
router.get("/borrar", motivosController.eliminarView); // Eliminar área
// getall
router.get("/listado", motivosController.listar);
router.post("/crear", motivosController.crear); // Crear área
router.post("/editar/:id", motivosController.editar); // Editar área
router.post("/eliminar/:id", motivosController.eliminar); // Eliminar área
module.exports = router;

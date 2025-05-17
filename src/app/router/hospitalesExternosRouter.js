const express = require("express");
const router = express.Router();
const hospitalesExternosController = require("../controller/hospitalesExternosController");

router.get("/", hospitalesExternosController.index); // Portada áreas
router.get("/listar", hospitalesExternosController.listarView); // Listar áreas
router.get("/new", hospitalesExternosController.nuevoView); // Crear área
router.get("/seleccionar", hospitalesExternosController.editarView); // Editar área
router.get("/borrar", hospitalesExternosController.eliminarView); // Eliminar área
// getall
router.get("/listado", hospitalesExternosController.listar);
router.post("/crear", hospitalesExternosController.crear); // Crear área
router.post("/editar/:id", hospitalesExternosController.editar); // Editar área
router.post("/eliminar/:id", hospitalesExternosController.eliminar); // Eliminar área

module.exports = router;

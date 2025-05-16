const express = require("express");
const router = express.Router();
const areaController = require("../controller/areaController");

router.get("/", areaController.index); // Portada áreas
router.get("/listar", areaController.listarView); // Listar áreas

// getall
router.get("/listado", areaController.listar);

module.exports = router;

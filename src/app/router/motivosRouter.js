const express = require("express");
const router = express.Router();
const motivosController = require("../controller/motivosController");

router.get("/", motivosController.index); // Portada motivos
router.get("/listar", motivosController.listarView); // Listar motivos

//get motivos
router.get("/listado", motivosController.listarMotivos); // Nuevo motivo

module.exports = router;

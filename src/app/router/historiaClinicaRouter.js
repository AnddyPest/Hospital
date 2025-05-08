const express = require("express");
const router = express.Router();
const historiaClinicaController = require("../controller/historiaClinicaController");
router.get("/", historiaClinicaController.index); // Vista principal de historia clinica
module.exports = router;

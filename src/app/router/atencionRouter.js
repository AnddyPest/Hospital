const express = require("express");
const router = express.Router();
const atencionController = require("../controller/atencionController");

router.get("/", atencionController.index); // Vista principal de historia clinica
router.get("/paciente/:dni", atencionController.atencionView); // Vista de historia clinica por dni
router.get("/paciente/turno/:id", atencionController.filanlizarView);

//rutas api
router.put("/ausente/:id", atencionController.ausente);

module.exports = router;

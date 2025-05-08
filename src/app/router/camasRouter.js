const express = require("express");
const router = express.Router();
const camasController = require("../controller/camasController");

//rutas renders backend
router.get("/", camasController.index); // Vista principal de camas

module.exports = router;

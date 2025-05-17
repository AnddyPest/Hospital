const express = require("express");
const router = express.Router();
const hospitalesExternosController = require("../controller/hospitalesExternosController");

router.get("/", hospitalesExternosController.index); // Portada hospitales externos

module.exports = router;

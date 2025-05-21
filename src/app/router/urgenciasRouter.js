const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("vistasUrgencias/portadaUrgencias", {
    title: "Urgencias",
    userType: req.session?.userType || "guest",
  });
});
router.get("/admin", (req, res) => {
  res.render("vistasUrgencias/vistaUrgenciasAdmin", {
    title: "Administración de Urgencias",
    userType: req.session?.userType || "guest",
  });
});

module.exports = router;

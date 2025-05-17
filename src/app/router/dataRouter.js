const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("vistasDatos/portadaDatos", {
    title: "Datos",
    userType: req.session?.userType || "guest",
  });
});

module.exports = router;

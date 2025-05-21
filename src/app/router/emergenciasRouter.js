const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("vistasEmergencias/portadaEmergencias", {
    title: "Emergencias",
    userType: req.session?.userType || "guest",
  });
});

module.exports = router;

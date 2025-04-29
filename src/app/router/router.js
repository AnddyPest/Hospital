const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index", { isAuthenticated: req.isAuthenticated });
  next();
});

module.exports = router;

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index");
  next();
});

module.exports = router;

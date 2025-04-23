const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index");
  next();
});

/*router.get("/", (req, res, next) => {
  const isAuthenticated = req.session && req.session.user;
  res.render("index", { isAuthenticated });
  next();
});*/

module.exports = router;

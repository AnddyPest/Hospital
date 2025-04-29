const express = require("express");
const router = express.Router();
const maestranzaController = require("../controller/maestranzaController");

//renders
router.get("/", (req, res) => {
  res.render("vistasMaestranzas/portadaMaestranzas", {
    title: "Maestranzas",
  });
});

router.get("/listar", (req, res) => {
  res.render("vistasMaestranzas/listarMaestranzas", {
    title: "Listar Maestranzas",
  });
});

router.get("/admin", (req, res) => {
  res.render("vistasMaestranzas/administrarMaestranzas", {
    title: "Administrar Maestranzas",
  });
});

router.get("/admin/new", (req, res) => {
  res.render("vistasMaestranzas/nuevoMaestranza", {
    title: "Nuevo Maestranza",
  });
});

router.get("/admin/borrar", (req, res) => {
  res.render("vistasMaestranzas/borrarMaestranza", {
    title: "Borrar Maestranza",
  });
});

router.get("/admin/editar", (req, res) => {
  res.render("vistasMaestranzas/editarMaestranzas", {
    title: "Editar Maestranza",
  });
});

router.get("/admin/seleccionar", (req, res) => {
  res.render("vistasMaestranzas/seleccionarMaestranza", {
    title: "Seleccionar Maestranza",
  });
});

//api
router.get("/listado", maestranzaController.getAllMaestranzas);
router.post("/admin/new", maestranzaController.crearMaestranza);
router.put("/editar/:id", maestranzaController.editarMaestranza); // <---- PROBAR!!!!
router.delete("/borrar/:id", maestranzaController.borrarMaestranza);
router.get("/buscardni/:dni", maestranzaController.getMaestranzaByDni); // <---- PROBAR!!!!

module.exports = router;

const express = require("express");
const router = express.Router();
const enfermeroController = require("../controller/enfermeroController");

//renders
router.get("/", (req, res) => {
  res.render("vistasEnfermeros/portadaEnfermeros", {
    title: "Enfermeros",
  });
});

router.get("/listar", (req, res) => {
  res.render("vistasEnfermeros/listarEnfermeros", {
    title: "Listar Enfermeros",
  });
});

router.get("/admin", (req, res) => {
  res.render("vistasEnfermeros/administrarEnfermeros", {
    title: "Administrar Enfermeros",
  });
});

router.get("/admin/new", (req, res) => {
  res.render("vistasEnfermeros/nuevoEnfermero", {
    title: "Nuevo Enfermero",
  });
});

router.get("/admin/borrar", (req, res) => {
  res.render("vistasEnfermeros/borrarEnfermero", {
    title: "Borrar Enfermero",
  });
});

router.get("/admin/editar", (req, res) => {
  res.render("vistasEnfermeros/editarEnfermeros", {
    title: "Editar Enfermero",
  });
});

router.get("/admin/seleccionar", (req, res) => {
  res.render("vistasEnfermeros/seleccionarEnfermero", {
    title: "Seleccionar Enfermero",
  });
});

//api
router.get("/listado", enfermeroController.getAllEnfermeros);
router.post("/admin/new", enfermeroController.crearEnfermero);
router.put("/editar/:id", enfermeroController.editarEnfermero); // <---- PROBAR!!!!
router.delete("/borrar/:id", enfermeroController.borrarEnfermero); // <---- PROBAR!!!!
router.get("/areas/:area", enfermeroController.getEnfermerosByArea);

module.exports = router;

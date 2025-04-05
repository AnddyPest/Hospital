const express = require("express");
const router = express.Router();
const medicoController = require("../controller/medicoController");

//renders
router.get("/", (req, res) => {
  res.render("vistasMedicos/portadaMedicos", {
    title: "Medicos",
  });
});

router.get("/listar", (req, res) => {
  res.render("vistasMedicos/listarMedicos", {
    title: "Listar Medicos",
  });
});

router.get("/admin", (req, res) => {
  res.render("vistasMedicos/administrarMedicos", {
    title: "Administrar Medicos",
  });
});

router.get("/admin/new", (req, res) => {
  res.render("vistasMedicos/nuevoMedico", {
    title: "Nuevo Medico",
  });
});

router.get("/admin/borrar", (req, res) => {
  res.render("vistasMedicos/borrarMedico", {
    title: "Borrar Medico",
  });
});

router.get("/admin/editar", (req, res) => {
  res.render("vistasMedicos/editarMedicos", {
    title: "Editar Medico",
  });
});

//api
router.get("/listado", medicoController.getAllMedicos);
router.post("/admin/new", medicoController.crearMedico);
router.put("/editar/:apellido", medicoController.editarMedico); // <---- PROBAR!!!!
router.delete("/borrar/:apellido", medicoController.borrarMedico); // <---- PROBAR!!!!

module.exports = router;

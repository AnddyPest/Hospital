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

router.get("/admin/seleccionar", (req, res) => {
  res.render("vistasMedicos/seleccionarMedico", {
    title: "Seleccionar Medico",
  });
});

//api
router.get("/listado", medicoController.getAllMedicos);
router.post("/admin/new", medicoController.crearMedico);
router.put("/editar/:id", medicoController.editarMedico); // <---- PROBAR!!!!
router.delete("/borrar/:id", medicoController.borrarMedico); // <---- PROBAR!!!!
//metodos api usados en otras vistas
router.get("/especialidades", medicoController.getEspecialidades); // <---- PROBAR!!!!
router.get(
  "/especialidades/:especialidad",
  medicoController.getMedicosByEspecialidad
); // <---- PROBAR!!!!

module.exports = router;

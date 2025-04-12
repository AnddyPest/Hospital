const express = require("express");
const router = express.Router();
const pacienteController = require("../controller/pacienteController");

//renders
router.get("/", (req, res) => {
  res.render("vistasPacientes/gestion/portadaPacientes", {
    title: "Pacientes",
  });
});

router.get("/listar", (req, res) => {
  res.render("vistasPacientes/gestion/listarPacientes", {
    title: "Listar Pacientes",
  });
});

router.get("/admin", (req, res) => {
  res.render("vistasPacientes/gestion/administrarPacientes", {
    title: "Administrar Pacientes",
  });
});

router.get("/admin/new", (req, res) => {
  res.render("vistasPacientes/gestion/nuevoPaciente", {
    title: "Nuevo Paciente",
  });
});

router.get("/admin/borrar", (req, res) => {
  res.render("vistasPacientes/gestion/borrarPaciente", {
    title: "Borrar Paciente",
  });
});

router.get("/admin/editar", (req, res) => {
  res.render("vistasPacientes/gestion/editarPacientes", {
    title: "Editar Paciente",
  });
});

router.get("/admin/seleccionar", (req, res) => {
  res.render("vistasPacientes/gestion/seleccionarPaciente", {
    title: "Seleccionar Paciente",
  });
});

//api
router.get("/listado", pacienteController.getAllPacientes);
router.post("/admin/new", pacienteController.crearPaciente);
router.put("/editar/:id", pacienteController.editarPaciente); // <---- PROBAR!!!!
router.delete("/borrar/:id", pacienteController.borrarPaciente); // <---- PROBAR!!!!
router.get("/listado/:dni", pacienteController.buscarPacientePorDni); //<--- este lo vamos a llamar cuando creemos turnos

module.exports = router;

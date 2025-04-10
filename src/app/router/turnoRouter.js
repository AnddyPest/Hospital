const express = require("express");
const turnoController = require("../controller/turnoController");
const router = express.Router();

//renders FALTAN
//portada
router.get("/", (req, res) => {
  res.render("vistasPacientes/turnos/portadaTurnos", {
    title: "Turnos",
  });
});
//vista admin
router.get("/admin", (req, res) => {
  res.render("vistasPacientes/turnos/administrarTurnos", {
    title: "Administrar Turnos",
  });
});
//listado con filtros <----- VER QUE FILTROS LE HARIAN FALTA
router.get("/listar", (req, res) => {
  res.render("vistasPacientes/turnos/listarTurnos", {
    title: "Listar Turnos",
  });
});
router.get("/admin/new", (req, res) => {
  res.render("vistasPacientes/turnos/nuevoTurno", {
    title: "Nuevo Turno",
  });
});

// api FALTA AGREGAR LAS RUTAS DE LOS METODOS QUE USO ACA
router.get("/listado", turnoController.getAllTurnos); // Obtener todos los turnos
router.post("/admin/new", turnoController.createTurno); // Crear un nuevo turno
router.get("/:id", turnoController.getTurnoById); // Obtener un turno por ID
router.put("/:id", turnoController.updateTurno); // Actualizar un turno por ID
router.delete("/:id", turnoController.deleteTurno); // Eliminar un turno por ID
router.get("/paciente/:dni", turnoController.getTurnosByPacienteDni); // Obtener turnos por DNI del paciente

module.exports = router;

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
router.get("/listar/medicos", (req, res) => {
  res.render("vistasPacientes/turnos/listaTurnosMedicos", {
    title: "Listar Medicos",
  });
});
router.get("/listar/triages", (req, res) => {
  res.render("vistasPacientes/turnos/listaTriages", {
    title: "Listar Triages",
  });
});
router.get("/admin/seleccionar", (req, res) => {
  res.render("vistasPacientes/turnos/seleccionarEditTurno", {
    title: "Seleccionar Turno",
  });
});
router.get("/admin/seleccionar/turnos", (req, res) => {
  res.render("vistasPacientes/turnos/editarTurnos", {
    title: "Editar Turno",
  });
});
router.get("/admin/seleccionar/triages", (req, res) => {
  res.render("vistasPacientes/turnos/editarTriages", {
    title: "Seleccionar Triage",
  });
});
router.get("/admin/borrar", (req, res) => {
  res.render("vistasPacientes/turnos/seleccionarBorrarTurno", {
    title: "Borrar Turno",
  });
});

router.get("/admin/borrar/turno", (req, res) => {
  res.render("vistasPacientes/turnos/borrarTurnos", {
    title: "Borrar Turno",
  });
});
router.get("/admin/borrar/triage", (req, res) => {
  res.render("vistasPacientes/turnos/borrarTriages", {
    title: "Borrar Turno",
  });
});

// api FALTA AGREGAR LAS RUTAS DE LOS METODOS QUE USO ACA

// Obtener todos los turnos
router.get("/listado", turnoController.getAllTurnos);

// Crear un nuevo turno
router.post("/admin/new", turnoController.createTurno);

// Obtener un turno por ID
router.get("/:id", turnoController.getTurnoById);

// Actualizar un turno por ID
router.put("/:id", turnoController.updateTurno);

// Eliminar un turno por ID
router.delete("/:id", turnoController.deleteTurno);

// Obtener turnos por DNI del paciente
router.get("/paciente/:id", turnoController.getTurnosByPacienteId);

// obtener horarios disponibles de medico
router.get(
  "/listadohorarios/:medico_Id/:fecha",
  turnoController.getHorariosDisponibles
);

// obtener horarios de enfermeros
router.get(
  "/listadohorariosenfermeros/:enfermero_Id/:fecha",
  turnoController.getHorariosEnfermeros
);

// join de tablas turno-paciente-medico-enfermero ordenadas
//  por fecha y hora para listar turnos
router.get("/listado/join", turnoController.getTurnosJoin);
//join con filtros de fecha, hora y dni
router.get("/listado/filtros", turnoController.getTurnosJoinConFiltros);

module.exports = router;

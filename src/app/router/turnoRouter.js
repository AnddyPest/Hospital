const express = require("express");
const router = express.Router();
const turnoController = require("../controller/turnoController");

// VISTAS PRINCIPALES
router.get("/", turnoController.index);
router.get("/listar", turnoController.listarView);
router.get("/admin", turnoController.adminView);
router.get("/admin/new", turnoController.nuevoView);

// VISTAS DE SELECCIÓN
router.get("/admin/seleccionar/edit", turnoController.seleccionarEditView);
router.get("/admin/seleccionar/borrar", turnoController.seleccionarBorrarView);

// VISTAS DE TURNOS MÉDICOS
router.get("/listar/medicos", turnoController.listarTurnosMedicosView);
router.get(
  "/admin/seleccionar/edit/turnos",
  turnoController.editarTurnosMedicosView
);
router.get("/admin/borrar/turno", turnoController.borrarTurnosMedicosView);
router.get("/medicos", turnoController.listarTurnosMedicosView);
// RUTAS DE OPERACIONES CRUD
router.post("/admin/new", turnoController.crearTurno);
router.get("/editar/formulario", turnoController.editarTurnoFormView);
router.put("/editar/:id", turnoController.editarTurno);
router.delete("/borrar/:id", turnoController.borrarTurno);

// VISTAS DE TRIAGES (ENFERMEROS)
router.get("/urgencias/triage", turnoController.urgenciaView); // ok
router.get("/listar/urgencias", turnoController.listarTriagesView);
router.get("/atender/urgencias", turnoController.listarUrgenciasView);

router.post(
  "/atencion/actualizarHora/:id",
  turnoController.actualizarHoraTurno
);
router.get(
  "/urgencias/paciente/:dni/atencion/:atencionId",
  turnoController.turnoUrgenciaView
);

// crear triage
router.post("/urgencias/triage/crear", turnoController.crearTriage); //ok

//ruta para interconsultas
router.get(
  "/interconsulta/paciente/:dni/atencion/:atencionId",
  turnoController.nuevaInterconsultaView
);

// RUTAS DE API PARA AJAX
router.get(
  "/listadohorarios/:medico_Id/:fecha",
  turnoController.getHorariosDisponibles
);
router.get(
  "/listadohorariosenfermeros/:enfermero_Id/:fecha",
  turnoController.getHorariosEnfermeros
);
// ruta para ver las urgencias a antender

module.exports = router;

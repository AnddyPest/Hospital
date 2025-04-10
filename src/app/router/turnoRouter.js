const express = require("express");
const turnoController = require("../controller/turnoController");
const router = express.Router();

//renders FALTAN

// api FALTA AGREGAR LAS RUTAS DE LOS METODOS QUE USO ACA
router.get("/", turnoController.getAllTurnos); // Obtener todos los turnos
router.post("/", turnoController.createTurno); // Crear un nuevo turno
router.get("/:id", turnoController.getTurnoById); // Obtener un turno por ID
router.put("/:id", turnoController.updateTurno); // Actualizar un turno por ID
router.delete("/:id", turnoController.deleteTurno); // Eliminar un turno por ID
router.get("/paciente/:dni", turnoController.getTurnosByPacienteDni); // Obtener turnos por DNI del paciente

module.exports = router;

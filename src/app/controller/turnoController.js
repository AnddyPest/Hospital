const Turno = require("../model/turno");
const Paciente = require("../model/paciente");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");

const turnoController = {
  // Obtener todos los turnos
  getAllTurnos: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        include: [Paciente, Medico, Enfermero], // Incluye las relaciones
      });
      res.status(200).json(turnos);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
      res.status(500).json({ error: "Error al obtener los turnos" });
    }
  },

  // Crear un nuevo turno
  createTurno: async (req, res) => {
    try {
      const { fecha, hora, motivo, estado, pacienteId, medicoId, enfermeroId } =
        req.body;
      if (!pacienteId) {
        // Validar que el id ha sido enviado asi la app explota
        return res.status(400).json({ error: "Paciente ID es requerido" });
      }
      const paciente = await Paciente.findByPk(pacienteId);
      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }

      // Validar que el médico o enfermero exista (si uno u otro se pone)
      if (medicoId) {
        const medico = await Medico.findByPk(medicoId);
        if (!medico) {
          return res.status(404).json({ error: "Médico no encontrado" });
        }
      } else if (enfermeroId) {
        const enfermero = await Enfermero.findByPk(enfermeroId);
        if (!enfermero) {
          return res.status(404).json({ error: "Enfermero no encontrado" });
        }
      }

      // Crear el turno
      const turno = await Turno.create({
        fecha,
        hora,
        motivo,
        estado,
        pacienteId,
        medicoId,
        enfermeroId,
      });

      res.status(201).json(turno);
    } catch (error) {
      console.error("Error al crear el turno:", error);
      res.status(500).json({ error: "Error al crear el turno" });
    }
  },

  // Editar un turno existente
  updateTurno: async (req, res) => {
    try {
      const { id } = req.params;
      const { fecha, hora, motivo, estado, medicoId, enfermeroId } = req.body;

      // Validar que solo se asigne un médico o un enfermero, pero no ambos
      if (medicoId && enfermeroId) {
        return res.status(400).json({
          error:
            "Un turno no puede tener asignado un médico y un enfermero al mismo tiempo",
        });
      }

      const turno = await Turno.findByPk(id);
      if (!turno) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }

      // Validar que el médico o enfermero exista (si se proporciona)
      if (medicoId) {
        const medico = await Medico.findByPk(medicoId);
        if (!medico) {
          return res.status(404).json({ error: "Médico no encontrado" });
        }
      } else if (enfermeroId) {
        const enfermero = await Enfermero.findByPk(enfermeroId);
        if (!enfermero) {
          return res.status(404).json({ error: "Enfermero no encontrado" });
        }
      }

      // Actualizar los datos del turno
      await turno.update({
        fecha,
        hora,
        motivo,
        estado,
        medicoId,
        enfermeroId,
      });

      res.status(200).json(turno);
    } catch (error) {
      console.error("Error al actualizar el turno:", error);
      res.status(500).json({ error: "Error al actualizar el turno" });
    }
  },

  // Eliminar un turno
  deleteTurno: async (req, res) => {
    try {
      const { id } = req.params;

      const turno = await Turno.findByPk(id);
      if (!turno) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }

      // Eliminar el turno
      await turno.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar el turno:", error);
      res.status(500).json({ error: "Error al eliminar el turno" });
    }
  },

  // Obtener un turno por ID
  getTurnoById: async (req, res) => {
    try {
      const { id } = req.params;

      const turno = await Turno.findByPk(id, {
        include: [Paciente, Medico, Enfermero], // Incluye las relaciones
      });

      if (!turno) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }

      res.status(200).json(turno);
    } catch (error) {
      console.error("Error al obtener el turno:", error);
      res.status(500).json({ error: "Error al obtener el turno" });
    }
  },

  // Obtener turnos por DNI del paciente
  getTurnosByPacienteDni: async (req, res) => {
    try {
      const { dni } = req.params;

      const paciente = await Paciente.findOne({ where: { dni } });
      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }

      const turnos = await Turno.findAll({
        where: { pacienteId: paciente.id },
        include: [Medico, Enfermero], // Incluye médicos y enfermeros
      });

      res.status(200).json(turnos);
    } catch (error) {
      console.error("Error al obtener los turnos por DNI del paciente:", error);
      res.status(500).json({ error: "Error al obtener los turnos" });
    }
  },
};

module.exports = turnoController;

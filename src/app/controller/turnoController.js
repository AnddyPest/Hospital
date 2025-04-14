const Turno = require("../model/turno");
const Paciente = require("../model/paciente");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");
const sequelize = require("sequelize");

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
      const {
        fecha,
        hora,
        motivo,
        estado,
        paciente_Id,
        medico_Id,
        enfermero_Id,
      } = req.body;
      if (!paciente_Id) {
        // Validar que el id ha sido enviado asi la app explota
        return res.status(400).json({ error: "Paciente ID es requerido" });
      }
      const paciente = await Paciente.findByPk(paciente_Id);
      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }

      // Validar que el médico o enfermero exista (si uno u otro se pone)
      if (medico_Id) {
        const medico = await Medico.findByPk(medico_Id);
        if (!medico) {
          return res.status(404).json({ error: "Médico no encontrado" });
        }
      } else if (enfermero_Id) {
        const enfermero = await Enfermero.findByPk(enfermero_Id);
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
        paciente_Id,
        medico_Id,
        enfermero_Id,
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

  // metodo para obtener los horarios disponibles de un medico en un dia dado

  getHorariosDisponibles: async (req, res) => {
    try {
      const { medico_Id, fecha } = req.params;
      console.log(`ID Médico recibido: ${medico_Id}`);
      console.log(`Fecha recibida: ${fecha}`);

      if (!medico_Id || !fecha) {
        return res
          .status(400)
          .json({ error: "medicoId y fecha son requeridos" });
      }

      // Obtener todos los turnos del médico en la fecha dada
      const turnos = await Turno.findAll({
        where: {
          medico_Id,
          fecha,
        },
      });

      res.status(200).json(turnos);
    } catch (error) {
      console.error("Error al obtener los horarios disponibles:", error);
      res.status(500).json({ error: "Error al obtener los horarios" });
    }
  },
};

module.exports = turnoController;

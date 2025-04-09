const Turno = require("../model/turno");
const Paciente = require("../model/paciente");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");

const turnoController = {
  // Obtener todos los turnos
  getAllTurnos: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        include: [
          { model: Paciente, through: { attributes: [] } }, // Incluye pacientes PROBAR TODO ESTO
          { model: Medico, through: { attributes: [] } }, // Incluye médicos
          { model: Enfermero, through: { attributes: [] } }, // Incluye enfermeros
        ],
      });
      res.status(200).json(turnos);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
      res.status(500).json({ error: "Error al obtener los turnos" });
    }
  },

  // Crar un nuevo turno
  createTurno: async (req, res) => {
    try {
      const { fecha, hora, motivo, estado, pacienteId, medicoId, enfermeroId } =
        req.body; //tengo dudas aca...

      // Validar que solo se asigne un médico o un enfermero, pero no ambos
      if (medicoId && enfermeroId) {
        return res.status(400).json({
          error:
            "Un turno no puede tener asignado un médico y un enfermero al mismo tiempo",
        });
      }

      // Validar que el paciente existe para q si de alguna manera la logre cagar no explote la app
      const paciente = await Paciente.findByPk(pacienteId);
      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }

      // Crear el turno
      const turno = await Turno.create({ fecha, hora, motivo, estado });

      // Asociar el turno con el paciente
      await turno.addPaciente(paciente);

      // Asociar el turno con un médico o un enfermero
      if (medicoId) {
        const medico = await Medico.findByPk(medicoId);
        if (!medico) {
          return res.status(404).json({ error: "Médico no encontrado" });
        }
        await turno.addMedico(medico);
      } else if (enfermeroId) {
        const enfermero = await Enfermero.findByPk(enfermeroId);
        if (!enfermero) {
          return res.status(404).json({ error: "Enfermero no encontrado" });
        }
        await turno.addEnfermero(enfermero);
      }

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
      const { fecha, hora, motivo, estado, medicoId, enfermeroId } = req.body; //tengo dudas aca... el paciente no deberia poder editarse, solo bajar el
      // turno o cambiarlo de medico o enfermero o de fecha u hora

      // Validar que solo se asigne un médico o un enfermero, pero no ambos, si puedo poner ambas... chau
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

      // Actualizar los datos del turno -> sale por PUT
      await turno.update({ fecha, hora, motivo, estado });

      // Asociar el turno con un médico o un enfermero, aunque lo cambie debo eliminar el anterior o sobreescribir el mismo
      if (medicoId) {
        const medico = await Medico.findByPk(medicoId);
        if (!medico) {
          return res.status(404).json({ error: "Médico no encontrado" });
        }
        await turno.setMedicos([medico]); // Reemplaza cualquier médico existente
        await turno.setEnfermeros([]); // Elimina cualquier enfermero asociado
      } else if (enfermeroId) {
        const enfermero = await Enfermero.findByPk(enfermeroId);
        if (!enfermero) {
          return res.status(404).json({ error: "Enfermero no encontrado" });
        }
        await turno.setEnfermeros([enfermero]); // Reemplaza cualquier enfermero existente
        await turno.setMedicos([]); // Elimina cualquier médico asociado
      }

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
        include: [
          { model: Paciente, through: { attributes: [] } },
          { model: Medico, through: { attributes: [] } },
          { model: Enfermero, through: { attributes: [] } },
        ],
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

  // obtener turnos por dni de paciente
  getTurnosByPacienteDni: async (req, res) => {
    try {
      const { dni } = req.params;

      const paciente = await Paciente.findOne({ where: { dni } });
      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }

      const turnos = await paciente.getTurnos({
        include: [
          { model: Medico, through: { attributes: [] } },
          { model: Enfermero, through: { attributes: [] } },
        ],
      });

      res.status(200).json(turnos);
    } catch (error) {
      console.error("Error al obtener los turnos por DNI del paciente:", error);
      res.status(500).json({ error: "Error al obtener los turnos" });
    }
  },
};

module.exports = turnoController;

const Atencion = require("../model/atencion");
const sequelize = require("sequelize");
const Paciente = require("../model/paciente");
const Turno = require("../model/turno");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");

const atencionController = {
  index: async (req, res) => {
    try {
      res.render("vistasAtencion/portadaAtencion", {
        title: "Atencion de Paciente",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index historia clinica:", error);
      res.status(500).render("error", {
        message: "Error en la página de historia clinica",
        error,
      });
    }
  },
  atencionView: async (req, res) => {
    try {
      const dni = req.params.dni;
      const paciente = await Paciente.findOne({
        where: { dni },
        attributes: [
          "id",
          "dni",
          "nombre",
          "apellido",
          "edad",
          "sexo",
          "email",
          "obra_social",
          "telefono",
        ],
      });

      if (!paciente) {
        return res.status(404).render("error", {
          message: "Paciente no encontrado",
          error: { status: 404 },
        });
      }

      const turnos = await Turno.findAll({
        where: { paciente_Id: paciente.id, estado: "pendiente" },
        include: [
          {
            model: Paciente,
            attributes: ["nombre", "apellido", "dni"],
          },
          {
            model: Medico,
            required: false,
          },
          {
            model: Enfermero,
            required: false,
          },
        ],
        order: [
          ["fecha", "DESC"],
          ["hora", "DESC"],
        ],
      });

      // Renderizar la vista atencionTurno.pug con los turnos como parámetro
      res.render("vistasAtencion/atencionTurno", {
        title: "Atención de Paciente",
        userType: req.session?.userType || "guest",
        paciente: paciente,
        turnos: turnos,
      });
    } catch (error) {
      console.error("Error al obtener turnos por DNI:", error);
      res.status(500).render("error", {
        message: "Error al procesar la atención del paciente",
        error,
      });
    }
  },
  // vista de finalizacion de atencion
  filanlizarView: async (req, res) => {
    try {
      const id = req.params.id;
      const turno = await Turno.findByPk(id, {
        include: [
          {
            model: Paciente,
            attributes: ["nombre", "apellido", "dni", "obra_social"],
          },
          {
            model: Medico,
            required: false,
          },
          {
            model: Enfermero,
            required: false,
          },
        ],
      });
      res.render("vistasAtencion/atencionFinalizar", {
        title: "Finalizar Atención",
        userType: req.session?.userType || "guest",
        turno: turno,
      });
    } catch (error) {
      console.error("Error al obtener el turno:", error);
      res.status(500).render("error", {
        message: "Error al procesar la atención del paciente",
        error,
      });
    }
  },
  // setear el estado de un turno a "ausente"
  ausente: async (req, res) => {
    try {
      const { id } = req.params;
      const turno = await Turno.findByPk(id);

      if (!turno) {
        return res.status(404).render("error", {
          message: "Turno no encontrado",
          error: { status: 404 },
        });
      }

      await Turno.update(
        { estado: "ausente" },
        {
          where: { id },
        }
      );

      res.redirect("/atencion");
    } catch (error) {
      console.error("Error al marcar el turno como ausente:", error);
      res.status(500).render("error", {
        message: "Error al procesar la atención del paciente",
        error,
      });
    }
  },
  // guardar los resultados de la atencion
  guardarAtencion: async (req, res) => {
    try {
      const { diagnostico, observaciones, afiliado, matricula } = req.body;
      const turnoId = req.params.id;

      const existeAtencion = await Atencion.findOne({
        where: { turno_Id: turnoId },
      });
      let atencion;
      if (existeAtencion) {
        atencion = await Atencion.update(
          { diagnostico, observaciones, afiliado, matricula },
          {
            where: { turno_Id: turnoId },
          }
        );
      } else {
        atencion = await Atencion.create({
          diagnostico,
          observaciones,
          afiliado,
          matricula,
          turno_Id: turnoId,
        });
      }

      await Turno.update(
        { estado: "atendido" },
        {
          where: { id: turnoId },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Atención guardada correctamente",
      });
    } catch (error) {
      console.error("Error al guardar la atención:", error);
      res.status(500).render("error", {
        message: "Error al procesar la atención del paciente",
        error,
      });
    }
  },
};
module.exports = atencionController;

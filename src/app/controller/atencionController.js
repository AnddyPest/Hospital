const Atencion = require("../model/atencion");
const sequelize = require("sequelize");
const Paciente = require("../model/paciente");
const Turno = require("../model/turno");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");
const Motivo = require("../model/motivos");
const HospitalExterno = require("../model/hospitalesExternos");

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
          {
            model: Motivo,
            attributes: ["id", "nombre"],
          },
        ],
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
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
  // este es similar al anterior pero se usa para atender urgencias
  atencionUrgenciaView: async (req, res) => {
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
      res.render("vistasUrgencias/vistaAtenderUrgencia", {
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
      const {
        diagnostico,
        observaciones,
        afiliado,
        matricula,
        prioridadAsignada,
      } = req.body;
      const turnoId = req.params.id;

      const existeAtencion = await Atencion.findOne({
        where: { turno_Id: turnoId },
      });
      let atencion;
      if (existeAtencion) {
        atencion = await Atencion.update(
          {
            diagnostico,
            observaciones,
            afiliado,
            matricula,
            prioridadAsignada,
          },
          {
            where: { turno_Id: turnoId },
          }
        );
        atencion = await Atencion.findOne({
          where: { turno_Id: turnoId },
        });
      } else {
        atencion = await Atencion.create({
          diagnostico,
          observaciones,
          afiliado,
          matricula,
          prioridadAsignada,
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
        atencionId: atencion.id,
      });
    } catch (error) {
      console.error("Error al guardar la atención:", error);
      res.status(500).render("error", {
        message: "Error al procesar la atención del paciente",
        error,
      });
    }
  },
  actualizarSituacion: async (req, res) => {
    try {
      const { id } = req.params;
      const { situacion } = req.body;

      const atencion = await Atencion.findOne({
        where: { turno_Id: id },
      });

      if (!atencion) {
        return res.status(404).json({
          success: false,
          message: "Atención no encontrada",
        });
      }

      await Atencion.update(
        { situacion },
        {
          where: { turno_Id: id },
        }
      );

      return res.status(200).json({
        success: true,
        message: `Situación actualizada a "${situacion}" correctamente`,
      });
    } catch (error) {
      console.error("Error al cambiar la situación de la atención:", error);
      res.status(500).json({
        success: false,
        message: "Error al cambiar la situación de la atención",
      });
    }
  },
  //controllers de derivacion, vista y guardar
  derivacionView: async (req, res) => {
    try {
      const id = req.params.id;

      // Buscar la atención correctamente
      const atencion = await Atencion.findByPk(id, {
        include: [
          {
            model: Turno,
            include: [
              {
                model: Paciente,
                attributes: ["id", "nombre", "apellido", "dni"],
              },
              { model: Medico, required: false },
              { model: Enfermero, required: false },
              { model: Motivo, attributes: ["nombre"] },
            ],
          },
        ],
      });

      const hospitalesExternos = await HospitalExterno.findAll({
        attributes: ["id", "nombre", "complejidad"],
      });

      res.render("vistasAtencion/derivacionesTurno", {
        title: "Derivación",
        userType: req.session?.userType || "guest",
        atencion: atencion,
        turno: atencion.Turno,
        paciente: atencion.Turno?.Paciente,
        hospitalesExternos: hospitalesExternos,
      });
    } catch (error) {
      console.error("Error al obtener la atención:", error);
      // Usar render en lugar de json para mantener consistencia
      res.message("Error al procesar la derivación del paciente");
    }
  },
  guardarDerivacion: async (req, res) => {
    try {
      const { id } = req.params;
      const { observaciones, hospitalExternoId } = req.body;

      // Verificar si la atención existe
      const atencion = await Atencion.findByPk(id);
      if (!atencion) {
        return res.status(404).json({
          success: false,
          message: "Atención no encontrada",
        });
      }

      // Actualizar la atención con el motivo y el hospital externo
      await Atencion.update(
        {
          observaciones,
          hospitalesExternos_Id: hospitalExternoId,
          situacion: "derivado",
        },
        {
          where: { id },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Derivación guardada correctamente",
      });
    } catch (error) {
      console.error("Error al guardar la derivación:", error);
      res.status(500).json({
        success: false,
        message: "Error al guardar la derivación",
      });
    }
  },
};

module.exports = atencionController;

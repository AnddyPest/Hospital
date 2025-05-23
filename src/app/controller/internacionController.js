const Camas = require("../model/camas");
const Habitacion = require("../model/habitacion");
const Paciente = require("../model/paciente");
const Atencion = require("../model/atencion");
const Turno = require("../model/turno");
const Medico = require("../model/medico");
const { Op } = require("sequelize");

const internacionController = {
  // Vista para asignar cama a un paciente
  asignarView: async (req, res) => {
    try {
      const atencionId = req.params.id;

      // Buscar la atención con todos sus datos relacionados
      const atencion = await Atencion.findByPk(atencionId, {
        include: [
          {
            model: Turno,
            include: [{ model: Paciente }, { model: Medico }],
          },
        ],
      });

      if (!atencion) {
        return res.status(404).render("error", {
          message: "Atención no encontrada",
          error: { status: 404 },
        });
      }

      // Obtener el paciente y su sexo
      const paciente = atencion.Turno.Paciente;
      const sexoPaciente = paciente.sexo;

      // Obtener todas las habitaciones, agrupadas por ala
      const habitacionesPorAla = {};
      const habitaciones = await Habitacion.findAll({
        order: [
          ["ala", "ASC"],
          ["numero", "ASC"],
        ],
      });

      // Agrupar habitaciones por ala para la vista
      habitaciones.forEach((hab) => {
        if (!habitacionesPorAla[hab.ala]) {
          habitacionesPorAla[hab.ala] = [];
        }
        habitacionesPorAla[hab.ala].push(hab);
      });

      // Obtener todas las camas disponibles
      const camasDisponibles = await Camas.findAll({
        where: { estado: "Disponible" },
        include: [{ model: Habitacion }],
        order: [["numeroCama", "ASC"]],
      });

      // Obtener las camas ocupadas para verificar género
      const camasOcupadas = await Camas.findAll({
        where: {
          estado: "Ocupada",
          paciente_Id: { [Op.not]: null },
        },
        include: [
          { model: Paciente, attributes: ["id", "sexo"] },
          { model: Habitacion, attributes: ["id"] },
        ],
      });

      // Crear mapa de habitaciones con pacientes y sus géneros
      const habitacionesGeneroMap = {};

      camasOcupadas.forEach((cama) => {
        if (cama.Paciente && cama.habitacion_Id) {
          const habitacionId = cama.habitacion_Id;
          const sexoPacienteInternado = cama.Paciente.sexo;

          if (!habitacionesGeneroMap[habitacionId]) {
            habitacionesGeneroMap[habitacionId] = new Set();
          }

          habitacionesGeneroMap[habitacionId].add(sexoPacienteInternado);
        }
      });

      // Fecha actual para el formulario
      const fechaHoy = new Date().toISOString().split("T")[0];

      res.render("vistasInternacion/internacionAsignarCama", {
        title: "Asignar Cama",
        atencion,
        paciente,
        turno: atencion.Turno,
        habitacionesPorAla,
        habitaciones,
        camasDisponibles,
        habitacionesGeneroMap: JSON.stringify(habitacionesGeneroMap),
        sexoPaciente,
        fechaHoy,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al cargar la vista de asignación:", error);
      res.status(500).render("error", {
        message: "Error al cargar la vista de asignación",
        error,
      });
    }
  },

  // Procesar la asignación de cama
  asignar: async (req, res) => {
    try {
      const {
        atencion_id,
        paciente_id,
        cama_id,
        habitacion_id,
        fechaIngreso,
        observaciones,
      } = req.body;

      // Validaciones
      if (
        !atencion_id ||
        !paciente_id ||
        !cama_id ||
        !habitacion_id ||
        !fechaIngreso
      ) {
        return res.status(400).render("error", {
          message: "Faltan datos requeridos para la internación",
          error: { status: 400 },
        });
      }

      // Verificar que la cama está disponible
      const cama = await Camas.findByPk(cama_id);
      if (!cama || cama.estado !== "Disponible") {
        return res.status(400).render("error", {
          message: "La cama seleccionada no está disponible",
          error: { status: 400 },
        });
      }

      // Verificar que la cama pertenece a la habitación seleccionada
      if (cama.habitacion_Id.toString() !== habitacion_id) {
        return res.status(400).render("error", {
          message: "La cama seleccionada no pertenece a la habitación indicada",
          error: { status: 400 },
        });
      }

      // Verificar compatibilidad de género
      const paciente = await Paciente.findByPk(paciente_id);
      const sexoPaciente = paciente.sexo;

      // Buscar si hay pacientes de otro género en la misma habitación
      const camasOcupadas = await Camas.findAll({
        where: {
          habitacion_Id: habitacion_id,
          estado: "Ocupada",
          paciente_Id: { [Op.not]: null },
        },
        include: [{ model: Paciente }],
      });

      const hayPacienteOtroGenero = camasOcupadas.some(
        (cama) => cama.Paciente && cama.Paciente.sexo !== sexoPaciente
      );

      if (hayPacienteOtroGenero) {
        return res.status(400).render("error", {
          message:
            "No se puede asignar al paciente a una habitación con personas del sexo opuesto",
          error: { status: 400 },
        });
      }

      // Añadir este bloque antes del redirect para obtener el ala de la habitación
      const habitacion = await Habitacion.findByPk(habitacion_id);
      const alaHabitacion = habitacion ? habitacion.ala : "Comun"; // Valor por defecto si no se encuentra

      // Actualizar la cama a ocupada
      await cama.update({
        estado: "Ocupada",
        paciente_Id: paciente_id,
        fechaIngreso,
        fechaEgreso: null,
      });

      // Actualizar observaciones en la atención si es necesario
      if (observaciones) {
        await Atencion.update(
          { observaciones },
          { where: { id: atencion_id } }
        );
      }

      // Actualizar situación en la atención a "internado"
      await Atencion.update(
        { situacion: "internado" },
        { where: { id: atencion_id } }
      );

      // Nuevo redirect con el ala como parámetro
      res.redirect(
        `/habitacion/listar?ala=${encodeURIComponent(
          alaHabitacion
        )}&success=true&message=Paciente+internado+exitosamente`
      );
    } catch (error) {
      console.error("Error al asignar cama:", error);
      res.status(500).render("error", {
        message: "Error al asignar cama al paciente",
        error,
      });
    }
  },

  // Lista de pacientes internados
  listaView: async (req, res) => {
    try {
      const internados = await Camas.findAll({
        where: {
          estado: "Ocupada",
          paciente_Id: { [Op.not]: null },
        },
        include: [{ model: Paciente }, { model: Habitacion }],
        order: [["numeroCama", "ASC"]],
      });

      res.render("vistasInternacion/internacionLista", {
        title: "Pacientes Internados",
        internados,
        userType: req.session?.userType || "guest",
        success: req.query.success,
        message: req.query.message,
      });
    } catch (error) {
      console.error("Error al listar internaciones:", error);
      res.status(500).render("error", {
        message: "Error al listar internaciones",
        error,
      });
    }
  },

  // Vista detalle de un paciente internado
  detalleView: async (req, res) => {
    try {
      const camaId = req.params.id;

      const internacion = await Camas.findByPk(camaId, {
        include: [
          {
            model: Paciente,
            include: [
              {
                model: Atencion,
                where: { situacion: "internado" },
                required: false,
                limit: 1,
                order: [["createdAt", "DESC"]],
              },
            ],
          },
          { model: Habitacion },
        ],
      });

      if (!internacion || internacion.estado !== "Ocupada") {
        return res.status(404).render("error", {
          message: "Internación no encontrada",
          error: { status: 404 },
        });
      }

      // Calcular días de internación
      const fechaIngreso = new Date(internacion.fechaIngreso);
      const hoy = new Date();
      const diasInternado = Math.floor(
        (hoy - fechaIngreso) / (1000 * 60 * 60 * 24)
      );

      res.render("vistasInternacion/internacionDetalle", {
        title: "Detalle de Internación",
        internacion,
        diasInternado,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al mostrar detalle de internación:", error);
      res.status(500).render("error", {
        message: "Error al mostrar detalle de internación",
        error,
      });
    }
  },

  // Dar de alta a un paciente internado
  darAlta: async (req, res) => {
    try {
      const camaId = req.params.id;
      const { observaciones } = req.body;

      // Verificar que la cama existe y está ocupada
      const cama = await Camas.findByPk(camaId, {
        include: [{ model: Paciente }],
      });

      if (!cama || cama.estado !== "Ocupada" || !cama.paciente_Id) {
        return res.status(400).render("error", {
          message: "La cama seleccionada no está ocupada",
          error: { status: 400 },
        });
      }

      // Fecha actual para fecha de egreso
      const fechaEgreso = new Date().toISOString().split("T")[0];

      // Actualizar la cama a "En Limpieza"
      await cama.update({
        estado: "En Limpieza",
        fechaEgreso,
        paciente_Id: null,
      });

      // Buscar la atención asociada y actualizar su situación
      const atencion = await Atencion.findOne({
        where: {
          situacion: "internado",
        },
        include: [
          {
            model: Turno,
            where: { paciente_Id: cama.paciente_Id },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (atencion) {
        await atencion.update({
          situacion: "alta",
          observaciones: observaciones || atencion.observaciones,
        });
      }

      res.redirect(
        "/internacion/lista?success=true&message=Paciente+dado+de+alta+exitosamente"
      );
    } catch (error) {
      console.error("Error al dar de alta:", error);
      res.status(500).render("error", {
        message: "Error al dar de alta al paciente",
        error,
      });
    }
  },

  // Liberar una cama (ponerla como disponible después de limpieza)
  liberarCama: async (req, res) => {
    try {
      const camaId = req.params.id;

      // Verificar que la cama existe y está en limpieza
      const cama = await Camas.findByPk(camaId);

      if (!cama || cama.estado !== "En Limpieza") {
        return res.status(400).render("error", {
          message: "La cama seleccionada no está en limpieza",
          error: { status: 400 },
        });
      }

      // Actualizar la cama a disponible
      await cama.update({
        estado: "Disponible",
      });

      res.redirect(
        "/internacion/lista?success=true&message=Cama+liberada+exitosamente"
      );
    } catch (error) {
      console.error("Error al liberar cama:", error);
      res.status(500).render("error", {
        message: "Error al liberar la cama",
        error,
      });
    }
  },

  // API para obtener camas disponibles por habitación
  getCamasDisponibles: async (req, res) => {
    try {
      const habitacionId = req.params.habitacionId;

      const camas = await Camas.findAll({
        where: {
          habitacion_Id: habitacionId,
          estado: "Disponible",
        },
        order: [["numeroCama", "ASC"]],
      });

      res.json(camas);
    } catch (error) {
      console.error("Error al buscar camas disponibles:", error);
      res.status(500).json({ error: "Error al buscar camas disponibles" });
    }
  },
};

module.exports = internacionController;

const Turno = require("../model/turno");
const Paciente = require("../model/paciente");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const turnoController = {
  // MÉTODOS DE RENDERIZADO DE VISTAS PRINCIPALES

  // Vista principal de turnos
  index: async (req, res) => {
    try {
      res.render("vistasTurnos/portadaTurnos", {
        title: "Gestión de Turnos",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index turnos:", error);
      res.status(500).render("error", {
        message: "Error en la página de turnos",
        error,
      });
    }
  },

  // Vista para listar todos los turnos
  listarView: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Medico,
            attributes: ["id", "nombre", "apellido", "especialidad"],
          },
          {
            model: Enfermero,
            attributes: ["id", "nombre", "apellido", "area"],
          },
        ],
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
      });

      res.render("vistasTurnos/listarTurnos", {
        title: "Listar Turnos",
        turnos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar turnos:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de turnos",
        error,
      });
    }
  },

  // Vista de administración de turnos
  adminView: async (req, res) => {
    try {
      res.render("vistasTurnos/administrarTurnos", {
        title: "Administrar Turnos",
        userType: req.session?.userType || "guest",
        success: req.query.success,
        message: req.query.message,
      });
    } catch (error) {
      console.error("Error en vista de administración:", error);
      res.status(500).render("error", {
        message: "Error al cargar panel de administración",
        error,
      });
    }
  },

  // Vista de formulario para nuevo turno
  nuevoView: async (req, res) => {
    try {
      // Obtener datos para los desplegables
      const pacientes = await Paciente.findAll({
        attributes: ["id", "nombre", "apellido", "dni"],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const medicos = await Medico.findAll({
        attributes: ["id", "nombre", "apellido", "especialidad"],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const enfermeros = await Enfermero.findAll({
        attributes: ["id", "nombre", "apellido", "area"],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      res.render("vistasTurnos/nuevoTurno", {
        title: "Nuevo Turno",
        pacientes,
        medicos,
        enfermeros,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en formulario nuevo turno:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario",
        error,
      });
    }
  },

  // VISTAS PARA TURNOS MÉDICOS

  listarTurnosMedicosView: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        where: {
          medico_Id: { [Op.not]: null }, // Solo turnos con médico asignado
        },
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Medico,
            attributes: ["id", "nombre", "apellido", "especialidad"],
          },
        ],
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
      });

      res.render("vistasTurnos/listaTurnosMedicos", {
        title: "Turnos Médicos",
        turnos,
        profesionalTypeOf: "Medico", // Indicamos el tipo explícitamente
        userType: req.session?.userType || "guest",
        context: "listar",
      });
    } catch (error) {
      console.error("Error al listar turnos médicos:", error);
      res.status(500).render("error", {
        message: "Error al listar turnos médicos",
        error,
      });
    }
  },

  listarTurnosEnfermerosView: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        where: {
          enfermero_Id: { [Op.not]: null }, // Solo turnos con enfermero asignado
        },
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Enfermero,
            attributes: ["id", "nombre", "apellido", "area"],
          },
        ],
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
      });

      res.render("vistasTurnos/listaTriages", {
        title: "Turnos Enfermería",
        turnos,
        profesionalTypeOf: "Enfermero", // Indicamos el tipo explícitamente
        userType: req.session?.userType || "guest",
        context: "listar",
      });
    } catch (error) {
      console.error("Error al listar turnos de enfermería:", error);
      res.status(500).render("error", {
        message: "Error al listar turnos de enfermería",
        error,
      });
    }
  },

  borrarTurnosMedicosView: async (req, res) => {
    try {
      // Obtener turnos médicos
      const turnos = await Turno.findAll({
        where: {
          medico_Id: { [Op.not]: null }, // Solo turnos con médico asignado
        },
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Medico,
            attributes: ["id", "nombre", "apellido", "especialidad"],
          },
        ],
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
      });

      // Renderizar vista con los parámetros necesarios para el mixin
      res.render("vistasTurnos/borrarTurnos", {
        title: "Borrar Turnos Médicos",
        turnos,
        profesionalTypeOf: "Medico", // Crucial para el funcionamiento del mixin
        context: "borrar", // Crucial para mostrar los botones de borrado
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error(
        "Error al cargar vista de borrado de turnos médicos:",
        error
      );
      res.status(500).render("error", {
        message: "Error al cargar vista de borrado de turnos",
        error,
      });
    }
  },

  editarTurnosMedicosView: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        where: {
          medico_Id: { [Op.not]: null }, // Solo turnos con médico asignado
        },
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Medico,
            attributes: ["id", "nombre", "apellido", "especialidad"],
          },
        ],
        context: "editar",
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
      });

      res.render("vistasTurnos/editarTurnos", {
        title: "Editar Turnos Médicos",
        turnos,
        profesionalTypeOf: "Medico",
        userType: req.session?.userType || "guest",
        context: "editar",
      });
    } catch (error) {
      console.error("Error al cargar vista de edición:", error);
      res.status(500).render("error", {
        message: "Error al cargar vista de edición",
        error,
      });
    }
  },

  // VISTAS PARA TRIAGES (ENFERMEROS)

  listarTriagesView: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Medico,
            attributes: ["id", "nombre", "apellido", "especialidad"],
          },
          {
            model: Enfermero,
            attributes: ["id", "nombre", "apellido", "area"],
          },
        ],
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
      });

      res.render("vistasTurnos/listaTriages", {
        title: "Triages",
        turnos,
        profesionalTypeOf: "Enfermero", // Añadir este parámetro
        context: "listar", // Añadir este parámetro
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar triages:", error);
      res.status(500).render("error", {
        message: "Error al listar triages",
        error,
      });
    }
  },

  borrarTriagesView: async (req, res) => {
    try {
      // Obtener turnos de enfermería
      const turnos = await Turno.findAll({
        where: {
          enfermero_Id: { [Op.not]: null }, // Solo turnos con enfermero asignado
        },
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Enfermero,
            attributes: ["id", "nombre", "apellido", "area"],
          },
        ],
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
      });

      // Renderizar vista con los parámetros necesarios para el mixin
      res.render("vistasTurnos/borrarTriages", {
        title: "Borrar Turnos Enfermería",
        turnos,
        profesionalTypeOf: "Enfermero", // Crucial para el funcionamiento del mixin
        context: "borrar", // Crucial para mostrar los botones de borrado
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al cargar vista de borrado de triages:", error);
      res.status(500).render("error", {
        message: "Error al cargar vista de borrado de triages",
        error,
      });
    }
  },

  editarTriagesView: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        where: {
          enfermero_Id: { [Op.not]: null }, // Solo turnos con enfermero asignado
        },
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Enfermero,
            attributes: ["id", "nombre", "apellido", "area"],
          },
        ],
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
      });

      res.render("vistasTurnos/editarTriages", {
        title: "Editar Turnos Enfermería",
        turnos,
        profesionalTypeOf: "Enfermero", // Añadido para mantener consistencia
        context: "editar", // Añadido para mantener consistencia
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al cargar vista de edición de triages:", error);
      res.status(500).render("error", {
        message: "Error al cargar vista de edición de triages",
        error,
      });
    }
  },

  // VISTAS DE SELECCIÓN

  // Vista de selección para editar (turnos médicos o triages)
  seleccionarEditView: async (req, res) => {
    try {
      res.render("vistasTurnos/seleccionarEditTurno", {
        title: "Editar Turnos",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista selección de edición:", error);
      res.status(500).render("error", {
        message: "Error al cargar selección de edición",
        error,
      });
    }
  },

  // Vista de selección para borrar (turnos médicos o triages)
  seleccionarBorrarView: async (req, res) => {
    try {
      res.render("vistasTurnos/seleccionarBorrarTurno", {
        title: "Borrar Turnos",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista selección de borrado:", error);
      res.status(500).render("error", {
        message: "Error al cargar selección de borrado",
        error,
      });
    }
  },

  // MÉTODOS PARA OPERACIONES CRUD

  // Método para crear un nuevo turno
  crearTurno: async (req, res) => {
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

      // Validación básica
      if (!paciente_Id) {
        return res.status(400).render("vistasTurnos/nuevoTurno", {
          title: "Nuevo Turno",
          error: "El paciente es obligatorio",
          formData: req.body,
          userType: req.session?.userType || "guest",
        });
      }

      // Validar que un turno sea médico o de enfermería, pero no ambos
      if (medico_Id && enfermero_Id) {
        // Recargar los datos para los desplegables
        const pacientes = await Paciente.findAll();
        const medicos = await Medico.findAll();
        const enfermeros = await Enfermero.findAll();

        return res.status(400).render("vistasTurnos/nuevoTurno", {
          title: "Nuevo Turno",
          error: "Un turno solo puede tener un médico O un enfermero, no ambos",
          pacientes,
          medicos,
          enfermeros,
          formData: req.body,
          userType: req.session?.userType || "guest",
        });
      }

      // Crear el turno
      const turno = await Turno.create({
        fecha,
        hora,
        motivo,
        estado: estado || "Pendiente",
        paciente_Id,
        medico_Id,
        enfermero_Id,
      });

      res.redirect(
        "/turnos/admin?success=true&message=Turno+creado+correctamente"
      );
    } catch (error) {
      console.error("Error al crear el turno:", error);

      // Recargar los datos para los desplegables
      const pacientes = await Paciente.findAll();
      const medicos = await Medico.findAll();
      const enfermeros = await Enfermero.findAll();

      res.status(500).render("vistasTurnos/nuevoTurno", {
        title: "Nuevo Turno",
        error: "Error al crear el turno: " + error.message,
        pacientes,
        medicos,
        enfermeros,
        formData: req.body,
        userType: req.session?.userType || "guest",
      });
    }
  },

  // Método para editar un turno existente
  editarTurno: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        fecha,
        hora,
        motivo,
        estado,
        paciente_Id,
        medico_Id,
        enfermero_Id,
      } = req.body;

      // Validar que el médico o enfermero no sean ambos
      if (medico_Id && enfermero_Id) {
        return res.status(400).render("error", {
          message:
            "Un turno solo puede tener un médico O un enfermero, no ambos",
          error: { status: 400 },
        });
      }

      // Actualizar turno
      const [updated] = await Turno.update(
        {
          fecha,
          hora,
          motivo,
          estado,
          paciente_Id,
          medico_Id,
          enfermero_Id,
        },
        { where: { id } }
      );

      if (updated) {
        res.status(200).json({
          success: true,
          message: "Turno actualizado correctamente",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Turno no encontrado",
        });
      }
    } catch (error) {
      console.error("Error al editar el turno:", error);
      res.status(500).render("error", {
        message: "Error al actualizar turno",
        error,
      });
    }
  },

  // edit turno form
  editarTurnoFormView: async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.redirect("/turnos/admin/seleccionar/edit");
      }

      // Buscar el turno con todas sus relaciones
      const turno = await Turno.findByPk(id, {
        include: [{ model: Paciente }, { model: Medico }, { model: Enfermero }],
      });

      if (!turno) {
        return res.status(404).render("vistasTurnos/mensajes", {
          title: "Error",
          message: "Turno no encontrado",
          userType: req.session?.userType || "guest",
        });
      }

      // Renderizar la vista con el nombre correcto de la variable
      res.render("vistasTurnos/edicionDeTodoTurno", {
        title: "Editar Turno",
        turno, // Nombre correcto que usa la vista
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista editar turno:", error);
      res.status(500).render("vistasTurnos/mensajes", {
        title: "Error",
        message: "Error al cargar datos para editar",
        error: process.env.NODE_ENV === "development" ? error : {},
        userType: req.session?.userType || "guest",
      });
    }
  },

  // Método para borrar un turno
  borrarTurno: async (req, res) => {
    try {
      const { id } = req.params;
      const turno = await Turno.findByPk(id);

      if (!turno) {
        return res.status(404).render("error", {
          message: "Turno no encontrado",
          error: { status: 404 },
        });
      }

      // Determinar si es turno médico o triage para la redirección
      const esTurnoMedico = turno.medico_Id !== null;

      // Borrar el turno
      await turno.destroy();

      const redirectUrl = esTurnoMedico
        ? "/turnos/admin/borrar/turnos"
        : "/turnos/admin/borrar/triages";

      res.redirect(
        `${redirectUrl}?success=true&message=Turno+eliminado+correctamente`
      );
    } catch (error) {
      console.error("Error al borrar el turno:", error);
      res.status(500).render("error", {
        message: "Error al eliminar turno",
        error,
      });
    }
  },

  // MÉTODOS DE API PARA AJAX

  // Método para obtener horarios disponibles de un médico
  getHorariosDisponibles: async (req, res) => {
    try {
      const { medico_Id, fecha } = req.params;

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

  // Método para obtener horarios de enfermeros
  getHorariosEnfermeros: async (req, res) => {
    try {
      const { enfermero_Id, fecha } = req.params;

      if (!enfermero_Id || !fecha) {
        return res
          .status(400)
          .json({ error: "enfermeroId y fecha son requeridos" });
      }
      const turnos = await Turno.findAll({
        where: {
          enfermero_Id,
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

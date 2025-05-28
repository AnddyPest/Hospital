const Turno = require("../model/turno");
const Paciente = require("../model/paciente");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");
const Motivos = require("../model/motivos");
const Especialidad = require("../model/especialidad");
const Area = require("../model/area");
const Atencion = require("../model/atencion");
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
        where: { hora: { [Op.not]: null } }, // Solo turnos con hora asignada
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Medico,
            attributes: ["id", "nombre", "apellido"],
            include: [
              {
                model: Especialidad,
                as: "Especialidad",
                attributes: ["id", "nombre"],
              },
            ],
          },
          {
            model: Enfermero,
            attributes: ["id", "nombre", "apellido"],
            include: [
              {
                model: Area,
                as: "Area",
                attributes: ["id", "nombre"],
              },
            ],
          },
          {
            model: Motivos,
            as: "Motivo",
            attributes: ["id", "nombre"],
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
        attributes: ["id", "nombre", "apellido"],
        include: [
          {
            model: Especialidad,
            as: "Especialidad",
            attributes: ["id", "nombre"],
          },
        ],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const motivos = await Motivos.findAll({
        attributes: ["id", "nombre"],
        order: [["nombre", "ASC"]],
      });

      res.render("vistasTurnos/nuevoTurno", {
        title: "Nuevo Turno",
        pacientes,
        medicos,

        motivoTurno: motivos,
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
            attributes: ["id", "nombre", "apellido"],
            include: [
              {
                model: Especialidad,
                as: "Especialidad",
                attributes: ["id", "nombre"],
              },
            ],
          },
          {
            model: Motivos,
            as: "Motivo",
            attributes: ["id", "nombre"],
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
            attributes: ["id", "nombre", "apellido"],
            include: [
              {
                model: Especialidad,
                as: "Especialidad",
                attributes: ["id", "nombre"],
              },
            ],
          },
          { model: Motivos, attributes: ["id", "nombre"] },
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
            attributes: ["id", "nombre", "apellido"],
            include: [
              {
                model: Especialidad,
                as: "Especialidad",
                attributes: ["id", "nombre"],
              },
            ],
          },
          { model: Motivos, attributes: ["id", "nombre"] },
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

  // Controlador CREAR TURNO DE URGENCA
  turnoUrgenciaView: async (req, res) => {
    const dni = req.params.dni;
    const atencionId = req.params.atencionId;
    try {
      const paciente = await Paciente.findOne({
        where: { dni },
      });
      const atencion = await Atencion.findByPk(atencionId, {
        include: [
          {
            model: Turno,
            include: [
              {
                model: Paciente,
                attributes: ["id", "nombre", "apellido", "dni"],
              },
              { model: Motivos, as: "Motivo", attributes: ["id", "nombre"] },
            ],
          },
        ],
      });

      // Error: no existe la variable turno, debería ser atencion.Turno
      res.render("vistasUrgencias/turnoDeUrgencia", {
        title: "Nueva Urgencia",
        dni,
        atencionId,
        atencion: atencion, // Enviamos atencion en lugar de turno
        paciente,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de nueva Urgencia:", error);
      res.status(500).render("error", {
        message: "Error al cargar la vista de nueva Urgencia",
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
  // vista para generar turnos a partir de una derivación
  nuevaInterconsultaView: async (req, res) => {
    const dni = req.params.dni;
    const atencionId = req.params.atencionId;
    const paciente = await Paciente.findOne({
      where: { dni },
    });
    try {
      res.render("vistasInterconsultas/nuevaInterconsulta", {
        title: "Nueva Interconsulta",
        dni,
        atencionId,
        paciente,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de nueva Interconsulta:", error);
      res.status(500).render("error", {
        message: "Error al cargar la vista de nueva Interconsulta",
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
        motivo_Id,
        estado,
        prioridad,
        ordenUrgencia,
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
        motivo_Id,
        estado: estado || "Pendiente",
        prioridad,
        ordenUrgencia,
        paciente_Id,
        medico_Id,
        enfermero_Id,
      });

      res.redirect(
        "/turnos/listar/medicos?success=true&message=Turno+creado+correctamente"
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
        motivo_Id,
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
          motivo_Id,
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
        include: [
          { model: Paciente },
          {
            model: Medico,
            include: [
              {
                model: Especialidad,
                as: "Especialidad",
              },
            ],
          },
          {
            model: Enfermero,
            include: [
              {
                model: Area,
                as: "Area",
              },
            ],
          },
          {
            model: Motivos,
            as: "Motivo",
          },
        ],
      });

      res.render("vistasTurnos/edicionDeTodoTurno", {
        title: "Editar Turno",
        turno,
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
  // Vista para derivaciones
  derivacionesView: async (req, res) => {
    try {
      res.render("vistasTurnos/derivaciones", {
        title: "Derivaciones",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de derivaciones:", error);
      res.status(500).render("error", {
        message: "Error al cargar la vista de derivaciones",
        error,
      });
    }
  },

  // metodos para urgencias
  // Vista para nuevo triage de urgencia
  urgenciaView: async (req, res) => {
    try {
      // Obtener datos para los desplegables
      const pacientes = await Paciente.findAll({
        attributes: ["id", "nombre", "apellido", "dni"],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const enfermeros = await Enfermero.findAll({
        attributes: ["id", "nombre", "apellido"],
        include: [
          {
            model: Area,
            as: "Area",
            attributes: ["id", "nombre"],
          },
        ],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const motivos = await Motivos.findAll({
        attributes: ["id", "nombre"],
        order: [["nombre", "ASC"]],
      });

      // Obtener la fecha actual en formato YYYY-MM-DD
      const fechaActual = new Date().toISOString().split("T")[0];

      // Obtener el siguiente número de orden
      const siguienteOrden = await turnoController._obtenerSiguienteOrden();

      res.render("vistasUrgencias/nuevaUrgencia", {
        title: "Triage de Urgencia",
        pacientes,
        enfermeros,
        motivoTurno: motivos,
        siguienteOrden,
        fechaActual,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en formulario triage de urgencia:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de urgencias",
        error,
      });
    }
  },

  // Método para crear un triage de urgencia
  crearTriage: async (req, res) => {
    try {
      const { fecha, motivo_Id, estado, paciente_Id, enfermero_Id } = req.body;

      // Validación básica
      if (!paciente_Id || !enfermero_Id) {
        return res.status(400).render("vistasUrgencias/portadaUrgencias", {
          title: "Triage de Urgencia",
          error: "El paciente y el enfermero son obligatorios",
          formData: req.body,
          userType: req.session?.userType || "guest",
        });
      }

      // Obtener el siguiente número de orden
      const orden = await turnoController._obtenerSiguienteOrden();

      // Crear el turno de triage sin hora específica, solo con orden
      const turno = await Turno.create({
        fecha,
        orden,
        motivo_Id,
        estado: estado || "Pendiente",
        paciente_Id,
        enfermero_Id,
      });

      res.redirect(
        "/turnos/listar/urgencias?success=true&message=Triage+creado+correctamente"
      );
    } catch (error) {
      console.error("Error al crear el triage:", error);

      // Recargar los datos para los desplegables
      const pacientes = await Paciente.findAll();
      const enfermeros = await Enfermero.findAll();
      const motivos = await Motivos.findAll();

      res.status(500).render("vistasUrgencias/portadaUrgencias", {
        title: "Triage de Urgencia",
        error: "Error al crear el triage: " + error.message,
        pacientes,
        enfermeros,
        motivoTurno: motivos,
        formData: req.body,
        userType: req.session?.userType || "guest",
      });
    }
  },

  // Método privado para obtener el siguiente número de orden
  // El guión bajo indica que es un método auxiliar interno
  _obtenerSiguienteOrden: async function () {
    try {
      // Buscar el turno con el mayor número de orden para enfermeros
      const ultimoTurno = await Turno.findOne({
        where: {
          enfermero_Id: { [Op.not]: null }, // Solo turnos de enfermeros
          orden: { [Op.not]: null }, // Que tengan número de orden
        },
        order: [["orden", "DESC"]],
      });

      // Si existe, retorna el siguiente número, si no, comienza en 1
      return ultimoTurno ? ultimoTurno.orden + 1 : 1;
    } catch (error) {
      console.error("Error al obtener siguiente número de orden:", error);
      return 1; // Valor por defecto en caso de error
    }
  },
  // render de vista para listado de urgencias
  listarUrgenciasView: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        where: {
          ordenUrgencia: { [Op.not]: null }, // Los turnos de urgencia tienen un valor en ordenUrgencia
          estado: { [Op.not]: "atendido" }, // Excluir turnos atendidos
          estado: { [Op.not]: "Atendido" }, // Excluir turnos cancelados
        },
        include: [
          {
            model: Paciente,
            attributes: ["id", "nombre", "apellido", "dni"],
          },
          {
            model: Enfermero,
            attributes: ["id", "nombre", "apellido"],
            required: false, // No todos los turnos tienen enfermero asignado
          },
          {
            model: Motivos,
            attributes: ["id", "nombre"],
          },
          {
            model: Medico,
            required: false,
            attributes: ["id", "nombre", "apellido"],
          },
        ],
        order: [
          // Ordenar primero por estado (pendientes primero)
          [
            sequelize.literal(
              `CASE WHEN estado = 'pendiente' THEN 0 WHEN estado = 'en atención' THEN 1 ELSE 2 END`
            ),
            "ASC",
          ],
          // Luego por prioridad (alta, media, baja)
          [
            sequelize.literal(
              `CASE WHEN prioridad = 'alta' THEN 0 WHEN prioridad = 'media' THEN 1 WHEN prioridad = 'baja' THEN 2 ELSE 3 END`
            ),
            "ASC",
          ],
          // Finalmente por fecha y hora, más reciente primero
          ["fecha", "DESC"],
          ["hora", "DESC"],
        ],
      });

      res.render("vistasUrgencias/vistaTurnosUrgencias", {
        title: "Listado de Urgencias",
        turnos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar urgencias:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de urgencias",
        error,
      });
    }
  },
  // actualizar la hora del turno
  actualizarHoraTurno: async (req, res) => {
    try {
      const { id } = req.params;
      const { hora } = req.body;

      // Actualizar la hora del turno
      await Turno.update({ hora }, { where: { id } });

      res.status(200).json({
        success: true,
        message: "Hora actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar la hora del turno:", error);
      res.status(500).json({ error: "Error al actualizar la hora" });
    }
  },
  // controlador para cargar los turnos que tienen un medico de Guardia De Urgencias
  // hay que ordenarlos por PRIORIDAD "Alta, Media,Baja" y a su vez por numero de orden
  atenderUrgenciaView: async (req, res) => {
    try {
      const turnos = await Turno.findAll({
        where: {
          ordenUrgencia: { [Op.not]: null }, // Solo turnos con orden
          estado: "Pendiente",
        },
        include: [
          { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
          {
            model: Medico,
            attributes: ["id", "nombre", "apellido", "matricula"],
            include: [
              {
                model: Especialidad,
                as: "especialidad",
                attributes: ["id", "nombre"],
              },
            ],
          },
          { model: Motivos, attributes: ["id", "nombre"] },
        ],
        order: [
          ["prioridad", "ASC"],
          ["orden", "ASC"],
        ],
      });

      res.render("vistasUrgencias/atenderUrgencia", {
        title: "Atender Urgencias",
        turnos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al cargar urgencias:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de urgencias",
        error,
      });
    }
  },
  listarTriagesView: async (req, res) => {
    try {
      // Esta consulta debe mostrar los triages, no los turnos con orden de urgencia
      const turnos = await Turno.findAll({
        where: {
          // Filtrar los triages de urgencia (probablemente tienen otro indicador)
          orden: { [Op.not]: null }, // O el campo que uses para identificar triages
          // No filtrar por ordenUrgencia aquí, ya que estamos buscando triages
        },
        include: [
          {
            model: Paciente,
            attributes: ["id", "nombre", "apellido", "dni"],
          },
          {
            model: Enfermero, // Añadido el modelo Enfermero que aparece en la vista
            attributes: ["id", "nombre", "apellido"],
            required: false,
          },
          {
            model: Motivos,
            attributes: ["id", "nombre"],
          },
          // El médico podría no ser necesario en esta vista
          {
            model: Medico,
            required: false,
            attributes: ["id", "nombre", "apellido"],
          },
        ],
        order: [
          // Ordenar por fecha y hora, más reciente primero
          ["fecha", "DESC"],
          ["hora", "DESC"],
          // Alternativamente por estado (pendientes primero)
          ["estado", "ASC"],
        ],
      });

      res.render("vistasUrgencias/vistaListarUrgencias", {
        title: "Listado de Urgencias",
        turnos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar urgencias:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de urgencias",
        error,
      });
    }
  },
};
// hooks

module.exports = turnoController;

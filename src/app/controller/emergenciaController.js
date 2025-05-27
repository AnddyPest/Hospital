const Paciente = require("../model/paciente");
const Turno = require("../model/turno");
const Motivos = require("../model/motivos");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");
const Especialidad = require("../model/especialidad");
const Area = require("../model/area");
const { Op } = require("sequelize");

const emergenciaController = {
  // Vista para crear nueva emergencia
  nuevaEmergenciaView: async (req, res) => {
    try {
      console.log("Cargando vista de emergencia");

      // Obtener médicos para el formulario
      const medicos = await Medico.findAll({
        include: [
          {
            model: Especialidad,
            as: "Especialidad",
            where: {
              nombre: {
                [Op.like]: "%Emergent%", // Esto capturará "Emergentología" y variaciones
              },
            },
          },
        ],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      console.log(`Médicos de emergentología cargados: ${medicos.length}`);

      // Obtener enfermeros para el formulario
      const enfermeros = await Enfermero.findAll({
        include: [{ model: Area, as: "Area" }],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      console.log(`Enfermeros cargados: ${enfermeros.length}`);

      // Obtener motivos
      const motivos = await Motivos.findAll({
        order: [["nombre", "ASC"]],
      });

      console.log(`Motivos cargados: ${motivos.length}`);

      // Obtener siguiente número de emergencia
      const siguienteNumero =
        await emergenciaController._obtenerSiguienteNumeroEmergencia();

      console.log(`Siguiente número: ${siguienteNumero}`);

      return res.render("vistasEmergencias/nuevaEmergencia", {
        title: "Nueva Emergencia",
        medicos: medicos || [],
        enfermeros: enfermeros || [],
        motivos: motivos || [],
        siguienteNumero: siguienteNumero || 1,
        fechaActual: new Date().toISOString().split("T")[0],
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al cargar vista de emergencia:", error);
      return res.status(500).render("error", {
        message: "Error al cargar la vista de emergencia",
        error,
      });
    }
  },

  // Crear una nueva emergencia
  crearEmergencia: async (req, res) => {
    try {
      const {
        paciente_Id,
        dni,
        nombre,
        apellido,
        medico_Id,
        enfermero_Id,
        motivo_Id,
        descripcion,
      } = req.body;

      let pacienteId = paciente_Id;

      // Si no hay paciente_Id, crear nuevo paciente
      if (!pacienteId) {
        // Obtener siguiente número para emergencia sin datos
        const siguienteNumero =
          await emergenciaController._obtenerSiguienteNumeroEmergencia();

        // Verificar y generar un DNI válido
        let dniParaGuardar;

        // Depurar el valor del DNI recibido
        console.log("Valor de DNI recibido:", dni, typeof dni);

        // Verificar si el DNI es válido o necesita ser generado
        if (
          !dni ||
          dni === "Sin Datos" ||
          dni === "" ||
          dni === undefined ||
          dni === null
        ) {
          // Generar un DNI único con prefijo E
          const timestamp = Date.now().toString();
          dniParaGuardar = `E${timestamp.slice(-8)}`;
          console.log("DNI generado automáticamente:", dniParaGuardar);
        } else {
          // Usar el DNI proporcionado
          dniParaGuardar = dni.toString();
          console.log("DNI proporcionado:", dniParaGuardar);
        }

        // Validación final antes de crear el paciente
        if (
          !dniParaGuardar ||
          dniParaGuardar === "NaN" ||
          dniParaGuardar === "undefined"
        ) {
          dniParaGuardar = `E${Date.now().toString().slice(-8)}`;
          console.log("DNI corregido por valor inválido:", dniParaGuardar);
        }

        // Crear paciente nuevo
        try {
          const nuevoPaciente = await Paciente.create({
            dni: dniParaGuardar,
            nombre: nombre || "EMERGENCIA",
            apellido: apellido || `Emergencia ${siguienteNumero}`,
            sexo: req.body.sexo || "No Especificado",
            edad: req.body.edad || 0,
            telefono: req.body.telefono || "0000000000",
            email: req.body.email || "emergencia@hospital.com",
            obra_social: req.body.obra_social || "Sin Datos",
          });

          pacienteId = nuevoPaciente.id;
          console.log("Paciente creado exitosamente con ID:", pacienteId);
        } catch (error) {
          console.error(
            "Error específico al crear paciente:",
            error.name,
            error.message
          );

          // Si es un error de DNI duplicado, intentar una vez más con un nuevo timestamp
          if (
            error.name === "SequelizeUniqueConstraintError" &&
            error.errors[0]?.path === "dni"
          ) {
            const nuevoTimestamp = Date.now().toString();
            const nuevoDni = `E${nuevoTimestamp}`;
            console.log("Reintentando con nuevo DNI único:", nuevoDni);

            const nuevoPaciente = await Paciente.create({
              dni: nuevoDni,
              nombre: nombre || "EMERGENCIA",
              apellido: apellido || `Emergencia ${siguienteNumero}`,
              sexo: req.body.sexo || "No Especificado",
              edad: req.body.edad || 0,
              telefono: req.body.telefono || "0000000000",
              email: req.body.email || "emergencia@hospital.com",
              obra_social: req.body.obra_social || "Sin Datos",
            });

            pacienteId = nuevoPaciente.id;
          } else {
            throw error; // Re-lanzar error si no es de duplicidad de DNI
          }
        }
      }

      // Verificar si el paciente ya existe y está internado
      if (paciente_Id) {
        const pacienteExistente = await Paciente.findByPk(paciente_Id);

        if (pacienteExistente && pacienteExistente.internado) {
          // Si es petición AJAX/fetch
          if (req.xhr || req.headers.accept.includes("application/json")) {
            return res.status(400).json({
              success: false,
              error: "El paciente ya se encuentra internado",
            });
          }

          return res.status(400).render("error", {
            message: "El paciente ya se encuentra internado",
            error: { status: 400 },
          });
        }
      }

      // Obtener siguiente número de orden para emergencias
      const orden = await emergenciaController._obtenerSiguienteOrden();

      // Crear turno de emergencia
      const turnoEmergencia = await Turno.create({
        fecha: new Date().toISOString().split("T")[0],
        orden,
        motivo_Id,
        estado: "Emergencia",
        prioridad: "Alta",
        descripcion,
        paciente_Id: pacienteId,
        medico_Id,
        enfermero_Id,
        esEmergencia: true,
      });

      // Modificar la respuesta JSON para AJAX

      // Si es petición AJAX/fetch
      if (req.xhr || req.headers.accept.includes("application/json")) {
        return res.status(200).json({
          success: true,
          message: "Emergencia creada con éxito",
          pacienteId: pacienteId, // Enviar el ID del paciente creado
        });
      }

      return res.redirect(`/atencion/paciente/turno/${pacienteId}`);
    } catch (error) {
      console.error("Error al crear emergencia:", error);

      // Si es petición AJAX/fetch
      if (req.xhr || req.headers.accept.includes("application/json")) {
        return res.status(500).json({
          success: false,
          error: "Error al crear la emergencia: " + error.message,
        });
      }

      return res.status(500).render("error", {
        message: "Error al crear la emergencia",
        error,
      });
    }
  },

  // Método auxiliar para obtener el siguiente número de emergencia (para pacientes temporales)
  _obtenerSiguienteNumeroEmergencia: async function () {
    try {
      // Buscar la última emergencia con paciente temporal
      const ultimaEmergencia = await Paciente.findOne({
        where: {
          apellido: {
            [Op.like]: "Emergencia %",
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!ultimaEmergencia) {
        return 1; // Primera emergencia
      }

      // Extraer el número del apellido "Emergencia X"
      const ultimoNumero =
        parseInt(ultimaEmergencia.apellido.split(" ")[1]) || 0;
      return ultimoNumero + 1;
    } catch (error) {
      console.error("Error al obtener siguiente número de emergencia:", error);
      return new Date().getTime(); // Usar timestamp como fallback
    }
  },

  // Método auxiliar para obtener el siguiente número de orden
  _obtenerSiguienteOrden: async function () {
    try {
      const fechaHoy = new Date().toISOString().split("T")[0];

      // Buscar el último turno del día
      const ultimoTurno = await Turno.findOne({
        where: {
          fecha: fechaHoy,
          esEmergencia: true,
        },
        order: [["orden", "DESC"]],
      });

      if (!ultimoTurno) {
        return 1; // Primer turno del día
      }

      return ultimoTurno.orden + 1;
    } catch (error) {
      console.error("Error al obtener siguiente orden:", error);
      return 1;
    }
  },
};

module.exports = emergenciaController;

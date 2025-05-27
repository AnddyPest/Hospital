const Paciente = require("../model/paciente");
const Turno = require("../model/turno");
const Medico = require("../model/medico");
const Enfermero = require("../model/enfermero");
const Area = require("../model/area");
const Motivos = require("../model/motivos");
const Especialidad = require("../model/especialidad");
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
        sexo,
        telefono,
        email,
        obra_social,
        medico_Id,
        motivo_Id,
        descripcion,
      } = req.body;

      let pacienteId;

      // 1. Si el paciente existe (por ID o por DNI)
      if (paciente_Id) {
        const pacienteExistente = await Paciente.findByPk(paciente_Id);
        if (pacienteExistente) {
          pacienteId = pacienteExistente.id;
        } else {
          // Si el ID no existe, buscar por DNI
          if (dni) {
            const pacientePorDni = await Paciente.findOne({ where: { dni } });
            if (pacientePorDni) {
              pacienteId = pacientePorDni.id;
            }
          }
        }
      } else if (dni) {
        // Si no viene paciente_Id pero sí DNI, buscar por DNI
        const pacientePorDni = await Paciente.findOne({ where: { dni } });
        if (pacientePorDni) {
          pacienteId = pacientePorDni.id;
        }
      }

      // 2. Si no existe, crear paciente sin datos
      if (!pacienteId) {
        // Generar DNI tipo E-timestamp ddMMhhmm
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, "0");
        const dniEmergencia = `E${pad(now.getDate())}${pad(
          now.getMonth() + 1
        )}${pad(now.getHours())}${pad(now.getMinutes())}`;

        const nuevoPaciente = await Paciente.create({
          nombre: "Emergencia",
          apellido: "Emergencia", // El apellido con ID se actualiza después de crear el paciente
          sexo: sexo || "M",
          dni: dniEmergencia,
          telefono: telefono || "Desconocido",
          email: email || "Desconocido",
          obra_social: obra_social || "Desconocido",
          edad: 0,
        });

        // Actualizar apellido con el ID real
        await nuevoPaciente.update({
          apellido: `Emergencia ${nuevoPaciente.id}`,
        });

        pacienteId = nuevoPaciente.id;
      }

      // 3. Crear el turno de emergencia
      const turno = await Turno.create({
        fecha: new Date().toISOString().split("T")[0],
        motivo_Id,
        estado: "Emergencia",
        prioridad: "Alta",
        descripcion,
        paciente_Id: pacienteId,
        medico_Id,
        esEmergencia: true,
      });

      // 4. Redirigir a la vista de finalización de atención
      return res.redirect(`/atencion/paciente/turno/${turno.id}`);
    } catch (error) {
      console.error("Error al crear emergencia:", error);
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

const Paciente = require("../model/paciente");
const sequelize = require("sequelize");

// Controlador para manejar las peticiones http para la tabla Paciente
const pacienteController = {
  // MÉTODOS DE RENDERIZADO DE VISTAS

  // Vista principal de pacientes
  index: async (req, res) => {
    try {
      res.render("vistasPacientes/gestion/portadaPacientes", {
        title: "Pacientes",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index pacientes:", error);
      res.status(500).render("error", {
        message: "Error en la página de pacientes",
        error,
      });
    }
  },

  // Vista para listar todos los pacientes
  listarView: async (req, res) => {
    try {
      // Simplemente cargar todos los pacientes sin filtrar
      const pacientes = await Paciente.findAll();

      res.render("vistasPacientes/gestion/listarPacientes", {
        title: "Listar Pacientes",
        pacientes,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar pacientes:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de pacientes",
        error,
      });
    }
  },

  // Vista de administración de pacientes
  adminView: async (req, res) => {
    try {
      res.render("vistasPacientes/gestion/administrarPacientes", {
        title: "Administrar Pacientes",
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

  // Vista de formulario para nuevo paciente
  nuevoView: async (req, res) => {
    try {
      res.render("vistasPacientes/gestion/nuevoPaciente", {
        title: "Nuevo Paciente",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en formulario nuevo paciente:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario",
        error,
      });
    }
  },

  // Vista para borrar pacientes
  borrarView: async (req, res) => {
    try {
      const pacientes = await Paciente.findAll();
      res.render("vistasPacientes/gestion/borrarPaciente", {
        title: "Borrar Paciente",
        pacientes,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista borrar paciente:", error);
      res.status(500).render("error", {
        message: "Error al cargar pacientes para borrar",
        error,
      });
    }
  },

  // Vista para editar pacientes
  editarView: async (req, res) => {
    try {
      const { id } = req.query;
      let pacienteAEditar = null;

      if (id) {
        pacienteAEditar = await Paciente.findByPk(id);
        if (!pacienteAEditar) {
          return res.status(404).render("error", {
            message: "Paciente no encontrado",
          });
        }
      }

      const pacientes = await Paciente.findAll();
      res.render("vistasPacientes/gestion/editarPacientes", {
        title: "Editar Paciente",
        pacientes,
        pacienteAEditar,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista editar paciente:", error);
      res.status(500).render("error", {
        message: "Error al cargar datos para editar",
        error,
      });
    }
  },

  // Vista para seleccionar paciente
  seleccionarView: async (req, res) => {
    try {
      const pacientes = await Paciente.findAll();
      const obrasSociales = await Paciente.findAll({
        attributes: [
          [
            sequelize.fn("DISTINCT", sequelize.col("obra_social")),
            "obra_social",
          ],
        ],
      });

      res.render("vistasPacientes/gestion/seleccionarPaciente", {
        title: "Seleccionar Paciente",
        pacientes,
        obrasSociales: obrasSociales.map((os) => os.obra_social),
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista seleccionar paciente:", error);
      res.status(500).render("error", {
        message: "Error al cargar selección de pacientes",
        error,
      });
    }
  },

  // MÉTODOS PARA OPERACIONES CRUD

  // Método para agregar un nuevo paciente
  crearPaciente: async (req, res) => {
    try {
      console.log("Creando nuevo paciente:", req.body);
      const { dni, nombre, apellido, edad, sexo, email, obraSocial, telefono } =
        req.body;

      const nuevoPaciente = await Paciente.create({
        dni,
        nombre,
        apellido,
        edad,
        sexo,
        email,
        obra_social: obraSocial,
        telefono,
      });

      res.redirect(
        "/pacientes/admin?success=true&message=Paciente+creado+correctamente"
      );
    } catch (error) {
      console.error("Error al crear el paciente:", error);

      res.status(500).render("vistasPacientes/nuevoPaciente", {
        title: "Nuevo Paciente",
        error: "Error al crear el paciente: " + error.message,
        formData: req.body,
        userType: req.session?.userType || "guest",
      });
    }
  },

  // Método para editar un paciente buscando por id
  editarPaciente: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, edad, sexo, email, obraSocial, telefono } =
        req.body;

      const [updated] = await Paciente.update(
        {
          dni,
          nombre,
          apellido,
          edad,
          sexo,
          email,
          obra_social: obraSocial,
          telefono,
        },
        { where: { id } }
      );

      if (updated) {
        res.redirect(
          "/pacientes/admin?success=true&message=Paciente+actualizado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Paciente no encontrado",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al editar el paciente:", error);

      res.status(500).render("error", {
        message: "Error al actualizar paciente",
        error,
      });
    }
  },

  // Método para borrar un paciente buscando por su id
  borrarPaciente: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Paciente.destroy({ where: { id } });

      if (deleted) {
        res.redirect(
          "/pacientes/admin?success=true&message=Paciente+eliminado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Paciente no encontrado al intentar eliminar",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al borrar el paciente:", error);

      res.status(500).render("error", {
        message: "Error al eliminar paciente",
        error,
      });
    }
  },
  // Añade este método a tu pacienteController
  obtenerPorDni: async (req, res) => {
    try {
      const { dni } = req.params;

      if (!dni || isNaN(dni)) {
        return res.status(400).json({
          error: "DNI inválido",
          message: "El DNI debe ser un número válido",
        });
      }

      // Buscar paciente por su DNI
      const paciente = await Paciente.findOne({
        where: { dni },
      });

      // Si no encuentra el paciente
      if (!paciente) {
        return res.status(404).json({
          error: "No encontrado",
          message: "No se encontró ningún paciente con ese DNI",
        });
      }

      // Si lo encuentra, devolver el paciente
      res.json({
        id: paciente.id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        dni: paciente.dni,
      });
    } catch (error) {
      console.error("Error al buscar paciente por DNI:", error);
      res.status(500).json({
        error: "Error del servidor",
        message: "Error al buscar el paciente",
      });
    }
  },
};
Paciente.afterCreate(async (paciente) => {
  try {
    // Importar el modelo HistoriaClinica
    const HistoriaClinica = require("../model/historiaClinica");

    // Crear una historia clínica automáticamente para el nuevo paciente
    await HistoriaClinica.create({
      paciente_Id: paciente.id,
      fecha: new Date(), // Fecha actual
      resultado: "Historia clínica inicial",
      // Otros campos requeridos con valores predeterminados
    });

    console.log(
      `Historia clínica creada automáticamente para paciente ID: ${paciente.id}`
    );
  } catch (error) {
    console.error("Error al crear historia clínica automática:", error);
  }
});

module.exports = pacienteController;

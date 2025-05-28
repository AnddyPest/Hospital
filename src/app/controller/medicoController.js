const Especialidad = require("../model/especialidad");
const Medico = require("../model/medico");

const sequelize = require("sequelize");

//dentro de este controlador se encuentran los metodos para manejar las peticiones http para la tabla Medico
const medicoController = {
  // MÉTODOS DE RENDERIZADO DE VISTAS

  // Vista principal de médicos
  index: async (req, res) => {
    try {
      res.render("vistasMedicos/portadaMedicos", {
        title: "Médicos",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index médicos:", error);
      res.status(500).render("error", {
        message: "Error en la página de médicos",
        error,
      });
    }
  },

  // Vista para listar todos los médicos
  listarView: async (req, res) => {
    try {
      const medicos = await Medico.findAll({
        include: [
          {
            model: Especialidad,
            attributes: ["id", "nombre"],
          },
        ],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      res.render("vistasMedicos/listarMedicos", {
        title: "Listar Médicos",
        medicos,
        userType: req.session?.userType || "guest",
        success: req.query.success,
        message: req.query.message,
      });
    } catch (error) {
      console.error("Error al listar médicos:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de médicos",
        error,
      });
    }
  },

  // Vista de administración de médicos
  adminView: async (req, res) => {
    try {
      res.render("vistasMedicos/administrarMedicos", {
        title: "Administrar Médicos",
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

  // Vista de formulario para nuevo médico
  nuevoView: async (req, res) => {
    try {
      const especialidades = await Especialidad.findAll();
      res.render("vistasMedicos/nuevoMedico", {
        title: "Nuevo Médico",
        especialidades,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en formulario nuevo médico:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario",
        error,
      });
    }
  },

  // Vista para borrar médicos
  borrarView: async (req, res) => {
    try {
      const medicos = await Medico.findAll();
      include: [
        {
          model: Especialidad,
          attributes: ["id", "nombre"],
        },
      ],
        res.render("vistasMedicos/borrarMedico", {
          title: "Borrar Médico",
          medicos,
          userType: req.session?.userType || "guest",
        });
    } catch (error) {
      console.error("Error en vista borrar médico:", error);
      res.status(500).render("error", {
        message: "Error al cargar médicos para borrar",
        error,
      });
    }
  },

  // Vista para editar médicos
  editarView: async (req, res) => {
    try {
      const { id } = req.query;
      let medicoAEditar = null;

      if (id) {
        medicoAEditar = await Medico.findByPk(id, {
          include: [{ model: Especialidad, attributes: ["id", "nombre"] }],
        });

        if (!medicoAEditar) {
          return res.status(404).render("error", {
            message: "Médico no encontrado",
          });
        }
      }

      const medicos = await Medico.findAll({
        include: [
          {
            model: Especialidad,
            attributes: ["id", "nombre"],
          },
        ],
      });
      res.render("vistasMedicos/editarMedicos", {
        title: "Editar Médico",
        medicos,
        medicoAEditar,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista editar médico:", error);
      res.status(500).render("error", {
        message: "Error al cargar datos para editar",
        error,
      });
    }
  },

  // Vista para seleccionar médico
  seleccionarView: async (req, res) => {
    try {
      const medicos = await Medico.findAll({
        include: [
          {
            model: Especialidad,
            attributes: ["id", "nombre"],
          },
        ],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      const especialidad = await Especialidad.findAll();

      res.render("vistasMedicos/seleccionarMedico", {
        title: "Seleccionar Médico",
        medicos,
        especialidad,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista seleccionar médico:", error);
      res.status(500).render("error", {
        message: "Error al cargar selección de médicos",
        error,
      });
    }
  },

  // metodo para agregar un nuevo medico
  crearMedico: async (req, res) => {
    try {
      console.log("Creando nuevo medico:", req.body);
      const { dni, nombre, apellido, especialidad_Id, telefono, matricula } =
        req.body;
      const nuevoMedico = await Medico.create({
        dni,
        nombre,
        apellido,
        especialidad_Id,
        telefono,
        matricula,
      });

      res.redirect(
        "/medicos/listar?success=true&message=Médico+creado+correctamente"
      );
    } catch (error) {
      console.error("Error al crear el medico:", error);

      res.status(500).render("vistasMedicos/nuevoMedico", {
        title: "Nuevo Médico",
        error: "Error al crear el médico: " + error.message,
        formData: req.body,
        userType: req.session?.userType || "guest",
      });
    }
  },

  // metodo para editar un medico buscando por id
  editarMedico: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, especialidad_Id, telefono, matricula } =
        req.body;
      const [updated] = await Medico.update(
        { dni, nombre, apellido, especialidad_Id, telefono, matricula },
        { where: { id } }
      );

      if (updated) {
        res.redirect(
          "/medicos/listar?success=true&message=Médico+actualizado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Médico no encontrado",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al editar el medico:", error);

      res.status(500).render("error", {
        message: "Error al actualizar médico",
        error,
      });
    }
  },

  // metodo para borrar un medico buscando por su id
  borrarMedico: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Medico.destroy({ where: { id } });

      if (deleted) {
        res.redirect(
          "/medicos/admin?success=true&message=Médico+eliminado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Médico no encontrado al intentar eliminar",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al borrar el medico:", error);

      res.status(500).render("error", {
        message: "Error al eliminar médico",
        error,
      });
    }
  },
  // MÉTODOS DE API

  getMedicosPorEspecialidad: async (req, res) => {
    try {
      const { especialidad_Id } = req.params;
      const medicos = await Medico.findAll({
        where: { especialidad_Id },
        include: [
          {
            model: Especialidad,
            attributes: ["id", "nombre"],
          },
        ],
        attributes: ["id", "nombre", "apellido", "matricula"],

        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      res.json(medicos);
    } catch (error) {
      console.error("Error al obtener médicos por especialidad:", error);
      res.status(500).json({
        error: "Error al obtener médicos",
        message: error.message,
      });
    }
  },

  getAllMedicos: async (req, res) => {
    try {
      const medicos = await Medico.findAll({
        include: [
          {
            model: Especialidad,
            attributes: ["id", "nombre"],
          },
        ],
        order: [
          ["apellido", "ASC"],
          ["nombre", "ASC"],
        ],
      });

      return res.json(medicos);
    } catch (error) {
      console.error("Error al obtener todos los médicos:", error);
      res.status(500).json({
        error: "Error al obtener médicos",
        message: error.message,
      });
    }
  },
};

module.exports = medicoController;

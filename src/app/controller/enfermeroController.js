const Enfermero = require("../model/enfermero");
const sequelize = require("sequelize");

//dentro de este controlador se encuentran los métodos para manejar las peticiones http para la tabla Enfermero
const enfermeroController = {
  // MÉTODOS DE RENDERIZADO DE VISTAS

  // Vista principal de enfermeros
  index: async (req, res) => {
    try {
      res.render("vistasEnfermeros/portadaEnfermeros", {
        title: "Enfermeros",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index enfermeros:", error);
      res.status(500).render("error", {
        message: "Error en la página de enfermeros",
        error,
      });
    }
  },

  // Vista para listar todos los enfermeros
  listarView: async (req, res) => {
    try {
      const enfermeros = await Enfermero.findAll();
      res.render("vistasEnfermeros/listarEnfermeros", {
        title: "Listar Enfermeros",
        enfermeros,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar enfermeros:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de enfermeros",
        error,
      });
    }
  },

  // Vista de administración de enfermeros
  adminView: async (req, res) => {
    try {
      res.render("vistasEnfermeros/administrarEnfermeros", {
        title: "Administrar Enfermeros",
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

  // Vista de formulario para nuevo enfermero
  nuevoView: async (req, res) => {
    try {
      res.render("vistasEnfermeros/nuevoEnfermero", {
        title: "Nuevo Enfermero",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en formulario nuevo enfermero:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario",
        error,
      });
    }
  },

  // Vista para borrar enfermeros
  borrarView: async (req, res) => {
    try {
      const enfermeros = await Enfermero.findAll();
      res.render("vistasEnfermeros/borrarEnfermero", {
        title: "Borrar Enfermero",
        enfermeros,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista borrar enfermero:", error);
      res.status(500).render("error", {
        message: "Error al cargar enfermeros para borrar",
        error,
      });
    }
  },

  // Vista para editar enfermeros
  editarView: async (req, res) => {
    try {
      const { id } = req.query;
      let enfermeroAEditar = null;

      if (id) {
        enfermeroAEditar = await Enfermero.findByPk(id);
        if (!enfermeroAEditar) {
          return res.status(404).render("error", {
            message: "Enfermero no encontrado",
          });
        }
      }

      const enfermeros = await Enfermero.findAll();
      res.render("vistasEnfermeros/editarEnfermeros", {
        title: "Editar Enfermero",
        enfermeros,
        enfermeroAEditar,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista editar enfermero:", error);
      res.status(500).render("error", {
        message: "Error al cargar datos para editar",
        error,
      });
    }
  },

  // Vista para seleccionar enfermero
  seleccionarView: async (req, res) => {
    try {
      const enfermeros = await Enfermero.findAll();
      const areas = await Enfermero.findAll({
        attributes: [[sequelize.fn("DISTINCT", sequelize.col("area")), "area"]],
      });

      res.render("vistasEnfermeros/seleccionarEnfermero", {
        title: "Seleccionar Enfermero",
        enfermeros,
        areas: areas.map((e) => e.area),
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista seleccionar enfermero:", error);
      res.status(500).render("error", {
        message: "Error al cargar selección de enfermeros",
        error,
      });
    }
  },

  // MÉTODOS PARA OPERACIONES CRUD

  // Método para agregar un nuevo enfermero
  crearEnfermero: async (req, res) => {
    try {
      console.log("Creando nuevo enfermero:", req.body);
      const { dni, nombre, apellido, area, telefono } = req.body;
      const nuevoEnfermero = await Enfermero.create({
        dni,
        nombre,
        apellido,
        area,
        telefono,
      });

      res.redirect(
        "/enfermeros/admin?success=true&message=Enfermero+creado+correctamente"
      );
    } catch (error) {
      console.error("Error al crear el enfermero:", error);

      res.status(500).render("vistasEnfermeros/nuevoEnfermero", {
        title: "Nuevo Enfermero",
        error: "Error al crear el enfermero: " + error.message,
        formData: req.body,
        userType: req.session?.userType || "guest",
      });
    }
  },

  // Método para editar un enfermero buscando por id
  editarEnfermero: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, area, telefono } = req.body;
      const [updated] = await Enfermero.update(
        { dni, nombre, apellido, area, telefono },
        { where: { id } }
      );

      if (updated) {
        res.redirect(
          "/enfermeros/admin?success=true&message=Enfermero+actualizado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Enfermero no encontrado",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al editar el enfermero:", error);

      res.status(500).render("error", {
        message: "Error al actualizar enfermero",
        error,
      });
    }
  },

  // Método para borrar un enfermero buscando por su id
  borrarEnfermero: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Enfermero.destroy({ where: { id } });

      if (deleted) {
        res.redirect(
          "/enfermeros/admin?success=true&message=Enfermero+eliminado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Enfermero no encontrado al intentar eliminar",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al borrar el enfermero:", error);

      res.status(500).render("error", {
        message: "Error al eliminar enfermero",
        error,
      });
    }
  },
};

module.exports = enfermeroController;

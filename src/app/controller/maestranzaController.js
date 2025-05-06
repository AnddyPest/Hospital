const Maestranza = require("../model/maestranza");
const sequelize = require("sequelize");

// Controlador para manejar las peticiones http para la tabla Maestranza
const maestranzaController = {
  // MÉTODOS DE RENDERIZADO DE VISTAS

  // Vista principal de maestranzas
  index: async (req, res) => {
    try {
      res.render("vistasMaestranzas/portadaMaestranzas", {
        title: "Personal de Maestranza",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index maestranzas:", error);
      res.status(500).render("error", {
        message: "Error en la página de maestranzas",
        error,
      });
    }
  },

  // Vista para listar todos los maestranzas
  listarView: async (req, res) => {
    try {
      const maestranzas = await Maestranza.findAll();
      res.render("vistasMaestranzas/listarMaestranzas", {
        title: "Listar Personal de Maestranza",
        maestranzas,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar maestranzas:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de personal de maestranza",
        error,
      });
    }
  },

  // Vista de administración de maestranzas
  adminView: async (req, res) => {
    try {
      res.render("vistasMaestranzas/administrarMaestranzas", {
        title: "Administrar Personal de Maestranza",
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

  // Vista de formulario para nuevo maestranza
  nuevoView: async (req, res) => {
    try {
      res.render("vistasMaestranzas/nuevoMaestranza", {
        title: "Nuevo Personal de Maestranza",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en formulario nuevo maestranza:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario",
        error,
      });
    }
  },

  // Vista para borrar maestranzas
  borrarView: async (req, res) => {
    try {
      const maestranzas = await Maestranza.findAll();
      res.render("vistasMaestranzas/borrarMaestranza", {
        title: "Borrar Personal de Maestranza",
        maestranzas,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista borrar maestranza:", error);
      res.status(500).render("error", {
        message: "Error al cargar personal para borrar",
        error,
      });
    }
  },

  // Vista para editar maestranzas
  editarView: async (req, res) => {
    try {
      const { id } = req.query;
      let maestranzaAEditar = null;

      if (id) {
        maestranzaAEditar = await Maestranza.findByPk(id);
        if (!maestranzaAEditar) {
          return res.status(404).render("error", {
            message: "Personal de maestranza no encontrado",
          });
        }
      }

      const maestranzas = await Maestranza.findAll();
      res.render("vistasMaestranzas/editarMaestranzas", {
        title: "Editar Personal de Maestranza",
        maestranzas,
        maestranzaAEditar,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista editar maestranza:", error);
      res.status(500).render("error", {
        message: "Error al cargar datos para editar",
        error,
      });
    }
  },

  // Vista para seleccionar maestranza
  seleccionarView: async (req, res) => {
    try {
      const maestranzas = await Maestranza.findAll();
      const areas = await Maestranza.findAll({
        attributes: [[sequelize.fn("DISTINCT", sequelize.col("area")), "area"]],
      });

      res.render("vistasMaestranzas/seleccionarMaestranza", {
        title: "Seleccionar Personal de Maestranza",
        maestranzas,
        areas: areas.map((e) => e.area),
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista seleccionar maestranza:", error);
      res.status(500).render("error", {
        message: "Error al cargar selección de personal",
        error,
      });
    }
  },

  // MÉTODOS PARA OPERACIONES CRUD

  // Método para agregar un nuevo maestranza
  crearMaestranza: async (req, res) => {
    try {
      console.log("Creando nuevo personal de maestranza:", req.body);
      const { dni, nombre, apellido, area, telefono } = req.body;
      const nuevoMaestranza = await Maestranza.create({
        dni,
        nombre,
        apellido,
        area,
        telefono,
      });

      res.redirect(
        "/maestranzas/admin?success=true&message=Personal+de+maestranza+creado+correctamente"
      );
    } catch (error) {
      console.error("Error al crear personal de maestranza:", error);

      res.status(500).render("vistasMaestranzas/nuevoMaestranza", {
        title: "Nuevo Personal de Maestranza",
        error: "Error al crear: " + error.message,
        formData: req.body,
        userType: req.session?.userType || "guest",
      });
    }
  },

  // Método para editar un maestranza buscando por id
  editarMaestranza: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, area, telefono } = req.body;
      const [updated] = await Maestranza.update(
        { dni, nombre, apellido, area, telefono },
        { where: { id } }
      );

      if (updated) {
        res.redirect(
          "/maestranzas/admin?success=true&message=Personal+de+maestranza+actualizado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Personal de maestranza no encontrado",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al editar el personal de maestranza:", error);

      res.status(500).render("error", {
        message: "Error al actualizar personal",
        error,
      });
    }
  },

  // Método para borrar un maestranza buscando por su id
  borrarMaestranza: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Maestranza.destroy({ where: { id } });

      if (deleted) {
        res.redirect(
          "/maestranzas/admin?success=true&message=Personal+de+maestranza+eliminado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Personal de maestranza no encontrado al intentar eliminar",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al borrar personal de maestranza:", error);

      res.status(500).render("error", {
        message: "Error al eliminar personal",
        error,
      });
    }
  },
};

module.exports = maestranzaController;

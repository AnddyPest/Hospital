const Administrativo = require("../model/administrativo");
const sequelize = require("sequelize");

// Controlador para manejar las peticiones http para la tabla Administrativo
const administrativoController = {
  // MÉTODOS DE RENDERIZADO DE VISTAS

  // Vista principal de administrativos
  index: async (req, res) => {
    try {
      res.render("vistasAdministrativos/portadaAdministrativos", {
        title: "Administrativos",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index administrativos:", error);
      res.status(500).render("error", {
        message: "Error en la página de administrativos",
        error,
      });
    }
  },

  // Vista para listar todos los administrativos
  listarView: async (req, res) => {
    try {
      const administrativos = await Administrativo.findAll();
      res.render("vistasAdministrativos/listarAdministrativos", {
        title: "Listar Administrativos",
        administrativos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar administrativos:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de administrativos",
        error,
      });
    }
  },

  // Vista de administración de administrativos
  adminView: async (req, res) => {
    try {
      res.render("vistasAdministrativos/administrarAdministrativos", {
        title: "Administrar Administrativos",
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

  // Vista de formulario para nuevo administrativo
  nuevoView: async (req, res) => {
    try {
      res.render("vistasAdministrativos/nuevoAdministrativo", {
        title: "Nuevo Administrativo",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en formulario nuevo administrativo:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario",
        error,
      });
    }
  },

  // Vista para borrar administrativos
  borrarView: async (req, res) => {
    try {
      const administrativos = await Administrativo.findAll();
      res.render("vistasAdministrativos/borrarAdministrativo", {
        title: "Borrar Administrativo",
        administrativos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista borrar administrativo:", error);
      res.status(500).render("error", {
        message: "Error al cargar administrativos para borrar",
        error,
      });
    }
  },

  // Vista para editar administrativos
  editarView: async (req, res) => {
    try {
      const { id } = req.query;
      let administrativoAEditar = null;

      if (id) {
        administrativoAEditar = await Administrativo.findByPk(id);
        if (!administrativoAEditar) {
          return res.status(404).render("error", {
            message: "Administrativo no encontrado",
          });
        }
      }

      const administrativos = await Administrativo.findAll();
      res.render("vistasAdministrativos/editarAdministrativos", {
        title: "Editar Administrativo",
        administrativos,
        administrativoAEditar,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista editar administrativo:", error);
      res.status(500).render("error", {
        message: "Error al cargar datos para editar",
        error,
      });
    }
  },

  // Vista para seleccionar administrativo
  seleccionarView: async (req, res) => {
    try {
      const administrativos = await Administrativo.findAll();
      const areas = await Administrativo.findAll({
        attributes: [[sequelize.fn("DISTINCT", sequelize.col("area")), "area"]],
      });

      res.render("vistasAdministrativos/seleccionarAdministrativo", {
        title: "Seleccionar Administrativo",
        administrativos,
        areas: areas.map((e) => e.area),
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista seleccionar administrativo:", error);
      res.status(500).render("error", {
        message: "Error al cargar selección de administrativos",
        error,
      });
    }
  },

  // MÉTODOS PARA OPERACIONES CRUD

  // Método para agregar un nuevo administrativo
  crearAdministrativo: async (req, res) => {
    try {
      console.log("Creando nuevo administrativo:", req.body);
      const { dni, nombre, apellido, area, telefono } = req.body;
      const nuevoAdministrativo = await Administrativo.create({
        dni,
        nombre,
        apellido,
        area,
        telefono,
      });

      res.redirect(
        "/administrativos/admin?success=true&message=Administrativo+creado+correctamente"
      );
    } catch (error) {
      console.error("Error al crear el administrativo:", error);

      res.status(500).render("vistasAdministrativos/nuevoAdministrativo", {
        title: "Nuevo Administrativo",
        error: "Error al crear el administrativo: " + error.message,
        formData: req.body,
        userType: req.session?.userType || "guest",
      });
    }
  },

  // Método para editar un administrativo buscando por id
  editarAdministrativo: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, area, telefono } = req.body;
      const [updated] = await Administrativo.update(
        { dni, nombre, apellido, area, telefono },
        { where: { id } }
      );

      if (updated) {
        res.redirect(
          "/administrativos/admin?success=true&message=Administrativo+actualizado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Administrativo no encontrado",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al editar el administrativo:", error);

      res.status(500).render("error", {
        message: "Error al actualizar administrativo",
        error,
      });
    }
  },

  // Método para borrar un administrativo buscando por su id
  borrarAdministrativo: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Administrativo.destroy({ where: { id } });

      if (deleted) {
        res.redirect(
          "/administrativos/admin?success=true&message=Administrativo+eliminado+correctamente"
        );
      } else {
        res.status(404).render("error", {
          message: "Administrativo no encontrado al intentar eliminar",
          error: { status: 404 },
        });
      }
    } catch (error) {
      console.error("Error al borrar el administrativo:", error);

      res.status(500).render("error", {
        message: "Error al eliminar administrativo",
        error,
      });
    }
  },
};

module.exports = administrativoController;

const Area = require("../model/area");
const sequelize = require("sequelize");

const areaController = {
  // Vista principal de áreas
  index: async (req, res) => {
    try {
      res.render("vistasDatos/vistaAreas", {
        title: "Áreas",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index area:", error);
      res.status(500).render("error", {
        message: "Error en la página de áreas",
        error,
      });
    }
  },
  // Vista para listar todas las áreas
  listarView: async (req, res) => {
    try {
      const areas = await Area.findAll();
      res.render("vistasDatos/listarAreas", {
        title: "Listar Áreas",
        areas,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar áreas:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de áreas",
        error,
      });
    }
  },
  // Vista para crear una nueva área
  nuevoView: async (req, res) => {
    try {
      res.render("vistasDatos/nuevaAreas", {
        title: "Nueva Área",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de nueva área:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de nueva área",
        error,
      });
    }
  },
  // Vista para editar un área
  editarView: async (req, res) => {
    try {
      const areas = await Area.findAll({
        order: [["nombre", "ASC"]],
      });
      res.render("vistasDatos/editarAreas", {
        title: "Editar Área",
        areas,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de editar área:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de edición de área",
        error,
      });
    }
  },
  // Vista para eliminar un área
  eliminarView: async (req, res) => {
    try {
      const areas = await Area.findAll({
        order: [["nombre", "ASC"]],
      });

      res.render("vistasDatos/borrarAreas", {
        title: "Eliminar Área",
        areas,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de eliminar área:", error);
      res.status(500).render("error", {
        message: "Error al cargar la vista de eliminación de área",
        error,
      });
    }
  },
  // Crear una nueva área
  crear: async (req, res) => {
    try {
      const { nombre } = req.body;
      const nuevaArea = await Area.create({ nombre });
      res.redirect("/areas/listar");
    } catch (error) {
      console.error("Error al crear área:", error);
      res.status(500).render("error", {
        message: "Error al crear el área",
        error,
      });
    }
  },
  // Editar un área
  editar: async (req, res) => {
    try {
      const areaId = req.params.id;
      const { nombre } = req.body;

      // Buscar el área
      const area = await Area.findByPk(areaId);

      if (!area) {
        return res.status(404).json({
          success: false,
          message: "Área no encontrada",
        });
      }

      // Actualizar el área
      await area.update({ nombre });

      // Devolver respuesta JSON de éxito
      return res.status(200).json({
        success: true,
        message: "Área actualizada correctamente",
        data: {
          id: area.id,
          nombre: area.nombre,
        },
      });
    } catch (error) {
      console.error("Error al editar área:", error);

      // Devolver respuesta JSON de error
      return res.status(500).json({
        success: false,
        message: "Error al editar el área",
        error: error.message,
      });
    }
  },
  // Eliminar un área
  eliminar: async (req, res) => {
    try {
      const areaId = req.params.id;
      const area = await Area.findByPk(areaId);
      if (!area) {
        return res.status(404).render("error", {
          message: "Área no encontrada",
        });
      }
      await area.destroy();
      res.redirect("/areas/listar");
    } catch (error) {
      console.error("Error al eliminar área:", error);
      res.status(500).render("error", {
        message: "Error al eliminar el área",
        error,
      });
    }
  },
  listar: async (req, res) => {
    try {
      const areas = await Area.findAll({
        attributes: ["id", "nombre"],
        order: [["nombre", "ASC"]],
      });

      res.json(areas);
    } catch (error) {
      console.error("Error al listar áreas:", error);
      res
        .status(500)
        .json({ error: "Error al listar áreas", message: error.message });
    }
  },
};
module.exports = areaController;

const Area = require("../model/area");
const sequelize = require("sequelize");

const areaController = {
  // Vista principal de áreas
  index: async (req, res) => {
    try {
      res.render("vistasArea/portadaArea", {
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
      res.render("vistasArea/listarArea", {
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
      res.render("vistasArea/nuevaArea", {
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
      const areaId = req.params.id;
      const area = await Area.findByPk(areaId);
      if (!area) {
        return res.status(404).render("error", {
          message: "Área no encontrada",
        });
      }
      res.render("vistasArea/editarArea", {
        title: "Editar Área",
        area,
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
      const areaId = req.params.id;
      const area = await Area.findByPk(areaId);
      if (!area) {
        return res.status(404).render("error", {
          message: "Área no encontrada",
        });
      }
      res.render("vistasArea/eliminarArea", {
        title: "Eliminar Área",
        area,
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
      const area = await Area.findByPk(areaId);
      if (!area) {
        return res.status(404).render("error", {
          message: "Área no encontrada",
        });
      }
      await area.update({ nombre });
      res.redirect("/areas/listar");
    } catch (error) {
      console.error("Error al editar área:", error);
      res.status(500).render("error", {
        message: "Error al editar el área",
        error,
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

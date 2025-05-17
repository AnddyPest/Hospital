const Especialidad = require("../model/especialidad");
const sequelize = require("sequelize");

const especialidadController = {
  // Vista principal de especialidades
  index: async (req, res) => {
    try {
      const especialidades = await Especialidad.findAll();
      res.render("vistasDatos/vistaEspecialidades", {
        title: "Especialidades",
        especialidades,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index especialidad:", error);
      res.status(500).render("error", {
        message: "Error en la página de especialidades",
        error,
      });
    }
  },
  // Vista para listar todas las especialidades
  listarView: async (req, res) => {
    try {
      const especialidades = await Especialidad.findAll();
      res.render("vistasEspecialidad/listarEspecialidad", {
        title: "Listar Especialidades",
        especialidades,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar especialidades:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de especialidades",
        error,
      });
    }
  },
  // Vista para crear una nueva especialidad
  nuevoView: async (req, res) => {
    try {
      res.render("vistasDatos/nuevaEspecialidad", {
        title: "Nueva Especialidad",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de nueva especialidad:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de nueva especialidad",
        error,
      });
    }
  },
  //ambl vista para editar una especialidad
  editarView: async (req, res) => {
    try {
      const especialidades = await Especialidad.findAll({
        order: [["nombre", "ASC"]],
      });

      res.render("vistasDatos/editarEspecialidades", {
        title: "Editar Especialidad",
        especialidades,

        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de editar especialidad:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de editar especialidad",
        error,
      });
    }
  },
  // Vista para eliminar una especialidad
  eliminarView: async (req, res) => {
    try {
      const especialidades = await Especialidad.findAll({
        order: [["nombre", "ASC"]],
      });

      res.render("vistasDatos/borrarEspecialidades", {
        title: "Eliminar Especialidad",
        especialidades,
        order: [["nombre", "ASC"]],
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de eliminar especialidad:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de eliminar especialidad",
        error,
      });
    }
  },
  // crear una nueva especialidad
  crear: async (req, res) => {
    try {
      const { nombre } = req.body;
      const nuevaEspecialidad = await Especialidad.create({ nombre });
      res.redirect("/especialidades/listado");
    } catch (error) {
      console.error("Error al crear especialidad:", error);
      res.status(500).render("error", {
        message: "Error al crear la especialidad",
        error,
      });
    }
  },
  // editar una especialidad
  editar: async (req, res) => {
    try {
      const especialidadId = req.params.id;
      const { nombre } = req.body;

      // Buscar el área
      const especialidad = await Especialidad.findByPk(especialidadId);

      if (!especialidad) {
        return res.status(404).json({
          success: false,
          message: "Área no encontrada",
        });
      }

      // Actualizar el área
      await especialidad.update({ nombre });

      // Devolver respuesta JSON de éxito
      return res.status(200).json({
        success: true,
        message: "Especialidad actualizada correctamente",
        data: {
          id: especialidad.id,
          nombre: especialidad.nombre,
        },
      });
    } catch (error) {
      console.error("Error al editar especialidad:", error);

      // Devolver respuesta JSON de error
      return res.status(500).json({
        success: false,
        message: "Error al editar el especialidad",
        error: error.message,
      });
    }
  },
  // eliminar una especialidad
  eliminar: async (req, res) => {
    try {
      const especialidadId = req.params.id;
      const especialidad = await Especialidad.findByPk(especialidadId);
      if (!especialidad) {
        return res.status(404).render("error", {
          message: "Especialidad no encontrada",
        });
      }
      await especialidad.destroy();
      res.redirect("/especialidades/listado");
    } catch (error) {
      console.error("Error al eliminar especialidad:", error);
      res.status(500).render("error", {
        message: "Error al eliminar la especialidad",
        error,
      });
    }
  },
  listar: async (req, res) => {
    try {
      const especialidades = await Especialidad.findAll({
        attributes: ["id", "nombre"],
        order: [["nombre", "ASC"]],
      });
      res.render("vistasDatos/listarEspecialidades", {
        title: "Listado de Especialidades",
        especialidades,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar especialidades:", error);
      res.status(500).json({
        error: "Error al listar especialidades",
        message: error.message,
      });
    }
  },
};
module.exports = especialidadController;

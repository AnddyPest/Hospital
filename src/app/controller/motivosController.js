const Motivos = require("../model/motivos");
const sequelize = require("sequelize");

const motivosController = {
  //portada motivos
  // Vista principal de motivos
  index: async (req, res) => {
    try {
      res.render("vistasDatos/vistaMotivos", {
        title: "Motivos",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index motivos:", error);
      res.status(500).render("error", {
        message: "Error en la página de motivos",
        error,
      });
    }
  },
  // Vista para listar todos los motivos
  listarView: async (req, res) => {
    try {
      // Simplemente cargar todos los motivos sin filtrar
      const motivos = await Motivos.findAll();

      res.render("vistasMotivos/listarMotivos", {
        title: "Listar Motivos",
        motivos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar motivos:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de motivos",
        error,
      });
    }
  },
  // nuevo motivo
  nuevoView: async (req, res) => {
    try {
      res.render("vistasDatos/nuevaMotivos", {
        title: "Nuevo Motivo",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de nuevo motivo:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de nuevo motivo",
        error,
      });
    }
  },
  // Vista para editar un motivo
  editarView: async (req, res) => {
    try {
      const motivos = await Motivos.findAll({
        order: [["nombre", "ASC"]],
      });
      res.render("vistasDatos/editarMotivos", {
        title: "Editar Motivo",
        motivos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de editar Motivo:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de edición de Motivo",
        error,
      });
    }
  },
  // Vista para eliminar un motivo
  eliminarView: async (req, res) => {
    try {
      const motivos = await Motivos.findAll({
        order: [["nombre", "ASC"]],
      });

      res.render("vistasDatos/borrarMotivos", {
        title: "Eliminar Area",
        motivos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de eliminar Area:", error);
      res.status(500).render("error", {
        message: "Error al cargar la vista de eliminación de Area",
        error,
      });
    }
  },
  // listar motivos
  crear: async (req, res) => {
    try {
      const { nombre } = req.body;
      const nuevoMotivo = await Motivos.create({ nombre });
      res.redirect("/motivos/listado");
    } catch (error) {
      console.error("Error al crear motivo:", error);
      res.status(500).render("error", {
        message: "Error al crear el motivo",
        error,
      });
    }
  },
  // Editar un área
  editar: async (req, res) => {
    try {
      const motivoId = req.params.id;
      const { nombre } = req.body;

      // Buscar el área
      const motivo = await Motivos.findByPk(motivoId);

      if (!motivo) {
        return res.status(404).json({
          success: false,
          message: "Motivo no encontrado",
        });
      }

      // Actualizar el área
      await motivo.update({ nombre });

      // Devolver respuesta JSON de éxito
      return res.status(200).json({
        success: true,
        message: "Motivo actualizado correctamente",
        data: {
          id: motivo.id,
          nombre: motivo.nombre,
        },
      });
    } catch (error) {
      console.error("Error al editar motivo:", error);

      // Devolver respuesta JSON de error
      return res.status(500).json({
        success: false,
        message: "Error al editar el motivo",
        error: error.message,
      });
    }
  },
  // Eliminar un área
  eliminar: async (req, res) => {
    try {
      const motivoId = req.params.id;
      const motivo = await Motivos.findByPk(motivoId);
      if (!motivo) {
        return res.status(404).render("error", {
          message: "Motivo no encontrado",
        });
      }
      await motivo.destroy();
      res.redirect("/motivos/listado");
    } catch (error) {
      console.error("Error al eliminar Motivo:", error);
      res.status(500).render("error", {
        message: "Error al eliminar el Motivo",
        error,
      });
    }
  },
  listar: async (req, res) => {
    try {
      const motivos = await Motivos.findAll({
        attributes: ["id", "nombre"],
        order: [["nombre", "ASC"]],
      });

      res.json(motivos);
    } catch (error) {
      console.error("Error al listar motivos:", error);
      res
        .status(500)
        .json({ error: "Error al listar motivos", message: error.message });
    }
  },
};

module.exports = motivosController;

const Motivos = require("../model/motivos");
const sequelize = require("sequelize");

const motivosController = {
  //portada motivos
  // Vista principal de motivos
  index: async (req, res) => {
    try {
      res.render("vistasMotivos/portadaMotivos", {
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
      res.render("vistasMotivos/nuevoMotivo", {
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
      const motivoId = req.params.id;
      const motivo = await Motivos.findByPk(motivoId);

      if (!motivo) {
        return res.status(404).render("error", {
          message: "Motivo no encontrado",
        });
      }

      res.render("vistasMotivos/editarMotivo", {
        title: "Editar Motivo",
        motivo,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de editar motivo:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de editar motivo",
        error,
      });
    }
  },
  // Vista para eliminar un motivo
  eliminarView: async (req, res) => {
    try {
      const motivoId = req.params.id;
      const motivo = await Motivos.findByPk(motivoId);

      if (!motivo) {
        return res.status(404).render("error", {
          message: "Motivo no encontrado",
        });
      }

      res.render("vistasMotivos/eliminarMotivo", {
        title: "Eliminar Motivo",
        motivo,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de eliminar motivo:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de eliminar motivo",
        error,
      });
    }
  },
  // listar motivos
  listarMotivos: async (req, res) => {
    try {
      const motivos = await Motivos.findAll({
        order: [["nombre", "ASC"]],
      });
      res.json(motivos);
    } catch (error) {
      console.error("Error al listar motivos:", error);
      res.status(500).json({ error: "Error al listar motivos" });
    }
  },
};

module.exports = motivosController;

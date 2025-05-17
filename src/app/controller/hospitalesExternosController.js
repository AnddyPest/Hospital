const HospitalesExternos = require("../model/hospitalesExternos");
const sequelize = require("sequelize");

const hospitalesExternosController = {
  // Vista principal de hospitales externos
  index: async (req, res) => {
    try {
      res.render("vistasDatos/vistaHospExternos", {
        title: "Hospitales Externos",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index hospitales externos:", error);
      res.status(500).render("error", {
        message: "Error en la página de hospitales externos",
        error,
      });
    }
  },
  // Vista para listar todos los hospitales externos
  listarView: async (req, res) => {
    try {
      const hospitalesExternos = await HospitalesExternos.findAll();
      res.render("vistasHospitalesExternos/listarHospitalesExternos", {
        title: "Listar Hospitales Externos",
        hospitalesExternos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar hospitales externos:", error);
      res.status(500).render("error", {
        message: "Error al cargar la lista de hospitales externos",
        error,
      });
    }
  },
  // Vista para crear un nuevo hospital externo
  nuevoView: async (req, res) => {
    try {
      res.render("vistasDatos/nuevaHospExternos", {
        title: "Nuevo Hospital Externo",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de nuevo hospital externo:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de nuevo hospital externo",
        error,
      });
    }
  },
  // Vista para editar un hospital externo
  editarView: async (req, res) => {
    try {
      const hospitales_externos = await HospitalesExternos.findAll({
        attributes: ["id", "nombre", "complejidad"],
        order: [["nombre", "ASC"]],
      });
      if (!hospitales_externos) {
        return res.status(404).render("error", {
          message: "Hospital externo no encontrado",
        });
      }
      res.render("vistasDatos/editarHospExternos", {
        title: "Editar Hospital Externo",
        hospitales_externos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de editar hospital externo:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de editar hospital externo",
        error,
      });
    }
  },
  // Vista para eliminar un hospital externo
  eliminarView: async (req, res) => {
    try {
      const hospitales_externos = await HospitalesExternos.findAll({
        attributes: ["id", "nombre", "complejidad"],
        order: [["nombre", "ASC"]],
      });
      if (!hospitales_externos) {
        return res.status(404).render("error", {
          message: "Hospital externo no encontrado",
        });
      }
      res.render("vistasDatos/borrarHospExternos", {
        title: "Eliminar Hospital Externo",
        hospitales_externos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en vista de eliminar hospital externo:", error);
      res.status(500).render("error", {
        message: "Error al cargar el formulario de eliminar hospital externo",
        error,
      });
    }
  },
  // Crear un nuevo hospital externo
  crear: async (req, res) => {
    try {
      const { nombre, complejidad } = req.body;
      await HospitalesExternos.create({
        nombre,
        complejidad,
      });
      res.redirect("/hospitalesExternos/listado");
    } catch (error) {
      console.error("Error al crear hospital externo:", error);
      res.status(500).render("error", {
        message: "Error al crear el hospital externo",
        error,
      });
    }
  },
  // Editar un hospital externo
  editar: async (req, res) => {
    try {
      const externoId = req.params.id;
      const { nombre, complejidad } = req.body;

      // Buscar el área
      const hospitales_externos = await HospitalesExternos.findByPk(externoId);

      if (!hospitales_externos) {
        return res.status(404).json({
          success: false,
          message: "Externo no encontrada",
        });
      }

      // Actualizar el Externo
      await hospitales_externos.update({ nombre, complejidad });

      // Devolver respuesta JSON de éxito
      return res.status(200).json({
        success: true,
        message: "Externo actualizada correctamente",
        data: {
          id: hospitales_externos.id,
          nombre: hospitales_externos.nombre,
          complejidad: hospitales_externos.complejidad,
        },
      });
    } catch (error) {
      console.error("Error al editar Externo:", error);

      // Devolver respuesta JSON de error
      return res.status(500).json({
        success: false,
        message: "Error al editar el Externo",
        error: error.message,
      });
    }
  },
  // Eliminar un hospital externo
  eliminar: async (req, res) => {
    try {
      const externoId = req.params.id;
      const hospital_externo = await HospitalesExternos.findByPk(externoId);
      if (!hospital_externo) {
        return res.status(404).render("error", {
          message: "Externo no encontrada",
        });
      }
      await hospital_externo.destroy();
      res.redirect("/hospitalesExternos/listado");
    } catch (error) {
      console.error("Error al eliminar externo:", error);
      res.status(500).render("error", {
        message: "Error al eliminar el Externo",
        error,
      });
    }
  },
  listar: async (req, res) => {
    try {
      const hospitales_externos = await HospitalesExternos.findAll({
        attributes: ["id", "nombre", "complejidad"],
        order: [["nombre", "ASC"]],
      });

      res.render("vistasDatos/listarHospExternos", {
        title: "Listado de Externos",
        hospitales_externos,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al listar Externos", error);
      res
        .status(500)
        .json({ error: "Error al listar Externos", message: error.message });
    }
  },
};
module.exports = hospitalesExternosController;

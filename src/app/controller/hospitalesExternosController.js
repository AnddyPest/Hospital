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
      res.render("vistasHospitalesExternos/nuevoHospitalExterno", {
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
      const hospitalExternoId = req.params.id;
      const hospitalExterno = await HospitalesExternos.findByPk(
        hospitalExternoId
      );
      if (!hospitalExterno) {
        return res.status(404).render("error", {
          message: "Hospital externo no encontrado",
        });
      }
      res.render("vistasHospitalesExternos/editarHospitalExterno", {
        title: "Editar Hospital Externo",
        hospitalExterno,
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
      const hospitalExternoId = req.params.id;
      const hospitalExterno = await HospitalesExternos.findByPk(
        hospitalExternoId
      );
      if (!hospitalExterno) {
        return res.status(404).render("error", {
          message: "Hospital externo no encontrado",
        });
      }
      res.render("vistasHospitalesExternos/eliminarHospitalExterno", {
        title: "Eliminar Hospital Externo",
        hospitalExterno,
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
  crearHospitalExterno: async (req, res) => {
    try {
      const { nombre, direccion, telefono } = req.body;
      await HospitalesExternos.create({
        nombre,
        direccion,
        telefono,
      });
      res.redirect("/hospitalesExternos/listar");
    } catch (error) {
      console.error("Error al crear hospital externo:", error);
      res.status(500).render("error", {
        message: "Error al crear el hospital externo",
        error,
      });
    }
  },
  // Editar un hospital externo
  editarHospitalExterno: async (req, res) => {
    try {
      const hospitalExternoId = req.params.id;
      const { nombre, direccion, telefono } = req.body;
      const hospitalExterno = await HospitalesExternos.findByPk(
        hospitalExternoId
      );
      if (!hospitalExterno) {
        return res.status(404).render("error", {
          message: "Hospital externo no encontrado",
        });
      }
      await HospitalesExternos.update(
        { nombre, direccion, telefono },
        { where: { id: hospitalExternoId } }
      );
      res.redirect("/hospitalesExternos/listar");
    } catch (error) {
      console.error("Error al editar hospital externo:", error);
      res.status(500).render("error", {
        message: "Error al editar el hospital externo",
        error,
      });
    }
  },
  // Eliminar un hospital externo
  eliminarHospitalExterno: async (req, res) => {
    try {
      const hospitalExternoId = req.params.id;
      const hospitalExterno = await HospitalesExternos.findByPk(
        hospitalExternoId
      );
      if (!hospitalExterno) {
        return res.status(404).render("error", {
          message: "Hospital externo no encontrado",
        });
      }
      await HospitalesExternos.destroy({ where: { id: hospitalExternoId } });
      res.redirect("/hospitalesExternos/listar");
    } catch (error) {
      console.error("Error al eliminar hospital externo:", error);
      res.status(500).render("error", {
        message: "Error al eliminar el hospital externo",
        error,
      });
    }
  },
};
module.exports = hospitalesExternosController;

const HistoriaClinica = require("../model/historiaClinica");
const Paciente = require("../model/paciente");
const Turno = require("../model/turno");
const sequelize = require("sequelize");
const historiaClinicaController = {
  index: async (req, res) => {
    try {
      res.render("vistasAtencion/portadaAtencion", {
        title: "Historia Clinica",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index historia clinica:", error);
      res.status(500).render("error", {
        message: "Error en la página de historia clinica",
        error,
      });
    }
  },
};
module.exports = historiaClinicaController;

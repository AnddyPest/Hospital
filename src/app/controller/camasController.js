const Camas = require("../model/camas");
const Paciente = require("../model/paciente");
const sequelize = require("sequelize");

const camasController = {
  index: async (req, res) => {
    try {
      res.render("vistasPlazas/portadaPlazas", {
        title: "Camas",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error en index camas:", error);
      res.status(500).render("error", {
        message: "Error en la página de camas",
        error,
      });
    }
  },
};

module.exports = camasController;

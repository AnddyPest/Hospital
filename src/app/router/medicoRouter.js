const express = require("express");
const router = express.Router();
const {
  obtenerMedicos,
  crearMedico,
  listarMedicosPorEspecialidad,
  buscarMedicoPorId,
  actualizarMedicoPorId,
  eliminarMedicoPorId,
} = require("../controller/medicoController");

router.get("/", (req, res) => {
  res.render("../../public/views/medicos", {
    title: "Medicos",
  });
});

router.get("/medicos", obtenerMedicos);
router.post("/medicos", crearMedico);
router.get("/medicos/:especialidad", listarMedicosPorEspecialidad);
router.get("/medicos/:id", buscarMedicoPorId);
router.put("/medicos/:id", actualizarMedicoPorId);
router.delete("/medicos/:id", eliminarMedicoPorId);

module.exports = router;

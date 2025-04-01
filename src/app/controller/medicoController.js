const conexion = require("../database-connection");
const medico = require("../model/medicoModel");

// ABML de Medicos

//traer listado de medicos, intento hacerlo como es en spring, a ver que pasa
const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await medico.findAll();
    res.status(200).json(medicos);
  } catch (error) {
    console.error("Error al obtener medicos:", error);
    res.status(500).json({ error: "Error al obtener medicos" });
  }
};

//crear un medico
const crearMedico = async (req, res) => {
  const { nombre, apellidos, telefono, especialidad } = req.body;
  try {
    const nuevoMedico = await medico.create({
      nombre,
      apellidos,
      telefono,
      especialidad,
    });
    res.status(201).json(nuevoMedico);
  } catch (error) {
    console.error("Error al crear medico:", error);
    res.status(500).json({ error: "Error al crear medico" });
  }
};

//listar medicos por especialidad
const listarMedicosPorEspecialidad = async (req, res) => {
  const especialidad = req.params.especialidad;
  try {
    const medicos = await medico.findAll({
      where: { especialidad },
    });
    res.status(200).json(medicos);
  } catch (error) {
    console.error("Error al obtener medicos por especialidad:", error);
    res
      .status(500)
      .json({ error: "Error al obtener medicos por especialidad" });
  }
};

//buscar medico por id
const buscarMedicoPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const medico = await medico.findByPk(id);
    if (!medico) {
      return res.status(404).json({ error: "Medico no encontrado" });
    }
    res.status(200).json(medico);
  } catch (error) {
    console.error("Error al buscar medico por id:", error);
    res.status(500).json({ error: "Error al buscar medico por id" });
  }
};

//actualizar medico por id
const actualizarMedicoPorId = async (req, res) => {
  const id = req.params.id;
  const { nombre, apellidos, telefono, especialidad } = req.body;
  try {
    const medico = await medico.findByPk(id);
    if (!medico) {
      return res.status(404).json({ error: "Medico no encontrado" });
    }
    await medico.update({
      nombre,
      apellidos,
      telefono,
      especialidad,
    });
    res.status(200).json(medico);
  } catch (error) {
    console.error("Error al actualizar medico por id:", error);
    res.status(500).json({ error: "Error al actualizar medico por id" });
  }
};

//eliminar medico por id
const eliminarMedicoPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const medico = await medico.findByPk(id);
    if (!medico) {
      return res.status(404).json({ error: "Medico no encontrado" });
    }
    await medico.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar medico por id:", error);
    res.status(500).json({ error: "Error al eliminar medico por id" });
  }
};

//exportar funciones
module.exports = {
  obtenerMedicos,
  crearMedico,
  listarMedicosPorEspecialidad,
  buscarMedicoPorId,
  actualizarMedicoPorId,
  eliminarMedicoPorId,
};

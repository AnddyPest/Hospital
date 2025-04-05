const Medico = require("../model/medico");

//dentro de este controlador se encuentran los metodos para manejar las peticiones http para la tabla Medico
const medicoController = {

  // metodo para obtener todos los medicos
  getAllMedicos: async (req, res) => {
    try {
      const medicos = await Medico.findAll();
      res.status(200).json(medicos);
    } catch (error) {
      console.error("Error al obtener los medicos:", error);
      res.status(500).json({ error: "Error al obtener los medicos" });
    }
  },
  
  // metodo para agregar un nuevo medico
  crearMedico: async (req, res) => {
    try {
      console.log("Creando nuevo medico:", req.body);
      const { nombre, apellido, especialidad, telefono } = req.body;
      const nuevoMedico = await Medico.create({
        nombre,
        apellido,
        especialidad,
        telefono,
      });
      res.status(201).json(nuevoMedico);
    } catch (error) {
      console.error("Error al crear el medico:", error);
      res.status(500).json({ error: "Error al crear el medico" });
    }
  },
  
  // metodo para editar un medico buscando por apellido <---- PROBAR!!!!
  editarMedico: async (req, res) => {
    try {
      const { apellido } = req.params;
      const { nombre, especialidad, telefono } = req.body;
      const [updated] = await Medico.update(
        { nombre, especialidad, telefono },
        { where: { apellido } }
      );
      if (updated) {
        const updatedMedico = await Medico.findOne({ where: { apellido } });
        res.status(200).json(updatedMedico);
      } else {
        res.status(404).json({ error: "Medico no encontrado" });
      }
    } catch (error) {
      console.error("Error al editar el medico:", error);
      res.status(500).json({ error: "Error al editar el medico" });
    }
  },
  
  // metodo para borrar un medico buscando por apellido <---- PROBAR!!!!
  borrarMedico: async (req, res) => {
    try {
      const { apellido } = req.params;
      const deleted = await Medico.destroy({ where: { apellido } });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Medico no encontrado" });
      }
    } catch (error) {
      console.error("Error al borrar el medico:", error);
      res.status(500).json({ error: "Error al borrar el medico" });
    }
  },
};

module.exports = medicoController;

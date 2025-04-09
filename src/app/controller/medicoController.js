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
      const { dni, nombre, apellido, especialidad, telefono } = req.body;
      const nuevoMedico = await Medico.create({
        dni,
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

  // metodo para editar un medico buscando por id
  editarMedico: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, especialidad, telefono } = req.body;
      const [updated] = await Medico.update(
        { dni, nombre, apellido, especialidad, telefono },
        { where: { id } }
      );
      if (updated) {
        const updatedMedico = await Medico.findOne({ where: { id } });
        res.status(200).json(updatedMedico);
      } else {
        res.status(404).json({ error: "Medico no encontrado" });
      }
    } catch (error) {
      console.error("Error al editar el medico:", error);
      res.status(500).json({ error: "Error al editar el medico" });
    }
  },

  // metodo para borrar un medico buscando por su id
  borrarMedico: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Medico.destroy({ where: { id } });
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

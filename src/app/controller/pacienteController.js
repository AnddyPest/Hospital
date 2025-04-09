const Paciente = require("../model/paciente");

//dentro de este controlador se encuentran los metodos para manejar las peticiones http para la tabla Medico
const pacienteController = {
  // metodo para obtener todos los medicos
  getAllPacientes: async (req, res) => {
    try {
      const paciente = await Paciente.findAll();
      res.status(200).json(paciente);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
      res.status(500).json({ error: "Error al obtener los pacientes" });
    }
  },

  // metodo para agregar un nuevo medico
  crearPaciente: async (req, res) => {
    try {
      console.log("Creando nuevo paciente:", req.body);
      const { dni, nombre, apellido, Obra_Social, telefono } = req.body;
      const nuevoPaciente = await Paciente.create({
        dni,
        nombre,
        apellido,
        Obra_Social,
        telefono,
      });
      res.status(201).json(nuevoPaciente);
    } catch (error) {
      console.error("Error al crear el paciente:", error);
      res.status(500).json({ error: "Error al crear el paciente" });
    }
  },

  // metodo para editar un medico buscando por id
  editarPaciente: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, Obra_Social, telefono } = req.body;
      const [updated] = await Paciente.update(
        { dni, nombre, apellido, Obra_Social, telefono },
        { where: { id } }
      );
      if (updated) {
        const updatedPaciente = await Paciente.findOne({ where: { id } });
        res.status(200).json(updatedPaciente);
      } else {
        res.status(404).json({ error: "paciente no encontrado" });
      }
    } catch (error) {
      console.error("Error al editar el paciente:", error);
      res.status(500).json({ error: "Error al editar el paciente" });
    }
  },

  // metodo para borrar un medico buscando por su id
  borrarPaciente: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Paciente.destroy({ where: { id } });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "paciente no encontrado" });
      }
    } catch (error) {
      console.error("Error al borrar el paciente:", error);
      res.status(500).json({ error: "Error al borrar el paciente" });
    }
  },
};

module.exports = pacienteController;

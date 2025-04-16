const Enfermero = require("../model/enfermero");

//dentro de este controlador se encuentran los metodos para manejar las peticiones http para la tabla Medico
const enfermeroController = {
  // metodo para obtener todos los medicos
  getAllEnfermeros: async (req, res) => {
    try {
      const enfermero = await Enfermero.findAll();
      res.status(200).json(enfermero);
    } catch (error) {
      console.error("Error al obtener los enfermeros:", error);
      res.status(500).json({ error: "Error al obtener los enfermeros" });
    }
  },

  // metodo para agregar un nuevo medico
  crearEnfermero: async (req, res) => {
    try {
      console.log("Creando nuevo enfermero:", req.body);
      const { dni, nombre, apellido, area, telefono } = req.body;
      const nuevoEnfermero = await Enfermero.create({
        dni,
        nombre,
        apellido,
        area,
        telefono,
      });
      res.status(201).json(nuevoEnfermero);
    } catch (error) {
      console.error("Error al crear el enfermero:", error);
      res.status(500).json({ error: "Error al crear el enfermero" });
    }
  },

  // metodo para editar un medico buscando por id
  editarEnfermero: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, area, telefono } = req.body;
      const [updated] = await Enfermero.update(
        { dni, nombre, apellido, area, telefono },
        { where: { id } }
      );
      if (updated) {
        const updatedEnfermero = await Enfermero.findOne({ where: { id } });
        res.status(200).json(updatedEnfermero);
      } else {
        res.status(404).json({ error: "Enfermero no encontrado" });
      }
    } catch (error) {
      console.error("Error al editar el enfermero:", error);
      res.status(500).json({ error: "Error al editar el enfermero" });
    }
  },

  // metodo para borrar un medico buscando por su id
  borrarEnfermero: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Enfermero.destroy({ where: { id } });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Enfermero no encontrado" });
      }
    } catch (error) {
      console.error("Error al borrar el Enfermero:", error);
      res.status(500).json({ error: "Error al borrar el enfermero" });
    }
  },

  //metodo para listar todos los enfermeros por area
  getEnfermerosByArea: async (req, res) => {
    try {
      const { area } = req.params;
      const enfermeros = await Enfermero.findAll({ where: { area } });
      res.status(200).json(enfermeros);
    } catch (error) {
      console.error("Error al obtener los enfermeros por área:", error);
      res.status(500).json({ error: "Error al obtener los enfermeros" });
    }
  },
  //buscar enfermero por ID
  getEnfermeroById: async (req, res) => {
    try {
      const { id } = req.params;
      const enfermero = await Enfermero.findOne({ where: { id } });
      if (enfermero) {
        res.status(200).json(enfermero);
      } else {
        res.status(404).json({ error: "Enfermero no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener el enfermero por ID:", error);
      res.status(500).json({ error: "Error al obtener el enfermero" });
    }
  },
};

module.exports = enfermeroController;

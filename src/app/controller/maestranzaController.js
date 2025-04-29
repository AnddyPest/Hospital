const Maestranza = require("../model/maestranza");

//dentro de este controlador se encuentran los metodos para manejar las peticiones http para la tabla Medico
const maestranzaController = {
  // metodo para obtener todos los medicos
  getAllMaestranzas: async (req, res) => {
    try {
      const maestranza = await Maestranza.findAll();
      res.status(200).json(maestranza);
    } catch (error) {
      console.error("Error al obtener los Maestranzas:", error);
      res.status(500).json({ error: "Error al obtener los Maestranzas" });
    }
  },

  // metodo para agregar un nuevo medico
  crearMaestranza: async (req, res) => {
    try {
      console.log("Creando nuevo Maestranza:", req.body);
      const { dni, nombre, apellido, area, telefono } = req.body;
      const nuevoMaestranza = await Maestranza.create({
        dni,
        nombre,
        apellido,
        area,
        telefono,
      });
      res.status(201).json(nuevoMaestranza);
    } catch (error) {
      console.error("Error al crear el Maestranza:", error);
      res.status(500).json({ error: "Error al crear el Maestranza" });
    }
  },

  // metodo para editar un medico buscando por id
  editarMaestranza: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, area, telefono } = req.body;
      const [updated] = await Maestranza.update(
        { dni, nombre, apellido, area, telefono },
        { where: { id } }
      );
      if (updated) {
        const updatedMaestranza = await Maestranza.findOne({ where: { id } });
        res.status(200).json(updatedMaestranza);
      } else {
        res.status(404).json({ error: "Maestranza no encontrado" });
      }
    } catch (error) {
      console.error("Error al editar el Maestranza:", error);
      res.status(500).json({ error: "Error al editar el Maestranza" });
    }
  },

  // metodo para borrar un medico buscando por su id
  borrarMaestranza: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Maestranza.destroy({ where: { id } });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Maestranza no encontrado" });
      }
    } catch (error) {
      console.error("Error al borrar el Maestranza:", error);
      res.status(500).json({ error: "Error al borrar el Maestranza" });
    }
  },
  // get maestranza por dni
  getMaestranzaByDni: async (req, res) => {
    try {
      const { dni } = req.params;
      const maestranza = await Maestranza.findOne({ where: { dni } });
      if (maestranza) {
        res.status(200).json(maestranza);
      } else {
        res.status(404).json({ error: "Maestranza no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener el Maestranza:", error);
      res.status(500).json({ error: "Error al obtener el Maestranza" });
    }
  },
};

module.exports = maestranzaController;

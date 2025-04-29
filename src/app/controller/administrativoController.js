const Administrativo = require("../model/administrativo");

//dentro de este controlador se encuentran los metodos para manejar las peticiones http para la tabla Medico
const administrativoController = {
  // metodo para obtener todos los medicos
  getAllAdministrativos: async (req, res) => {
    try {
      const administrativo = await Administrativo.findAll();
      res.status(200).json(administrativo);
    } catch (error) {
      console.error("Error al obtener los administrativo:", error);
      res.status(500).json({ error: "Error al obtener los administrativo" });
    }
  },

  // metodo para agregar un nuevo medico
  crearAdministrativo: async (req, res) => {
    try {
      console.log("Creando nuevo administrativo:", req.body);
      const { dni, nombre, apellido, area, telefono } = req.body;
      const nuevoAdministrativo = await Administrativo.create({
        dni,
        nombre,
        apellido,
        area,
        telefono,
      });
      res.status(201).json(nuevoAdministrativo);
    } catch (error) {
      console.error("Error al crear el administrativo:", error);
      res.status(500).json({ error: "Error al crear el administrativo" });
    }
  },

  // metodo para editar un medico buscando por id
  editarAdministrativo: async (req, res) => {
    try {
      const { id } = req.params;
      const { dni, nombre, apellido, area, telefono } = req.body;
      const [updated] = await Administrativo.update(
        { dni, nombre, apellido, area, telefono },
        { where: { id } }
      );
      if (updated) {
        const updatedAdministrativo = await Administrativo.findOne({
          where: { id },
        });
        res.status(200).json(updatedAdministrativo);
      } else {
        res.status(404).json({ error: "Administrativo no encontrado" });
      }
    } catch (error) {
      console.error("Error al editar el Administrativo:", error);
      res.status(500).json({ error: "Error al editar el administrativo" });
    }
  },

  // metodo para borrar un medico buscando por su id
  borrarAdministrativo: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Administrativo.destroy({ where: { id } });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Administrativo no encontrado" });
      }
    } catch (error) {
      console.error("Error al borrar el Administrativo:", error);
      res.status(500).json({ error: "Error al borrar el enfermero" });
    }
  },
  // administrativo por dni
  getAdministrativoByDni: async (req, res) => {
    try {
      const { dni } = req.params;
      const administrativo = await Administrativo.findOne({ where: { dni } });
      if (administrativo) {
        res.status(200).json(administrativo);
      } else {
        res.status(404).json({ error: "Administrativo no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener el administrativo:", error);
      res.status(500).json({ error: "Error al obtener el administrativo" });
    }
  },
};

module.exports = administrativoController;

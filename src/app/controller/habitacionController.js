const Habitacion = require("../model/habitacion");
const sequelize = require("../database-connection");
const Camas = require("../model/camas"); // Importar el modelo Cama
const Paciente = require("../model/paciente"); // Importar el modelo Paciente

const habitacionController = {
  adminView: async (req, res) => {
    res.render("vistasPlazas/administrarPlazas", {
      title: "Administración de Habitaciones",
      userType: req.session?.userType || "guest",
    });
  },

  //index
  index: async (req, res) => {
    try {
      const habitaciones = await Habitacion.findAll({
        include: [{ model: Camas }],
      });
      res.render("vistasPlazas/portadaPlazas", {
        title: "Habitaciones",
        habitaciones,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
      res.status(500).render("error", {
        message: "Error al obtener las habitaciones",
        error,
      });
    }
  },
  //listar view
  listarView: async (req, res) => {
    try {
      const { ala } = req.query;
      const whereCondition = ala ? { ala } : {};
      const habitaciones = await Habitacion.findAll({
        where: whereCondition,
        include: [
          {
            model: Camas,
            include: [
              {
                model: Paciente,
                attributes: ["id", "nombre", "apellido", "dni", "sexo"],
                required: false,
              },
            ],
          },
        ],
        order: [["numero", "ASC"]],
      });
      res.render("vistasPlazas/listarPlazas", {
        title: "Habitaciones",
        habitaciones,
        alaSeleccionada: ala || "",
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
      res.status(500).render("error", {
        message: "Error al obtener las habitaciones",
        error,
      });
    }
  },
  // nuevaHab view
  nuevaHabView: async (req, res) => {
    res.render("vistasPlazas/nuevaPlazas", {
      title: "Nueva Habitación",
      userType: req.session?.userType || "guest",
    });
  },
  // editarHab view
  editarHabView: async (req, res) => {
    try {
      const habitacion = await Habitacion.findAll({
        include: [{ model: Camas }],
      });
      res.render("vistasPlazas/editarPlazas", {
        title: "Editar Habitación",
        habitaciones: habitacion,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
      res.status(500).render("error", {
        message: "Error al obtener las habitaciones",
        error,
      });
    }
  },
  // vista de borrar habitacion
  borrarHabView: async (req, res) => {
    try {
      const habitaciones = await Habitacion.findAll({
        include: [{ model: Camas }],
      });
      res.render("vistasPlazas/borrarPlazas", {
        title: "Borrar Habitación",
        habitaciones,
        userType: req.session?.userType || "guest",
      });
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
      res.status(500).render("error", {
        message: "Error al obtener las habitaciones",
        error,
      });
    }
  },

  // Crear una nueva habitación
  crear: async (req, res) => {
    // Iniciar transacción para garantizar consistencia
    const t = await sequelize.transaction();

    try {
      const { numero: numeroOriginal, ala, cantidadCamas } = req.body;
      numero = parseInt(numeroOriginal);
      // Validar datos
      if (!numero || !ala || !cantidadCamas) {
        return res.status(400).json({
          error: "Datos incompletos",
          message: "El número, ala y cantidad de camas son obligatorios",
        });
      }
      let habitacionExistente = true;
      let intentos = 0;
      const MAX_INTENTOS = 50;
      // Verificar si ya existe una habitación con el mismo número en la misma ala
      while (habitacionExistente && intentos < MAX_INTENTOS) {
        habitacionExistente = await Habitacion.findOne({
          where: {
            numero,
            ala,
          },
          transaction: t,
        });

        if (habitacionExistente) {
          numero++;
          intentos++;
        }
      }
      if (numero !== parseInt(numeroOriginal)) {
        mensajeAdicional = `El numero asignado ${numeroOriginal} ya estaba en uso. Se le asignó el número ${numero}.`;
      }

      // 1. Crear la habitación
      const nuevaHabitacion = await Habitacion.create(
        { numero, ala },
        { transaction: t }
      );

      // 2. Crear las camas asociadas con el formato correcto
      const camasCreadas = [];

      for (let i = 1; i <= cantidadCamas; i++) {
        const nuevaCama = await Camas.create(
          {
            numeroCama: `${numero}-${i}`, // Formato "numeroHabitacion-numeroCama"
            estado: "Disponible",
            habitacion_Id: nuevaHabitacion.id,
            fechaIngreso: null,
            // No establecer fechaIngreso, quedará null por defecto
          },
          { transaction: t }
        );
        camasCreadas.push(nuevaCama);
      }

      // Confirmar la transacción
      await t.commit();

      // Devolver respuesta con habitación y camas creadas
      res.status(201).json({
        habitacion: nuevaHabitacion,
        camas: camasCreadas,
        message: `Habitación ${numero} creada exitosamente con ${cantidadCamas} camas`,
        info: mensajeAdicional || undefined,
      });
    } catch (error) {
      // Revertir la transacción en caso de error
      await t.rollback();

      console.error("Error al crear la habitación con camas:", error);

      // Respuesta de error más detallada
      res.status(500).json({
        error: "Error al crear la habitación y camas",
        message: error.message,
      });
    }
  },
  // editar una habitación
  editar: async (req, res) => {
    try {
      const { id } = req.params;
      const { numero, ala } = req.body;

      const habitacion = await Habitacion.findByPk(id);
      if (!habitacion) {
        return res.status(404).json({ error: "Habitación no encontrada" });
      }

      habitacion.numero = numero;
      habitacion.ala = ala;
      await habitacion.save();

      res.status(200).json(habitacion);
    } catch (error) {
      console.error("Error al editar la habitación:", error);
      res.status(500).json({ error: "Error al editar la habitación" });
    }
  },
  //borrar una habitación
  borrar: async (req, res) => {
    try {
      const { id } = req.params;
      const habitacion = await Habitacion.findByPk(id);
      if (!habitacion) {
        return res.status(404).json({ error: "Habitación no encontrada" });
      }

      await habitacion.destroy();

      res.status(200).json({ message: "Habitación eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la habitación:", error);
      res.status(500).json({ error: "Error al eliminar la habitación" });
    }
  },

  // Obtener todas las habitaciones
  listar: async (req, res) => {
    try {
      const habitaciones = await Habitacion.findAll({
        include: [{ model: Camas }],
      });
      res.status(200).json(habitaciones);
    } catch (error) {
      console.error("Error al obtener las habitaciones:", error);
      res.status(500).json({ error: "Error al obtener las habitaciones" });
    }
  },
};

module.exports = habitacionController;

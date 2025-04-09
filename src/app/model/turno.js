const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Paciente = require("./paciente"); // Importar el modelo Paciente
const Medico = require("./medico"); // Importar el modelo Medico
const Enfermero = require("./enfermero"); // Importar el modelo Enfermero

const Turno = sequelize.define("Turno", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pendiente",
  },
});

//estas son las relaciones entre los modelos
// Paciente tiene muchos Turnos
// Turno pertenece a un Paciente
// Medico tiene muchos Turnos
// Turno pertenece a un Medico
// Enfermero tiene muchos Turnos
// Turno pertenece a un Enfermero
Paciente.belongsToMany(Turno, { through: "pacientesTurnos" });
Turno.belongsToMany(Paciente, { through: "pacientesTurnos" });
Medico.belongsToMany(Turno, { through: "medicosTurnos" });
Turno.belongsToMany(Medico, { through: "medicosTurnos" });
Enfermero.belongsToMany(Turno, { through: "enfermerosTurnos" });
Turno.belongsToMany(Enfermero, { through: "enfermerosTurnos" });

module.exports = Turno;

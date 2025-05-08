const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Paciente = require("./paciente");
const Turno = require("./turno");

const HistoriaClinica = sequelize.define(
  "HistoriaClinica",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    resultado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    derivacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    interConsulta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  { tableName: "historia_clinica", timestamps: true }
);

// Paciente tiene una HistoriaClinica
// HistoriaClinica pertenece a un Paciente
Paciente.hasOne(HistoriaClinica, { foreignKey: "paciente_Id" });
HistoriaClinica.belongsTo(Paciente, { foreignKey: "paciente_Id" });
// HistoriaClinica tiene muchos Turnos
// Turno pertenece a una HistoriaClinica
HistoriaClinica.hasMany(Turno, { foreignKey: "historiaClinica_Id" });
Turno.belongsTo(HistoriaClinica, { foreignKey: "historiaClinica_Id" });

module.exports = HistoriaClinica;

const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Paciente = require("./paciente");

const Camas = sequelize.define(
  "Camas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    numeroCama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("Disponible", "Ocupada", "En Limpieza"),
      allowNull: false,
    },
    fechaIngreso: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fechaEgreso: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

// Paciente tiene una cama (solo puede tener una cama a la vez)
// Cama pertenece a un Paciente (solo puede pertenecer a un paciente a la vez)
Paciente.hasOne(Camas, { foreignKey: "paciente_Id" });
Camas.belongsTo(Paciente, { foreignKey: "paciente_Id" });

module.exports = Camas;

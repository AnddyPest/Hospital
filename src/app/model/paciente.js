const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");

const Paciente = sequelize.define(
  "Paciente",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dni: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sexo: {
      type: DataTypes.ENUM("M", "F"),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    obra_social: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    internado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Paciente;

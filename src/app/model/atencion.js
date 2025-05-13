const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");

const Atencion = sequelize.define(
  "Atencion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    detalle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resultado: {
      type: DataTypes.STRING,
      allowNull: true,
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
  },
  { tableName: "atencion", timestamps: true }
);

module.exports = Atencion;

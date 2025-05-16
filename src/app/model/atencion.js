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
    diagnostico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    afiliado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    matricula: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    situacion: {
      type: DataTypes.ENUM(
        "alta",
        "internado",
        "diagnosis",
        "fallecido",
        "interconsulta",
        "derivado"
      ),
      allowNull: true,
    },
    turno_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      unique: true,
    },
  },
  { tableName: "atencion", timestamps: true }
);

module.exports = Atencion;

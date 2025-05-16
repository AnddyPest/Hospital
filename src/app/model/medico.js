const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");

const Medico = sequelize.define("Medico", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dni: {
    type: DataTypes.DOUBLE,
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

  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Medico;

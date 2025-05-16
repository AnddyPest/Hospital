const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Medico = require("./medico"); // Importar el modelo Medico

const Especialidad = sequelize.define(
  "Especialidad",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "especialidades",
  }
);

Especialidad.hasMany(Medico, { foreignKey: "especialidad_Id" });
Medico.belongsTo(Especialidad, { foreignKey: "especialidad_Id" });

module.exports = Especialidad;

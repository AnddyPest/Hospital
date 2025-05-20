const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Camas = require("./camas"); // Importar el modelo Cama

const Habitacion = sequelize.define(
  "Habitacion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ala: {
      type: DataTypes.ENUM(
        "Comun",
        "Terapia Intermedia",
        "Terapia Intensiva",
        "Pre Quirurgico"
      ),
      allowNull: false,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "habitaciones", timestamps: true }
);

Habitacion.hasMany(Camas, { foreignKey: "habitacion_Id" });
Camas.belongsTo(Habitacion, { foreignKey: "habitacion_Id" });

module.exports = Habitacion;

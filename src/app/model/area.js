const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Enfermero = require("./enfermero"); // Importar el modelo Enfermero
const Maestranza = require("./maestranza"); // Importar el modelo Maestranza
const Administrativo = require("./administrativo"); // Importar el modelo Administrativo

const Area = sequelize.define(
  "Area",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

Area.hasMany(Enfermero, { foreignKey: "area_Id" });
Enfermero.belongsTo(Area, { foreignKey: "area_Id" });
Area.hasMany(Maestranza, { foreignKey: "area_Id" });
Maestranza.belongsTo(Area, { foreignKey: "area_Id" });
Area.hasMany(Administrativo, { foreignKey: "area_Id" });
Administrativo.belongsTo(Area, { foreignKey: "area_Id" });

module.exports = Area;

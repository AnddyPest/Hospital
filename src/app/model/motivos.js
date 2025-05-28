const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Turno = require("./turno");

const Motivos = sequelize.define(
  "Motivo",
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

Motivos.hasMany(Turno, { foreignKey: "motivo_Id" });
Turno.belongsTo(Motivos, { foreignKey: "motivo_Id" });
module.exports = Motivos;

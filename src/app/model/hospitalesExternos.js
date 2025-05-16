const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Atencion = require("./atencion"); // Importar el modelo Atencion

const HospitalesExternos = sequelize.define(
  "HospitalesExternos",
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
    complejidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "hospitales_externos", timestamps: false }
);

module.exports = HospitalesExternos;

HospitalesExternos.hasMany(Atencion, {
  foreignKey: "hospitalesExternos_Id",
});
Atencion.belongsTo(HospitalesExternos, {
  foreignKey: "hospitalesExternos_Id",
});

const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Medico = require("./medico");
const Enfermero = require("./enfermero"); // Importar el modelo Enfermero
const Paciente = require("./paciente"); // Importar el modelo Paciente
const Administrativo = require("./administrativo"); // Importar el modelo Administrativo
const Maestranza = require("./maestranza"); // Importar el modelo Maestranza

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    superAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

Medico.hasOne(User, { foreignKey: "medico_Id" });
User.belongsTo(Medico, { foreignKey: "medico_Id" });
Enfermero.hasOne(User, { foreignKey: "enfermero_Id" });
User.belongsTo(Enfermero, { foreignKey: "enfermero_Id" });
Administrativo.hasOne(User, { foreignKey: "administrativo_Id" });
User.belongsTo(Administrativo, { foreignKey: "administrativo_Id" });
Maestranza.hasOne(User, { foreignKey: "maestranza_Id" });
User.belongsTo(Maestranza, { foreignKey: "maestranza_Id" });

module.exports = User;

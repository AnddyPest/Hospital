const { DataTypes } = require("sequelize");
const sequelize = require("../database-connection");
const Paciente = require("./paciente"); // Importar el modelo Paciente
const Medico = require("./medico"); // Importar el modelo Medico
const Enfermero = require("./enfermero"); // Importar el modelo Enfermero
const Atencion = require("./atencion"); // Importar el modelo Atencion

const Turno = sequelize.define("Turno", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ordenUrgencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prioridad: {
    type: DataTypes.ENUM("alta", "media", "baja"),
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pendiente",
  },
  esEmergencia: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Paciente.hasMany(Turno, { foreignKey: "paciente_Id" });
Turno.belongsTo(Paciente, { foreignKey: "paciente_Id" });
Medico.hasMany(Turno, { foreignKey: "medico_Id" });
Turno.belongsTo(Medico, { foreignKey: "medico_Id" });
Enfermero.hasMany(Turno, { foreignKey: "enfermero_Id" });
Turno.belongsTo(Enfermero, { foreignKey: "enfermero_Id" });
Turno.hasOne(Atencion, { foreignKey: "turno_Id" });
Atencion.belongsTo(Turno, { foreignKey: "turno_Id" });

module.exports = Turno;

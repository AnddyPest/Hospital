const { Sequelize } = require("sequelize");

// Configura la conexión a la base de datos
const sequelize = new Sequelize("hospital_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Verifica la conexión
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos establecida correctamente.");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error.message);
  });

module.exports = sequelize;

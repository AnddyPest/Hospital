const sequelize = require("./src/app/database-connection");
const seed = require("./src/app/seeders/seed");

async function executeSeed() {
  try {
    console.log("Ejecutando seed...");
    await seed.up(sequelize.getQueryInterface(), sequelize);
    console.log("¡Datos sembrados correctamente!");
    process.exit(0);
  } catch (error) {
    console.error("Error al sembrar datos:", error);
    process.exit(1);
  }
}

executeSeed();

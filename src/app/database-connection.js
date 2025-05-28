const { Sequelize } = require("sequelize");
const mysql2 = require("mysql2/promise"); //importamos asi para poder usar async y await

// estos son los datos de la base de datos, no estoy seguro de que sea correcto
// colocarlos aqui por temas de seguridad, pero para poder desarrollar la app
// los pongo aca
//PARAMERTROS DE CONEXION A LA BASE DE DATOS EN LOCALHOST
//const databaseName = "hospital_db";
//const userName = "root";
//const password = "";
//const host = "localhost";

// PARAMETROS DE CONEXION A LA BASE DE DATOS EN DOCKER
const databaseName = process.env.DB_NAME || "railway";
const userName = process.env.DB_USER || "root";
//const password = process.env.DB_PASSWORD || "";
const password = process.env.DB_PASSWORD || "KLvGlIbiGnhwAtsKSiefXfrieufAoTTQ"; // <--- PARA RAILWAY
const host = process.env.DB_HOST || "mysql.railway.internal"; // <--- PARA RAILWAY
//const host = process.env.DB_HOST || "db"; // <--- debe ser "db" para Docker

// Detectar si estamos en Railway
const isRailway =
  !!process.env.RAILWAY_STATIC_URL ||
  process.env.DB_HOST === "mysql.railway.internal";

// aseguramos que la bd existe, si no existe la creamos
async function asegurarBdExiste() {
  // Si estamos en Railway, NO intentamos crear la base de datos (Railway ya la crea)
  if (isRailway) {
    console.log(
      "Entorno Railway detectado: se asume que la base de datos ya existe."
    );
    return;
  }
  try {
    // conexion standard a mysql sin especificar la bd... si especificaramos la bd
    // tendriamos un error de conexion, entonces debemos conectarnos asi para poder
    // crearla si no existiera
    const connection = await mysql2.createConnection({
      host,
      user: userName,
      password,
    });

    // aca verificamos si esta la bd
    const [rows] = await connection.query(
      `SHOW DATABASES LIKE '${databaseName}'`
    );

    if (rows.length === 0) {
      // si no está la base de datos, la creamos
      await connection.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Base de datos '${databaseName}' creada.`);
    } else {
      console.log(`Base de datos '${databaseName}' ya existe.`);
    }

    await connection.end();
  } catch (error) {
    console.error(
      "Error al verificar o crear la base de datos:",
      error.message
    );
    process.exit(1); // si hay error de coneccion dropeamos la app
  }
}

// ahora si conectamos a la base de datos con sequelize
// creamos una nueva instancia de Sequelize para conectarse a la base de datos
const sequelize = new Sequelize(databaseName, userName, password, {
  host,
  dialect: "mysql",
  logging: false,
});

// arrancamos sequelize y sincronizamos los modelos, si no lo hacemos asi no se crean las tablas
// y no se pueden usar los modelos
async function iniciarSequelize() {
  await asegurarBdExiste(); // verificamos que exista la base de datos antes de conectarnos

  try {
    //ahora si nos conectamos y autenticamos
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");

    // una vez autenticados, sincronizamos los modelos
    await sequelize.sync({ force: false });
    console.log("Modelos sincronizados con la base de datos.");
  } catch (error) {
    console.error(
      "Error al conectar o sincronizar la base de datos:",
      error.message
    );
    process.exit(1); // se vuelve a dropear la app si no se puede conectar
  }
}

iniciarSequelize();
module.exports = sequelize;

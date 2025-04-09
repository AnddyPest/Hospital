const express = require("express");
const sequelize = require("./database-connection"); //importacion de sequelize
const router = require("./router/router"); // Router
const medicoRouter = require("./router/medicoRouter"); // Medicos Router
const enfermeroRouter = require("./router/enfermeroRouter"); // Enfermeros Router
const administrativoRouter = require("./router/administrativoRouter"); // Administrativos Router
const path = require("path");
const morgan = require("morgan");

const app = express();

// Servidor
app.set("port", process.env.PORT || 3030);
app.set("views", path.join(__dirname, "../public/views")); // vistas
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "../public"))); //todo lo public aca
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Rutas
app.use("/", router);
app.use("/medicos", medicoRouter);
app.use("/enfermeros", enfermeroRouter);
app.use("/administrativos", administrativoRouter);
// Conexión y sincronización con la base de datos
sequelize
  .authenticate()
  .then(() => {
    return sequelize.sync({ force: false }); // esto asegra que las tablas sean correctas
  })
  .then(() => {
    console.log("Modelos sincronizados con la base de datos.");
  })
  .catch((error) => {
    console.error(
      "Error al conectar o sincronizar la base de datos:",
      error.message
    );
  });

module.exports = app;

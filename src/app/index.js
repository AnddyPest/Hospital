const express = require("express");
const mysql = require("mysql");
const router = require("./router/router");
const app = express();
const morgan = require("morgan");
const publicPath = __dirname.replace("app", "public");
const conexion = mysql.createConnection({
  host: "localhost",
  database: "hospital_db",
  user: "root",
  password: "",
});

conexion.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("CONECTADO A LA BASE DE DATOS");
  }
});

app.set("port", process.env.PORT || 3030);
app.set("views", `${publicPath}/templates`);
app.set("view engine", "pug");

app.use(express.static(publicPath));
app.use(morgan("dev"));
app.use("/", router);

module.exports = app;

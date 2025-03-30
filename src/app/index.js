const express = require("express");
const conexion = require("../app/database-connection");
const router = require("./router/router");
const app = express();
const morgan = require("morgan");
const publicPath = __dirname.replace("app", "public");

app.set("port", process.env.PORT || 3030);
app.set("views", `${publicPath}/views`);
app.set("view engine", "pug");

app.use(express.static(publicPath));
app.use(morgan("dev"));
app.use("/", router);

module.exports = app;

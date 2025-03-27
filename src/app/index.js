const express = require("express");
const app = express();
const router = require("./router/router");
const morgan = require("morgan");
const publicPath = __dirname.replace("app", "public");

app.set("port", process.env.PORT || 3030);
app.set("views", `${publicPath}/templates`);
app.set("view engine", "pug");

app.use(morgan("dev"));
app.use("/", router);

module.exports = app;

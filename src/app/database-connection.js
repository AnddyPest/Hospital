const mysql = require("mysql2");

let conexion;

function handlerDesconexion() {
  conexion = mysql.createConnection({
    host: "localhost",
    database: "hospital_db",
    user: "root",
    password: "",
  });

  conexion.connect((err) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err.message);
      setTimeout(handlerDesconexion, 5000); // 5 segundos de espera...
    } else {
      console.log("CONECTADO A LA BASE DE DATOS");
    }
  });

  conexion.on("error", (err) => {
    console.error("Error en la conexión:", err.message);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Conexión perdida. Intentando reconectar...");
      handlerDesconexion();
    } else {
      console.error("Error no manejado:", err.message);
    }
  });
}

handlerDesconexion();

module.exports = conexion;

const User = require("../model/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "nova-slug-1984-LR1358!";

const authController = {
  //inicio de sesion
  login: async (req, res) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      //verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      //token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          medico_Id: user.medico_Id,
          enfermero_Id: user.enfermero_Id,
          paciente_Id: user.paciente_Id,
          maestranza_Id: user.maestranza_Id,
          administrativo_Id: user.administrativo_Id,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
        // en el front tenemos que guardar en token en el local storage o session storage
        // y en el header de las peticiones que requieran autenticacion si es necesario
        // y en el backend tenemos que verificar el token en las rutas que requieran autenticacion
      );
      //devuelve el token
      res.json({ token });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  //registro usuarios
  register: async (req, res) => {
    const {
      email,
      password,
      medico_Id,
      enfermero_Id,
      paciente_Id,
      maestranza_Id,
      administrativo_Id,
    } = req.body;
    try {
      //saltear contraseña
      const salteada = await bcrypt.hash(password, 10);
      //crear usuario
      const user = await User.create({
        email,
        password: salteada,
        medico_Id,
        enfermero_Id,
        paciente_Id,
        maestranza_Id,
        administrativo_Id,
      });
      res.status(201).json({ message: "Usuario creado", user });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  //cerrar sesion
  logout: (req, res) => {
    // Eliminar el token del almacenamiento local o de la sesión en el frontend
    // Aquí no se necesita hacer nada en el backend, ya que el token se elimina en el cliente
    res.json({ message: "Sesión cerrada" });
  },
};

module.exports = authController;

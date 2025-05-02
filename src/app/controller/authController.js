const User = require("../model/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "nova-slug-1984-LR1358!";

const authController = {
  //inicio de sesion
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      //verificar si el usuario existe
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email y contraseña son requeridos" });
      }
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
          role: user.medico_Id
            ? "medico"
            : user.enfermero_Id
            ? "enfermero"
            : user.paciente_Id
            ? "paciente"
            : user.maestranza_Id
            ? "maestranza"
            : user.administrativo_Id
            ? "administrativo"
            : "invitado",

          superAdmin: user.superAdmin || false,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
        // en el front tenemos que guardar en token en el local storage o session storage
        // y en el header de las peticiones que requieran autenticacion si es necesario
        // y en el backend tenemos que verificar el token en las rutas que requieran autenticacion
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Cambia a true en producción
        sameSite: "Strict", // Cambia a "Lax" si tienes problemas con las cookies
        maxAge: 3600000, // 1 hora
        path: "/",
      });
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
      superAdmin,
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
        superAdmin: superAdmin || false,
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
    try {
      // Limpiar la cookie estableciendo una fecha de expiración en el pasado
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      // Responder con éxito
      return res.status(200).json({ message: "Logout exitoso" });
    } catch (error) {
      console.error("Error en logout:", error);
      return res.status(500).json({ error: "Error al cerrar sesión" });
    }
  },
  verificador: (req, res) => {
    return res.status(200).json({ valid: true });
  },
};

module.exports = authController;

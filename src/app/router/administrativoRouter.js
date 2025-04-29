const express = require("express");
const router = express.Router();
const administrativoController = require("../controller/administrativoController");
//const token = require("../middleware/auth");

//renders
router.get("/", (req, res) => {
  res.render("vistasAdministrativos/portadaAdministrativos", {
    title: "Administrativos",
  });
});

router.get("/listar", (req, res) => {
  res.render("vistasAdministrativos/listarAdministrativos", {
    title: "Listar Administrativos",
  });
});

router.get("/admin", (req, res) => {
  res.render("vistasAdministrativos/administrarAdministrativos", {
    title: "Administrar Administrativos",
  });
});

router.get("/admin/new", (req, res) => {
  res.render("vistasAdministrativos/nuevoAdministrativo", {
    title: "Nuevo Administrativo",
  });
});

router.get("/admin/borrar", (req, res) => {
  res.render("vistasAdministrativos/borrarAdministrativo", {
    title: "Borrar Administrativo",
  });
});

router.get("/admin/editar", (req, res) => {
  res.render("vistasAdministrativos/editarAdministrativos", {
    title: "Editar Administrativo",
  });
});

router.get("/admin/seleccionar", (req, res) => {
  res.render("vistasAdministrativos/seleccionarAdministrativo", {
    title: "Seleccionar Administrativo",
  });
});

//api
router.get("/listado", administrativoController.getAllAdministrativos);
router.post("/admin/new", administrativoController.crearAdministrativo);
router.put("/editar/:id", administrativoController.editarAdministrativo);
router.delete("/borrar/:id", administrativoController.borrarAdministrativo);
router.get("/buscardni/:dni", administrativoController.getAdministrativoByDni);

module.exports = router;

class Medico {
  constructor(id, nombre, apellidos, telefono, especialidad) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.telefono = telefono;
    this.especialidad = especialidad;
  }

  //GETTERS
  getId() {
    return this.id;
  }
  getNombre() {
    return this.nombre;
  }
  getApellidos() {
    return this.apellidos;
  }
  getTelefono() {
    return this.telefono;
  }
  getEspecialidad() {
    return this.especialidad;
  }
  //SETTERS
  setNombre(nombre) {
    this.nombre = nombre;
  }
  setApellidos(apellidos) {
    this.apellidos = apellidos;
  }
  setTelefono(telefono) {
    if (!/^\d+$/.test(telefono)) {
      //testear que solo sean numeros
      throw new Error("El teléfono solo puede contener números.");
    }
    this.telefono = telefono;
  }
  setEspecialidad(especialidad) {
    this.especialidad = especialidad;
  }
}

module.exports = Medico;

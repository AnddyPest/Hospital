"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Crear especialidades médicas
    await queryInterface.bulkInsert(
      "especialidades",
      [
        { nombre: "Cardiología" },
        { nombre: "Pediatría" },
        { nombre: "Traumatología" },
        { nombre: "Neurología" },
        { nombre: "Dermatología" },
        { nombre: "Oftalmología" },
        { nombre: "Ginecología" },
        { nombre: "Urología" },
        { nombre: "Endocrinología" },
        { nombre: "Psiquiatría" },
      ],
      {}
    );

    // 2. Crear áreas de enfermería
    await queryInterface.bulkInsert(
      "areas",
      [
        { nombre: "Triage de Ingreso" },
        { nombre: "Cuidados Intensivos" },
        { nombre: "Emergencias" },
        { nombre: "Pediatría" },
        { nombre: "Geriatría" },
      ],
      {}
    );

    // 3. Crear hospitales externos
    await queryInterface.bulkInsert(
      "hospitales_externos",
      [
        { nombre: "Hospital Central", complejidad: "Alta" },
        { nombre: "Clínica San Juan", complejidad: "Media" },
        { nombre: "Hospital Universitario", complejidad: "Alta" },
        { nombre: "Centro Médico Regional", complejidad: "Media" },
        { nombre: "Instituto Cardiovascular", complejidad: "Alta" },
      ],
      {}
    );

    // 4. Crear médicos (4 comparten especialidad - Cardiología)
    await queryInterface.bulkInsert(
      "medicos",
      [
        {
          dni: 23456789,
          nombre: "Juan",
          apellido: "García",
          telefono: "555-1234",
          especialidad_Id: 1,
        },
        {
          dni: 34567890,
          nombre: "María",
          apellido: "López",
          telefono: "555-2345",
          especialidad_Id: 1,
        },
        {
          dni: 45678901,
          nombre: "Roberto",
          apellido: "Fernández",
          telefono: "555-3456",
          especialidad_Id: 1,
        },
        {
          dni: 56789012,
          nombre: "Ana",
          apellido: "Martínez",
          telefono: "555-4567",
          especialidad_Id: 1,
        },
        {
          dni: 67890123,
          nombre: "Carlos",
          apellido: "Rodríguez",
          telefono: "555-5678",
          especialidad_Id: 2,
        },
        {
          dni: 78901234,
          nombre: "Patricia",
          apellido: "González",
          telefono: "555-6789",
          especialidad_Id: 3,
        },
        {
          dni: 89012345,
          nombre: "Miguel",
          apellido: "Pérez",
          telefono: "555-7890",
          especialidad_Id: 4,
        },
        {
          dni: 90123456,
          nombre: "Laura",
          apellido: "Sánchez",
          telefono: "555-8901",
          especialidad_Id: 5,
        },
        {
          dni: 12345678,
          nombre: "Sergio",
          apellido: "Díaz",
          telefono: "555-9012",
          especialidad_Id: 6,
        },
        {
          dni: 13579246,
          nombre: "Sofía",
          apellido: "Torres",
          telefono: "555-0123",
          especialidad_Id: 7,
        },
      ],
      {}
    );

    // 5. Crear enfermeros (3 en "Triage de Ingreso")
    await queryInterface.bulkInsert(
      "enfermeros",
      [
        {
          dni: 24680135,
          nombre: "Lucía",
          apellido: "Romero",
          telefono: "555-1111",
          area_Id: 1,
        },
        {
          dni: 36914725,
          nombre: "Fernando",
          apellido: "Castro",
          telefono: "555-2222",
          area_Id: 1,
        },
        {
          dni: 14725836,
          nombre: "Elena",
          apellido: "Ortiz",
          telefono: "555-3333",
          area_Id: 1,
        },
        {
          dni: 25836947,
          nombre: "Alberto",
          apellido: "Vargas",
          telefono: "555-4444",
          area_Id: 2,
        },
        {
          dni: 36947058,
          nombre: "Carmen",
          apellido: "Jiménez",
          telefono: "555-5555",
          area_Id: 3,
        },
      ],
      {}
    );

    // 6. Crear pacientes - CORREGIDO según modelo real
    await queryInterface.bulkInsert(
      "pacientes",
      [
        {
          dni: 12345678,
          nombre: "Daniel",
          apellido: "Moreno",
          edad: 43,
          sexo: "M",
          email: "daniel.moreno@email.com",
          obra_social: "OSDE",
          telefono: "555-1212",
        },
        {
          dni: 23456789,
          nombre: "Isabel",
          apellido: "Navarro",
          edad: 48,
          sexo: "F",
          email: "isabel.navarro@email.com",
          obra_social: "Swiss Medical",
          telefono: "555-2323",
        },
        {
          dni: 34567890,
          nombre: "Pedro",
          apellido: "Ruiz",
          edad: 33,
          sexo: "M",
          email: "pedro.ruiz@email.com",
          obra_social: "PAMI",
          telefono: "555-3434",
        },
        {
          dni: 45678901,
          nombre: "Alejandra",
          apellido: "Gil",
          edad: 35,
          sexo: "F",
          email: "alejandra.gil@email.com",
          obra_social: "OSDE",
          telefono: "555-4545",
        },
        {
          dni: 56789012,
          nombre: "Javier",
          apellido: "Serrano",
          edad: 28,
          sexo: "M",
          email: "javier.serrano@email.com",
          obra_social: "Galeno",
          telefono: "555-5656",
        },
        {
          dni: 67890123,
          nombre: "Natalia",
          apellido: "Blanco",
          edad: 40,
          sexo: "F",
          email: "natalia.blanco@email.com",
          obra_social: "Medifé",
          telefono: "555-6767",
        },
        {
          dni: 78901234,
          nombre: "Ramón",
          apellido: "Herrera",
          edad: 53,
          sexo: "M",
          email: "ramon.herrera@email.com",
          obra_social: "IOMA",
          telefono: "555-7878",
        },
        {
          dni: 89012345,
          nombre: "Cristina",
          apellido: "Vega",
          edad: 31,
          sexo: "F",
          email: "cristina.vega@email.com",
          obra_social: "OSECAC",
          telefono: "555-8989",
        },
        {
          dni: 90123456,
          nombre: "Andrés",
          apellido: "Ramos",
          edad: 36,
          sexo: "M",
          email: "andres.ramos@email.com",
          obra_social: "Medicus",
          telefono: "555-9090",
        },
        {
          dni: 10234567,
          nombre: "Mónica",
          apellido: "Flores",
          edad: 45,
          sexo: "F",
          email: "monica.flores@email.com",
          obra_social: "OSDEPYM",
          telefono: "555-0101",
        },
      ],
      {}
    );

    // También crear algunos motivos de consulta comunes
    await queryInterface.bulkInsert(
      "motivos",
      [
        { nombre: "Consulta general" },
        { nombre: "Control rutinario" },
        { nombre: "Dolor abdominal" },
        { nombre: "Fiebre" },
        { nombre: "Traumatismo" },
        { nombre: "Dolor de cabeza" },
        { nombre: "Dificultad respiratoria" },
        { nombre: "Dolor de espalda" },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar en orden inverso para respetar las restricciones de clave foránea
    await queryInterface.bulkDelete("Pacientes", null, {});
    await queryInterface.bulkDelete("Enfermeros", null, {});
    await queryInterface.bulkDelete("Medicos", null, {});
    await queryInterface.bulkDelete("hospitales_externos", null, {});
    await queryInterface.bulkDelete("Areas", null, {});
    await queryInterface.bulkDelete("Especialidades", null, {});
    await queryInterface.bulkDelete("Motivos", null, {});
  },
};

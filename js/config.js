// ============================================================
//  config.js — Configuración global de la API
//  Aquí se define la URL base del backend para no repetirla
//  en cada archivo JS del proyecto.
// ============================================================

// Se usa window.API_URL en lugar de "const" para que, aunque este
// archivo se incluya más de una vez o en distinto orden que otros
// scripts, NUNCA produzca un error de "Identifier already declared".
window.API_URL = window.API_URL || 'http://localhost:3000';

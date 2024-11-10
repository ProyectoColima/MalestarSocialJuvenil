const express = require('express');
const xlsx = require('xlsx');
const Fuse = require('fuse.js');
const path = require('path');

const app = express();

app.get('/buscar', (req, res) => {
    const termino = req.query.termino ? req.query.termino.toLowerCase() : '';

    // Cargar el archivo Excel
    const workbook = xlsx.readFile(path.join(__dirname, 'data/Datos.xlsx'));
    const worksheet = workbook.Sheets['Datos generales'];
    const datos = xlsx.utils.sheet_to_json(worksheet);

    // Configuración de Fuse.js para coincidencias aproximadas
    const fuse = new Fuse(datos, {
        keys: ['Nombre de la encuesta'],
        threshold: 0.4 // Ajusta el umbral para mayor o menor sensibilidad
    });

    // Realizar búsqueda con coincidencias aproximadas
    const resultados = fuse.search(termino).map(result => result.item);

    // Enviar resultados al cliente
    res.json(resultados);
});

// Configuración del puerto para Vercel
module.exports = app;

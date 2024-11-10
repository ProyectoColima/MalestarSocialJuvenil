const express = require('express');
const xlsx = require('xlsx');
const path = require('path');

const app = express();

app.get('/buscar', (req, res) => {
    const termino = req.query.termino ? req.query.termino.toLowerCase() : '';

    const workbook = xlsx.readFile(path.join(__dirname, '../data/Datos.xlsx'));
    const worksheet = workbook.Sheets['Datos generales'];
    const datos = xlsx.utils.sheet_to_json(worksheet);

    const resultados = datos.filter((fila) => {
        const nombreEncuesta = fila['Nombre de la encuesta'] ? fila['Nombre de la encuesta'].toLowerCase() : '';
        return nombreEncuesta.includes(termino);
    });

    res.json(resultados);
});

module.exports = app;

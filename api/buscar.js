/*const xlsx = require('xlsx');
const Fuse = require('fuse.js');
const path = require('path');

module.exports = (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Método no permitido' });
        return;
    }

    const termino = req.query.termino ? req.query.termino.toLowerCase() : '';

    try {
        // Verificar la ruta del archivo
        const filePath = path.join(process.cwd(), 'data', 'Data.xlsx');
        console.log('Ruta del archivo:', filePath);

        // Leer el archivo Excel
        const workbook = xlsx.readFile(filePath);
        console.log('Hojas disponibles:', workbook.SheetNames);

        // Verificar si existe la hoja "Datos_generales"
        const worksheet = workbook.Sheets['Datos_generales'];
        if (!worksheet) {
            console.error('Hoja "Datos_generales" no encontrada en el archivo.');
            return res.status(404).json({ message: 'Hoja "Datos_generales" no encontrada.' });
        }

        // Leer los datos de la hoja
        const datos = xlsx.utils.sheet_to_json(worksheet);
        console.log('Datos leídos:', datos);

        if (datos.length === 0) {
            console.warn('No se encontraron datos en la hoja "Datos_generales".');
            return res.status(404).json({ message: 'No se encontraron datos en la hoja "Datos_generales".' });
        }

        // Configuración de Fuse.js para coincidencias aproximadas
        const fuse = new Fuse(datos, {
            keys: ['Nombre de la encuesta'], // Cambia si necesitas buscar en otra columna
            threshold: 0.4 // Ajusta el umbral para mayor o menor sensibilidad
        });

        // Realizar búsqueda con coincidencias aproximadas
        const resultados = fuse.search(termino).map(result => result.item);

        if (resultados.length === 0) {
            console.warn('No se encontraron resultados para el término:', termino);
            return res.status(404).json({ message: 'No se encontraron resultados para el término buscado.' });
        }

        // Enviar resultados al cliente
        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al procesar la búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}; */

const xlsx = require('xlsx');
const Fuse = require('fuse.js');
const path = require('path');

module.exports = (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Método no permitido' });
        return;
    }

    const termino = req.query.termino ? req.query.termino.toLowerCase() : '';

    try {
        // --- BÚSQUEDA EN Data.xlsx ---
        const filePath = path.join(process.cwd(), 'data', 'Data.xlsx');
        console.log('Ruta del archivo Data.xlsx:', filePath);

        const workbook = xlsx.readFile(filePath);
        console.log('Hojas disponibles en Data.xlsx:', workbook.SheetNames);

        const worksheet = workbook.Sheets['Datos_generales'];
        if (!worksheet) {
            console.error('Hoja "Datos_generales" no encontrada en Data.xlsx.');
            return res.status(404).json({ message: 'Hoja "Datos_generales" no encontrada en Data.xlsx.' });
        }

        const datos = xlsx.utils.sheet_to_json(worksheet);
        console.log('Datos leídos de Data.xlsx:', datos);

        if (datos.length === 0) {
            console.warn('No se encontraron datos en la hoja "Datos_generales" de Data.xlsx.');
            return res.status(404).json({ message: 'No se encontraron datos en la hoja "Datos_generales" de Data.xlsx.' });
        }

        const fuse = new Fuse(datos, {
            keys: ['Nombre de la encuesta'], // Cambia si necesitas buscar en otra columna
            threshold: 0.4 // Ajusta el umbral para mayor o menor sensibilidad
        });

        const resultados = fuse.search(termino).map(result => result.item);

        if (resultados.length === 0) {
            console.warn('No se encontraron resultados en Data.xlsx para el término:', termino);
        }

        // --- BÚSQUEDA EN Data1.xlsx ---
        const filePath2 = path.join(process.cwd(), 'data', 'Data1.xlsx');
        console.log('Ruta del archivo Data1.xlsx:', filePath2);

        const workbook2 = xlsx.readFile(filePath2);
        console.log('Hojas disponibles en Data1.xlsx:', workbook2.SheetNames);

        const worksheet2 = workbook2.Sheets['Datos_generales'];
        if (!worksheet2) {
            console.error('Hoja "Datos_generales" no encontrada en Data1.xlsx.');
            return res.status(404).json({ message: 'Hoja "Datos_generales" no encontrada en Data1.xlsx.' });
        }

        const datos2 = xlsx.utils.sheet_to_json(worksheet2);
        console.log('Datos leídos de Data1.xlsx:', datos2);

        if (datos2.length === 0) {
            console.warn('No se encontraron datos en la hoja "Datos_generales" de Data1.xlsx.');
        }

        const fuse2 = new Fuse(datos2, {
            keys: ['Nombre de la encuesta'], // Cambia si necesitas buscar en otra columna
            threshold: 0.4 // Ajusta el umbral para mayor o menor sensibilidad
        });

        const resultados2 = fuse2.search(termino).map(result => result.item);

        if (resultados2.length === 0) {
            console.warn('No se encontraron resultados en Data1.xlsx para el término:', termino);
        }

        // --- RESPUESTA AL CLIENTE ---
        res.status(200).json({
            resultadosDeData: resultados,   // Resultados de Data.xlsx
            resultadosDeData1: resultados2 // Resultados de Data1.xlsx
        });

    } catch (error) {
        console.error('Error al procesar la búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


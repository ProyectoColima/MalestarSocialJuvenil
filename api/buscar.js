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
        const filePath1 = path.join(process.cwd(), 'data', 'Data.xlsx');
        console.log('Ruta del archivo Data.xlsx:', filePath1);

        const workbook1 = xlsx.readFile(filePath1);
        console.log('Hojas disponibles en Data.xlsx:', workbook1.SheetNames);

        const worksheet1 = workbook1.Sheets['Datos_generales'];
        if (!worksheet1) {
            console.error('Hoja "Datos_generales" no encontrada en Data.xlsx.');
            return res.status(404).json({ message: 'Hoja "Datos_generales" no encontrada en Data.xlsx.' });
        }

        const datos1 = xlsx.utils.sheet_to_json(worksheet1);
        console.log('Datos leídos de Data.xlsx:', datos1);

        if (datos1.length === 0) {
            console.warn('No se encontraron datos en la hoja "Datos_generales" de Data.xlsx.');
        }

        const fuse1 = new Fuse(datos1, {
            keys: ['Nombre de la encuesta'], // Cambia si necesitas buscar en otra columna
            threshold: 0.4 // Ajusta el umbral para mayor o menor sensibilidad
        });

        const resultados1 = fuse1.search(termino).map(result => result.item);

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

        // --- FORMATO DE RESPUESTA ---
        res.status(200).json({
            resultadosArchivo1: resultados1, // Resultados de Data.xlsx
            resultadosArchivo2: resultados2  // Resultados de Data1.xlsx
        });
    } catch (error) {
        console.error('Error al procesar la búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

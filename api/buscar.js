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
        // Ruta relativa dentro de la función serverless
        const workbook = xlsx.readFile(path.join(process.cwd(), 'data', 'Data.xlsx'));
        const worksheet = workbook.Sheets['Datos generales'];
        
        if (!worksheet) {
            return res.status(404).json({ message: 'Hoja "Datos generales" no encontrada.' });
        }
        
        const datos = xlsx.utils.sheet_to_json(worksheet);
        
        if (datos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron datos en la hoja "Datos generales".' });
        }

        // Configuración de Fuse.js para coincidencias aproximadas
        const fuse = new Fuse(datos, {
            keys: ['Nombre de la encuesta'],
            threshold: 0.4 // Ajusta el umbral para mayor o menor sensibilidad
        });

        // Realizar búsqueda con coincidencias aproximadas
        const resultados = fuse.search(termino).map(result => result.item);

        // Enviar resultados al cliente
        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al procesar la búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

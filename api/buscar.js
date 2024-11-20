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
        // Verificar la ruta del archivo
        const filePath = path.join(process.cwd(), 'data', 'Data1.xlsx');
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
};

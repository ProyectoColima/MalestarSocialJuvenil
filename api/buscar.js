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
        // Función para procesar cada archivo y hoja
        const procesarArchivo = (nombreArchivo) => {
            const workbook = xlsx.readFile(path.join(process.cwd(), 'data', nombreArchivo));
            const worksheet = workbook.Sheets['Datos generales']; // Cambia según el nombre de la hoja

            if (!worksheet) {
                console.warn(`Hoja "Datos generales" no encontrada en ${nombreArchivo}.`);
                return [];
            }

            const datos = xlsx.utils.sheet_to_json(worksheet);

            if (datos.length === 0) {
                console.warn(`No se encontraron datos en la hoja "Datos generales" de ${nombreArchivo}.`);
                return [];
            }

            return datos;
        };

        // Procesar ambos archivos
        const datosArchivo1 = procesarArchivo('Data.xlsx');
        const datosArchivo2 = procesarArchivo('Data1.xlsx');

        // Combinar los datos de ambos archivos
        const todosLosDatos = [...datosArchivo1, ...datosArchivo2];

        if (todosLosDatos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron datos en los archivos proporcionados.' });
        }

        // Configuración de Fuse.js para coincidencias aproximadas
        const fuse = new Fuse(todosLosDatos, {
            keys: ['Nombre de la encuesta'], // Cambia el campo si es necesario
            threshold: 0.4 // Ajusta el umbral para mayor o menor sensibilidad
        });

        // Realizar búsqueda con coincidencias aproximadas
        const resultados = fuse.search(termino).map(result => result.item);

        if (resultados.length === 0) {
            return res.status(404).json({ message: 'No se encontraron resultados para el término buscado.' });
        }

        // Enviar resultados al cliente
        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al procesar la búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

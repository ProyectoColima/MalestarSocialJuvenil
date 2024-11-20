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
        // Función para buscar en un archivo específico
        const buscarEnArchivo = (nombreArchivo) => {
            const filePath = path.join(process.cwd(), 'data', nombreArchivo);
            console.log(`Leyendo archivo: ${filePath}`);

            const workbook = xlsx.readFile(filePath);
            console.log(`Hojas disponibles en ${nombreArchivo}:`, workbook.SheetNames);

            const worksheet = workbook.Sheets['Datos_generales'];
            if (!worksheet) {
                console.warn(`Hoja "Datos_generales" no encontrada en ${nombreArchivo}`);
                return [];
            }

            const datos = xlsx.utils.sheet_to_json(worksheet);
            console.log(`Datos leídos de ${nombreArchivo}:`, datos);

            // Configuración de Fuse.js para coincidencias aproximadas
            const fuse = new Fuse(datos, {
                keys: ['Nombre de la encuesta'], // Ajusta el campo si es necesario
                threshold: 0.4 // Ajusta el umbral para mayor o menor sensibilidad
            });

            // Realizar búsqueda con coincidencias aproximadas
            const resultados = fuse.search(termino).map(result => result.item);
            return resultados;
        };

        // Buscar en ambos archivos
        const resultadosArchivo1 = buscarEnArchivo('Data.xlsx');
        const resultadosArchivo2 = buscarEnArchivo('Data1.xlsx');

        // Formatear la respuesta
        const respuesta = {
            resultadosArchivo1,
            resultadosArchivo2,
        };

        // Enviar respuesta al cliente
        res.status(200).json(respuesta);
    } catch (error) {
        console.error('Error al procesar la búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

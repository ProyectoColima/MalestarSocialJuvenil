const xlsx = require('xlsx');
const Fuse = require('fuse.js');
const path = require('path');

let datos = [];  // Variable global para almacenar los datos

module.exports = (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Método no permitido' });
        return;
    }

    const { termino, id } = req.query; // Obtener los parámetros de la consulta

    // Si 'id' es proporcionado, devolver los detalles de la encuesta
    if (id) {
        const encuesta = datos.find(item => item.ID === id);
        if (encuesta) {
            return res.status(200).json(encuesta);  // Devolver la encuesta encontrada
        } else {
            return res.status(404).json({ message: 'Encuesta no encontrada.' });
        }
    }

    // Si 'termino' es proporcionado, realizar la búsqueda
    if (termino) {
        try {
            const filePath = path.join(process.cwd(), 'public', 'data', 'Data3.xlsx');
            console.log('Ruta del archivo:', filePath);

            // Leer el archivo Excel solo una vez
            if (datos.length === 0) {
                const workbook = xlsx.readFile(filePath);
                console.log('Hojas disponibles:', workbook.SheetNames);

                const worksheet = workbook.Sheets['Datos Generales'];
                if (!worksheet) {
                    console.error('Hoja "Datos Generales" no encontrada en el archivo.');
                    return res.status(404).json({ message: 'Hoja "Datos Generales" no encontrada.' });
                }

                // Leer los datos de la hoja
                datos = xlsx.utils.sheet_to_json(worksheet);
                console.log('Datos leídos:', datos);

                if (datos.length === 0) {
                    console.warn('No se encontraron datos en la hoja "Datos Generales".');
                    return res.status(404).json({ message: 'No se encontraron datos en la hoja "Datos Generales".' });
                }
            }

            // Configuración de Fuse.js para coincidencias aproximadas
            const fuse = new Fuse(datos, {
                keys: ['Nombre de la encuesta'],
                threshold: 0.4
            });

            // Realizar búsqueda con coincidencias aproximadas
            const resultados = fuse.search(termino).map(result => result.item);

            if (resultados.length === 0) {
                console.warn('No se encontraron resultados para el término:', termino);
                return res.status(404).json({ message: 'No se encontraron resultados para el término buscado.' });
            }

            // Agregar el ID de la encuesta para que se use en el enlace de detalles
            resultados.forEach(encuesta => {
                encuesta.detailsLink = `/detalles_encuesta.html?id=${encuesta['ID']}`;  // Agregar el enlace de detalles
            });

            // Enviar resultados al cliente con el enlace agregado
            res.status(200).json(resultados);
        } catch (error) {
            console.error('Error al procesar la búsqueda:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

const xlsx = require('xlsx');
const Fuse = require('fuse.js');
const path = require('path');

let datos = [];  // Variable global para almacenar los datos
let datosCargados = false; // Para saber si ya se cargaron

module.exports = (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { termino, id } = req.query; 

    try {
        // Cargar datos si aún no se han cargado
        if (!datosCargados) {
            const filePath = path.join(process.cwd(), 'data', 'Data3.xlsx');
            console.log('Ruta del archivo:', filePath);

            const workbook = xlsx.readFile(filePath);
            console.log('Hojas disponibles:', workbook.SheetNames);

            const worksheet = workbook.Sheets['Datos Generales'];
            if (!worksheet) {
                console.error('Hoja "Datos Generales" no encontrada.');
                return res.status(404).json({ message: 'Hoja "Datos Generales" no encontrada.' });
            }

            datos = xlsx.utils.sheet_to_json(worksheet);
            console.log('Datos leídos:', datos);

            if (datos.length === 0) {
                console.warn('No se encontraron datos en "Datos Generales".');
                return res.status(404).json({ message: 'No se encontraron datos.' });
            }

            datosCargados = true;
        }

        // Si se solicita por id
        if (id) {
            const encuestaID = parseInt(id, 10); // Convertir el id a número
            const encuesta = datos.find(item => item.ID === encuestaID);
            if (encuesta) {
                return res.status(200).json(encuesta);
            } else {
                return res.status(404).json({ message: 'Encuesta no encontrada.' });
            }
        }

        // Si se solicita por termino
        if (termino) {
            const fuse = new Fuse(datos, {
                keys: ['Nombre de la encuesta'],
                threshold: 0.4
            });

            const resultados = fuse.search(termino).map(r => r.item);

            if (resultados.length === 0) {
                console.warn('No se encontraron resultados para:', termino);
                return res.status(404).json({ message: 'No se encontraron resultados.' });
            }

            resultados.forEach(encuesta => {
                encuesta.detailsLink = `/detalles_encuesta.html?id=${encuesta['ID']}`;
            });

            return res.status(200).json(resultados);
        }

        // Si no se pasó ni termino ni id
        return res.status(400).json({ message: 'Parámetro término o id requerido.' });

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

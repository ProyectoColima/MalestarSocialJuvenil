document.addEventListener('DOMContentLoaded', function() {
    // Obtener el parámetro "id" de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idEspecifico = urlParams.get('id');

    // Elemento donde mostraremos los detalles de la encuesta
    const detailsDiv = document.getElementById('encuesta-details');
    
    if (!idEspecifico) {
        detailsDiv.innerHTML = '<p class="text-danger text-center">ID de encuesta no proporcionado.</p>';
        return;
    }

    // Simular datos desde la hoja "Tablas_por_ID" (esto será una petición real más adelante)
    const datosTablasPorID = [
        {
            "ID específico": "123",
            "Nombre de la encuesta": "Encuesta de Opinión Pública",
            "Fecha de registro": "2023-11-10",
            "Última actualización": "2023-11-15",
            "Objetivo": "Medir la percepción de satisfacción",
            "Muestreo": "500 personas",
            "Cobertura geográfica": "Colima",
            "Sección": "Política y Sociedad"
        },
        {
            "ID específico": "124",
            "Nombre de la encuesta": "Encuesta de Salud Pública",
            "Fecha de registro": "2023-11-05",
            "Última actualización": "2023-11-12",
            "Objetivo": "Evaluar el acceso a servicios de salud",
            "Muestreo": "300 personas",
            "Cobertura geográfica": "Manzanillo",
            "Sección": "Salud"
        }
    ];

    // Buscar el ID específico en los datos
    const encuestaSeleccionada = datosTablasPorID.find(encuesta => encuesta["ID específico"] === idEspecifico);

    if (!encuestaSeleccionada) {
        detailsDiv.innerHTML = '<p class="text-danger text-center">No se encontraron datos para el ID proporcionado.</p>';
        return;
    }

    // Crear una tabla para mostrar los datos
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');

    const tbody = document.createElement('tbody');
    for (const key in encuestaSeleccionada) {
        const tr = document.createElement('tr');
        
        const th = document.createElement('th');
        th.textContent = key;
        tr.appendChild(th);
        
        const td = document.createElement('td');
        td.textContent = encuestaSeleccionada[key];
        tr.appendChild(td);
        
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    detailsDiv.innerHTML = ''; // Limpiar contenido previo
    detailsDiv.appendChild(table);
});

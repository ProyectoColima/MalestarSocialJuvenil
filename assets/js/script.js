const baseUrl = '/api';

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Eliminamos el listener de construcción ya que ya no es necesario
});

function buscarEncuesta() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    fetch(`${baseUrl}/buscar?termino=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Crear una fila Bootstrap para organizar las tarjetas en filas de dos
                let row;
                data.forEach((encuesta, index) => {
                    // Crear una nueva fila cada dos tarjetas
                    if (index % 2 === 0) {
                        row = document.createElement('div');
                        row.classList.add('row', 'mb-4'); // Espacio entre filas
                        resultsDiv.appendChild(row); // Añadir la fila al contenedor de resultados
                    }

                    // Crear una columna que ocupe la mitad de la pantalla para cada tarjeta
                    const col = document.createElement('div');
                    col.classList.add('col-md-6', 'mb-3'); // La tarjeta ocupará la mitad del ancho en pantallas medianas en adelante

                    // Crear una tarjeta para cada encuesta
                    const card = document.createElement('div');
                    card.classList.add('card', 'shadow-sm');

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    // Crear la tabla dentro de la tarjeta
                    const table = document.createElement('table');
                    table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');

                    const tbody = document.createElement('tbody');

                    // Agregar solo el campo "Nombre de la encuesta"
                    const trNombre = document.createElement('tr');
                    const thNombre = document.createElement('th');
                    thNombre.textContent = 'Nombre de la encuesta';
                    const tdNombre = document.createElement('td');
                    tdNombre.textContent = encuesta['Nombre de la encuesta'];
                    trNombre.appendChild(thNombre);
                    trNombre.appendChild(tdNombre);
                    tbody.appendChild(trNombre);

                    // Agregar solo el campo "Fecha última actualización"
                    const trFecha = document.createElement('tr');
                    const thFecha = document.createElement('th');
                    thFecha.textContent = 'Fecha última actualización';
                    const tdFecha = document.createElement('td');
                    tdFecha.textContent = encuesta['Fecha ultima actualización'];
                    trFecha.appendChild(thFecha);
                    trFecha.appendChild(tdFecha);
                    tbody.appendChild(trFecha);

                    // Agregar un enlace para "Ver estadísticas de la encuesta"
                    const trLink = document.createElement('tr');
                    const thLink = document.createElement('th');
                    thLink.textContent = 'Estadísticas';
                    const tdLink = document.createElement('td');
                    const link = document.createElement('a');
                    link.href = `/detalles_encuesta.html?id=${encuesta['ID']}`; // Redirige al detalle de la encuesta
                    link.textContent = 'Ver estadísticas de la encuesta';
                    tdLink.appendChild(link);
                    trLink.appendChild(thLink);
                    trLink.appendChild(tdLink);
                    tbody.appendChild(trLink);

                    // Añadir la tabla a la tarjeta
                    table.appendChild(tbody);
                    cardBody.appendChild(table);
                    card.appendChild(cardBody);
                    col.appendChild(card); // Añadir la tarjeta a la columna
                    row.appendChild(col); // Añadir la columna a la fila actual
                });
            } else {
                resultsDiv.innerHTML = '<p class="text-center">No se encontraron resultados.</p>';
            }
        })
        .catch(error => {
            console.error('Error al realizar la búsqueda:', error);
            resultsDiv.innerHTML = '<p class="text-center text-danger">Hubo un error en la búsqueda.</p>';
        });
}

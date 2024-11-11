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
                const excludeFields = ['ID', 'Fecha de registro', 'Quién registró la encuesta', 'Última actualización'];
                
                data.forEach((encuesta, index) => {
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

                    for (const key in encuesta) {
                        if (encuesta.hasOwnProperty(key) && !excludeFields.includes(key)) {
                            const tr = document.createElement('tr');
                            
                            const th = document.createElement('th');
                            th.textContent = key;
                            tr.appendChild(th);
                            
                            const td = document.createElement('td');
                            td.textContent = encuesta[key];
                            tr.appendChild(td);
                            
                            tbody.appendChild(tr);
                        }
                    }

                    table.appendChild(tbody);
                    cardBody.appendChild(table);
                    card.appendChild(cardBody);
                    col.appendChild(card); // Añadir la tarjeta a la columna
                    resultsDiv.appendChild(col); // Añadir la columna al contenedor de resultados
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

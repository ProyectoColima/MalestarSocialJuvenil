const baseUrl = '/api';

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const constructionAlert = document.querySelector('.sitio-construccion');
    constructionAlert.addEventListener('click', () => {
        alert('Este sitio está en construcción.');
    });
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
                data.forEach(encuesta => {
                    const table = document.createElement('table');
                    table.classList.add('table', 'table-bordered');

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
                    resultsDiv.appendChild(table);
                });
            } else {
                resultsDiv.innerHTML = '<p>No se encontraron resultados.</p>';
            }
        })
        .catch(error => {
            console.error('Error al realizar la búsqueda:', error);
            resultsDiv.innerHTML = '<p>Hubo un error en la búsqueda.</p>';
        });
}
